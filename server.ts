import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db } from './server/db.ts';
import {
  generateWhatsAppMessage,
  generateWhatsAppUrl,
  generateEmailPayload
} from './src/utils/notification.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// API Routes

// 1. Products API
app.get('/api/products', (req: Request, res: Response) => {
  try {
    let products = db.getProducts();
    const { category, search } = req.query;

    if (category && typeof category === 'string' && category !== 'all') {
      products = products.filter((p) => p.category === category);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tamilName.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q)
      );
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const product = db.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// Admin product addition feature
app.post('/api/products', (req: Request, res: Response) => {
  try {
    const {
      name,
      tamilName,
      category,
      categoryLabel,
      price,
      originalPrice,
      images,
      fabric,
      description,
      tamilDescription,
      sizes,
      colors,
      stock,
      isAssured,
      featured
    } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Product name and price are required' });
    }

    const numPrice = Number(price);
    const numOrig = Number(originalPrice || price);
    const discountPercent = numOrig > numPrice ? Math.round(((numOrig - numPrice) / numOrig) * 100) : 0;

    const newProduct = db.addProduct({
      name,
      tamilName: tamilName || name,
      category: category || 'sarees',
      categoryLabel: categoryLabel || 'Indian Ethnic Wear',
      price: numPrice,
      originalPrice: numOrig,
      discountPercent,
      rating: 4.5,
      ratingCount: 1,
      images: Array.isArray(images) && images.length > 0 ? images : [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
      ],
      fabric: fabric || 'Pure Silk & Cotton Blend',
      description: description || 'Authentic traditional Indian ethnic garment with fine craftsmanship.',
      tamilDescription: tamilDescription || 'பாரம்பரிய இந்திய கலாச்சார ஆடை. உயர்தர வேலைப்பாடு.',
      sizes: Array.isArray(sizes) && sizes.length > 0 ? sizes : ['Free Size'],
      colors: Array.isArray(colors) && colors.length > 0 ? colors : ['Traditional Multi'],
      stock: Number(stock || 20),
      isAssured: Boolean(isAssured !== false),
      featured: Boolean(featured)
    });

    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

app.put('/api/products/:id', (req: Request, res: Response) => {
  const updated = db.updateProduct(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(updated);
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
  const success = db.deleteProduct(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ success: true, message: 'Product deleted successfully' });
});

// 2. Orders API
app.get('/api/orders', (req: Request, res: Response) => {
  const orders = db.getOrders();
  res.json(orders);
});

app.get('/api/orders/:id', (req: Request, res: Response) => {
  const order = db.getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});

// Place new order
app.post('/api/orders', (req: Request, res: Response) => {
  try {
    const { customer, items, pricing, paymentMethod, paymentDetails, paymentStatus } = req.body;

    if (!customer || !customer.name || !customer.phone || !customer.addressLine) {
      return res.status(400).json({ error: 'Complete delivery details are required' });
    }

    if (!items || !items.length) {
      return res.status(400).json({ error: 'Cart cannot be empty' });
    }

    const order = db.createOrder({
      customer,
      items,
      pricing: pricing || {
        totalMRP: items.reduce((acc: number, i: any) => acc + (i.originalPrice || i.price) * i.quantity, 0),
        discount: 0,
        subtotal: items.reduce((acc: number, i: any) => acc + i.price * i.quantity, 0),
        deliveryFee: 0,
        packagingFee: 29,
        totalPayable: items.reduce((acc: number, i: any) => acc + i.price * i.quantity, 0) + 29
      },
      paymentMethod: paymentMethod || 'COD',
      paymentDetails,
      paymentStatus: paymentStatus || (paymentMethod === 'UPI' ? 'PAID' : 'COD_VERIFIED')
    });

    // Generate WhatsApp and Email payloads
    const notificationPayload = {
      orderId: order.orderNumber,
      date: order.date,
      customer: order.customer,
      items: order.items.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        price: i.price,
        size: i.selectedSize,
        color: i.selectedColor
      })),
      totalAmount: order.pricing.totalPayable,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus
    };

    const whatsappUrl = generateWhatsAppUrl(notificationPayload);
    const whatsappMessage = generateWhatsAppMessage(notificationPayload);
    const emailPayload = generateEmailPayload(notificationPayload);

    console.log(`[ORDER DISPATCH] Order #${order.orderNumber} placed by ${customer.name}`);
    console.log(`[WHATSAPP DISPATCH TO 6374823101]:\n${whatsappMessage}`);
    console.log(`[EMAIL DISPATCH TO kavaiyaraalsuesienmuga1234@gmail.com]: ${emailPayload.subject}`);

    res.status(201).json({
      success: true,
      order,
      whatsappUrl,
      whatsappMessage,
      emailPayload
    });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: 'Failed to process order' });
  }
});

app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
  const { status } = req.body;
  const updated = db.updateOrderStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(updated);
});

// 3. Customers API
app.get('/api/customers', (req: Request, res: Response) => {
  const customers = db.getCustomers();
  res.json(customers);
});

// 4. Logins & Auth Log API
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { identifier, customerName, type, otp } = req.body;
  if (!identifier) {
    return res.status(400).json({ error: 'Phone or email is required' });
  }

  const log = db.recordLogin({
    identifier,
    customerName: customerName || 'Valued Shopper',
    type: type || 'PHONE_OTP',
    status: 'SUCCESS',
    ipAddress: req.ip || '127.0.0.1',
    userAgent: req.headers['user-agent'] || 'Web Client'
  });

  res.json({
    success: true,
    user: {
      identifier,
      name: customerName || 'Valued Shopper'
    },
    log
  });
});

app.get('/api/auth/logins', (req: Request, res: Response) => {
  const logins = db.getLogins();
  res.json(logins);
});

// 5. Notifications Log API
app.get('/api/notifications', (req: Request, res: Response) => {
  const notifications = db.getNotifications();
  res.json(notifications);
});

// 6. Admin Stats API
app.get('/api/stats', (req: Request, res: Response) => {
  const stats = db.getStats();
  res.json(stats);
});

// 7. Dedicated Database File Export
app.get('/api/database/export', (req: Request, res: Response) => {
  const dbPath = path.resolve(process.cwd(), 'data/ecommerce_database.json');
  if (fs.existsSync(dbPath)) {
    res.download(dbPath, 'ecommerce_database.json');
  } else {
    res.status(404).json({ error: 'Database file not found' });
  }
});

// Setup Frontend serving
async function setupVite() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT} (env: ${isProd ? 'production' : 'development'})`);
  });
}

setupVite();
