import fs from 'fs';
import path from 'path';

export interface Product {
  id: string;
  name: string;
  tamilName: string;
  category: 'sarees' | 'silk-sarees' | 'chudidhars' | 'kurtis' | 'lehengas';
  categoryLabel: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  ratingCount: number;
  images: string[];
  fabric: string;
  description: string;
  tamilDescription: string;
  sizes: string[];
  colors: string[];
  stock: number;
  isAssured: boolean;
  isBestSeller?: boolean;
  featured?: boolean;
  createdAt: string;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  date: string;
  createdAt: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: {
    productId: string;
    name: string;
    tamilName?: string;
    image: string;
    price: number;
    originalPrice: number;
    quantity: number;
    selectedSize?: string;
    selectedColor?: string;
  }[];
  pricing: {
    totalMRP: number;
    discount: number;
    subtotal: number;
    deliveryFee: number;
    packagingFee: number;
    totalPayable: number;
  };
  paymentMethod: 'UPI' | 'COD' | 'CARD' | 'NET_BANKING';
  paymentDetails?: {
    upiApp?: string;
    upiId?: string;
    transactionRef?: string;
  };
  paymentStatus: 'PAID' | 'PENDING' | 'COD_VERIFIED';
  orderStatus: 'ORDER_PLACED' | 'PACKED' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  courier: {
    partner: string;
    trackingNumber: string;
    estimatedDelivery: string;
  };
  notifications: {
    whatsappSent: boolean;
    whatsappTo: string;
    emailSent: boolean;
    emailTo: string;
    sentAt: string;
  };
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  ordersCount: number;
  totalSpent: number;
  lastLogin: string;
  createdAt: string;
}

export interface LoginLog {
  id: string;
  identifier: string;
  customerName?: string;
  type: 'PHONE_OTP' | 'EMAIL_OTP' | 'PASSWORD';
  status: 'SUCCESS' | 'FAILED';
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

export interface NotificationLog {
  id: string;
  orderId: string;
  type: 'WHATSAPP' | 'EMAIL';
  recipient: string;
  contentSummary: string;
  status: 'SENT' | 'PENDING' | 'FAILED';
  timestamp: string;
}

export interface DatabaseSchema {
  version: string;
  lastUpdated: string;
  products: Product[];
  orders: CustomerOrder[];
  customers: Customer[];
  logins: LoginLog[];
  notifications: NotificationLog[];
  settings: {
    whatsappNumber: string;
    adminEmail: string;
    storeName: string;
    storeUpiId: string;
  };
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'ecommerce_database.json');

// Generate 50 Complete Authentic Indian Dress Collections
const ALL_50_PRODUCTS_DATA: Omit<Product, 'id' | 'createdAt'>[] = [
  // 1-15: Sarees & Silk Sarees
  {
    name: 'Kanchipuram Pure Silk Bridal Wedding Saree with Pure Zari Border',
    tamilName: 'காஞ்சிபுரம் பட்டு திருமணப் புடவை (ஜரிகை பார்டர்)',
    category: 'silk-sarees',
    categoryLabel: 'Pure Silk Sarees',
    price: 4999,
    originalPrice: 10999,
    discountPercent: 54,
    rating: 4.8,
    ratingCount: 2340,
    images: ['/images/products/dress-1.jpg', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'],
    fabric: 'Pure Kanchipuram Mulberry Silk',
    description: 'Exquisite handloom Kanchipuram silk saree with rich gold zari pallu and traditional temple border motifs. Includes matching unstitched blouse piece.',
    tamilDescription: 'பாரம்பரிய காஞ்சிபுரம் மல்பெரி பட்டுச் சேலை. மாங்கல்ய விசேஷங்கள் மற்றும் திருவிழாக்களுக்கு ஏற்ற ஆடம்பர தங்க ஜரிகை வேலைப்பாடு.',
    sizes: ['Free Size (6.3m with blouse)'],
    colors: ['Bridal Crimson Red', 'Peacock Blue', 'Royal Emerald Green'],
    stock: 25,
    isAssured: true,
    isBestSeller: true,
    featured: true
  },
  {
    name: 'Banarasi Georgette Floral Jaal Zari Woven Saree',
    tamilName: 'பனாரசி ஜார்ஜெட் பூ வேலைப்பாடு ஜரிகை சேலை',
    category: 'sarees',
    categoryLabel: 'Designer Sarees',
    price: 2499,
    originalPrice: 5499,
    discountPercent: 55,
    rating: 4.6,
    ratingCount: 1820,
    images: ['/images/products/dress-2.jpg', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80'],
    fabric: 'Soft Banarasi Georgette',
    description: 'Lightweight Banarasi georgette saree featuring intricate silver zari floral jaal work. Ideal for evening receptions, party wear, and festive celebrations.',
    tamilDescription: 'மென்மையான பனாரசி ஜார்ஜெட் துணியில் வெள்ளி ஜரிகை பூ அலங்காரம். மாலை விருந்துகளுக்கு அழகிய தோற்றம் தரும்.',
    sizes: ['Free Size (5.5m + 0.8m Blouse)'],
    colors: ['Plum Wine', 'Powder Peach', 'Midnight Navy'],
    stock: 40,
    isAssured: true,
    isBestSeller: true,
    featured: true
  },
  {
    name: 'Handcrafted Madurai Sungudi Traditional Cotton Saree with Zari Pattu Border',
    tamilName: 'மதுரை பாரம்பரிய சுங்குடி காட்டன் சேலை',
    category: 'sarees',
    categoryLabel: 'Cotton Sarees',
    price: 999,
    originalPrice: 2199,
    discountPercent: 54,
    rating: 4.5,
    ratingCount: 940,
    images: ['/images/products/dress-3.jpg', 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80'],
    fabric: '100% Breathable Madurai Cotton',
    description: 'Authentic 100% pure Madurai Sungudi tie-dye cotton saree with zari border. Soft, cool, and comfortable for temple visits, daily wear, and summer festivals.',
    tamilDescription: 'அசல் மதுரை சுங்குடி காட்டன் புடவை. இயற்கையான சாயங்கள், மென்மையான துணி, கோவில் மற்றும் அன்றாட பயன்பாட்டிற்கு உகந்தது.',
    sizes: ['Free Size (6.0m)'],
    colors: ['Mustard Yellow with Maroon', 'Turquoise with Pink', 'Forest Green'],
    stock: 55,
    isAssured: true,
    isBestSeller: false,
    featured: true
  },
  {
    name: 'Mysore Crepe Silk Saree with Rich Gold Zari Pallu',
    tamilName: 'மைசூர் சில்க் பட்டுச் சேலை (தங்க ஜரிகை பல்லு)',
    category: 'silk-sarees',
    categoryLabel: 'Pure Silk Sarees',
    price: 2999,
    originalPrice: 5999,
    discountPercent: 50,
    rating: 4.7,
    ratingCount: 1320,
    images: ['/images/products/dress-4.jpg'],
    fabric: 'Pure Mysore Crepe Silk',
    description: 'Ultra-soft Mysore silk with classic gold zari border and glossy texture. Easy to drape and feather-light on the body.',
    tamilDescription: 'அழகிய மைசூர் சில்க் சேலை. தங்க ஜரிகை பார்டர் மற்றும் பளபளப்பான பட்டு துணி.',
    sizes: ['Free Size (6.3m)'],
    colors: ['Royal Purple', 'Coral Pink', 'Teal Blue'],
    stock: 30,
    isAssured: true,
    isBestSeller: true
  },
  {
    name: 'Chettinad Handloom Cotton Saree with Contrast Temple Border',
    tamilName: 'செட்டிநாடு கைத்தறி காட்டன் சேலை',
    category: 'sarees',
    categoryLabel: 'Cotton Sarees',
    price: 1199,
    originalPrice: 2499,
    discountPercent: 52,
    rating: 4.6,
    ratingCount: 810,
    images: ['/images/products/dress-5.jpg'],
    fabric: 'Authentic Chettinad Cotton',
    description: 'Durable, breathable handspun Chettinad cotton with vibrant checks and temple motif borders.',
    tamilDescription: 'பாரம்பரிய செட்டிநாட்டு கைத்தறி காட்டன் புடவை. கம்பீரமான நிறங்கள் மற்றும் கோவில் பார்டர்.',
    sizes: ['Free Size (5.5m + Blouse)'],
    colors: ['Maroon Mustard', 'Green Black', 'Red Yellow'],
    stock: 45,
    isAssured: true
  },
  {
    name: 'Dharmavaram Traditional Pattu Saree with Grand Brocade',
    tamilName: 'தர்மவரம் பாரம்பரிய பட்டுச் சேலை',
    category: 'silk-sarees',
    categoryLabel: 'Pure Silk Sarees',
    price: 4499,
    originalPrice: 9499,
    discountPercent: 53,
    rating: 4.8,
    ratingCount: 1650,
    images: ['/images/products/dress-6.jpg'],
    fabric: 'Dharmavaram Pure Silk',
    description: 'Heavy zari woven Dharmavaram saree renowned for wide borders and grand ceremonial pallu.',
    tamilDescription: 'ஆடம்பர தர்மவரம் பட்டுச் சேலை. அகலமான ஜரிகை பார்டர் மற்றும் கிராண்ட் பல்லு.',
    sizes: ['Free Size (6.3m)'],
    colors: ['Magenta Gold', 'Emerald Orange', 'Navy Pink'],
    stock: 20,
    isAssured: true,
    isBestSeller: true
  },
  {
    name: 'Kerala Kasavu Golden Border Traditional Festival Saree',
    tamilName: 'கேரளா கசவு பாரம்பரிய சேலை',
    category: 'sarees',
    categoryLabel: 'Traditional Sarees',
    price: 1299,
    originalPrice: 2799,
    discountPercent: 54,
    rating: 4.7,
    ratingCount: 1420,
    images: ['/images/products/dress-7.jpg'],
    fabric: 'Fine Cotton Tissue with Kasavu Zari',
    description: 'Authentic Kerala Kasavu saree with shimmering golden border. Essential attire for Onam, Vishu, and temple rituals.',
    tamilDescription: 'அசல் கேரளா கசவு பட்டு புடவை. தங்க ஜரிகை பார்டர், விசேஷ நாட்களுக்கு ஏற்றது.',
    sizes: ['Free Size (6.2m)'],
    colors: ['Off-White Gold', 'Cream Zari'],
    stock: 60,
    isAssured: true
  },
  {
    name: 'Pochampally Handloom Ikat Pure Silk Saree',
    tamilName: 'போச்சம்பள்ளி இக்கத் பட்டுச் சேலை',
    category: 'silk-sarees',
    categoryLabel: 'Pure Silk Sarees',
    price: 3799,
    originalPrice: 7999,
    discountPercent: 53,
    rating: 4.8,
    ratingCount: 1100,
    images: ['/images/products/dress-8.jpg'],
    fabric: 'Pochampally Handloom Silk',
    description: 'Distinctive geometric Ikat dyed silk saree created by master Telangana weavers.',
    tamilDescription: 'போச்சம்பள்ளி இக்கத் பட்டு சேலை. தனித்துவமான ஜியோமெட்ரிக் நெசவு கலை.',
    sizes: ['Free Size (6.3m)'],
    colors: ['Black Red Gold', 'Turquoise Navy', 'Purple Orange'],
    stock: 28,
    isAssured: true
  },
  {
    name: 'Arani Pure Soft Silk Saree with Peacock Zari Pallu',
    tamilName: 'ஆரணி மென் பட்டுச் சேலை (மயில் ஜரிகை பல்லு)',
    category: 'silk-sarees',
    categoryLabel: 'Pure Silk Sarees',
    price: 2899,
    originalPrice: 5999,
    discountPercent: 52,
    rating: 4.6,
    ratingCount: 780,
    images: ['/images/products/dress-9.jpg'],
    fabric: 'Soft Silk Handloom',
    description: 'Comfortable soft silk saree featuring embossed floral motifs and mayil (peacock) pallu.',
    tamilDescription: 'ஆரணி மென் பட்டு சேலை. மயில் புட்டா மற்றும் தங்க ஜரிகை பல்லு.',
    sizes: ['Free Size (6.3m)'],
    colors: ['Bottle Green', 'Rani Pink', 'Royal Blue'],
    stock: 35,
    isAssured: true
  },
  {
    name: 'Coimbatore Pure Cotton Temple Weave Daily Saree',
    tamilName: 'கோவை காட்டன் கோவில் புடவை',
    category: 'sarees',
    categoryLabel: 'Cotton Sarees',
    price: 899,
    originalPrice: 1899,
    discountPercent: 53,
    rating: 4.4,
    ratingCount: 650,
    images: ['/images/products/dress-10.jpg'],
    fabric: 'Pure Organic Coimbatore Cotton',
    description: 'Cool daily wear cotton saree with contrast border and minimal pallu stripes.',
    tamilDescription: 'கோவை தூய காட்டன் புடவை. எளிமையான அழகான தினசரி பயன்பாட்டு ஆடை.',
    sizes: ['Free Size (5.5m + Blouse)'],
    colors: ['Indigo White', 'Mustard Brown', 'Sage Green'],
    stock: 50,
    isAssured: true
  },
  {
    name: 'Paithani Royal Silk Saree with Muniya Border & Kalanjali Pallu',
    tamilName: 'பைதானி ராயல் சில்க் சேலை',
    category: 'silk-sarees',
    categoryLabel: 'Pure Silk Sarees',
    price: 4899,
    originalPrice: 10499,
    discountPercent: 53,
    rating: 4.9,
    ratingCount: 1980,
    images: ['/images/products/dress-11.jpg'],
    fabric: 'Pure Paithani Silk',
    description: 'Regal Maharashtrian heritage saree with tapestry weave peacock motifs and oblique square border design.',
    tamilDescription: 'ராயல் பைதானி பட்டுச் சேலை. வண்ணமயமான மயில் வேலைப்பாடு கொண்ட கிராண்ட் பல்லு.',
    sizes: ['Free Size (6.3m)'],
    colors: ['Wine Gold', 'Emerald Green', 'Royal Violet'],
    stock: 18,
    isAssured: true,
    isBestSeller: true
  },
  {
    name: 'Kota Doria Zari Weave Lightweight Festive Saree',
    tamilName: 'கோட்டா டோரியா ஜரிகை சேலை',
    category: 'sarees',
    categoryLabel: 'Designer Sarees',
    price: 1399,
    originalPrice: 2999,
    discountPercent: 53,
    rating: 4.5,
    ratingCount: 520,
    images: ['/images/products/dress-12.jpg'],
    fabric: 'Kota Doria Cotton Silk',
    description: 'Airy, checkered translucent weave enriched with delicate gold zari foliage.',
    tamilDescription: 'லேசான கோட்டா டோரியா புடவை. தங்க ஜரிகை பூ வேலைப்பாடு.',
    sizes: ['Free Size (6.0m)'],
    colors: ['Peach Pink', 'Lemon Yellow', 'Sky Blue'],
    stock: 40,
    isAssured: true
  },
  {
    name: 'Tussar Handloom Floral Printed Silk Saree with Zari Border',
    tamilName: 'டஸ்ஸர் கைத்தறி பிரிண்டட் பட்டுச் சேலை',
    category: 'silk-sarees',
    categoryLabel: 'Pure Silk Sarees',
    price: 3499,
    originalPrice: 7299,
    discountPercent: 52,
    rating: 4.7,
    ratingCount: 890,
    images: ['/images/products/dress-13.jpg'],
    fabric: 'Pure Wild Tussar Silk',
    description: 'Natural textured raw tussar silk draped in artistic digital floral prints and woven border.',
    tamilDescription: 'இயற்கையான டஸ்ஸர் பட்டு சேலை. வண்ண மலர் பிரிண்ட் மற்றும் ஜரிகை பார்டர்.',
    sizes: ['Free Size (6.3m)'],
    colors: ['Natural Beige', 'Rust Orange', 'Forest Olive'],
    stock: 25,
    isAssured: true
  },
  {
    name: 'Kanchi Pure Pattu Crimson Red Wedding Muhurtham Saree',
    tamilName: 'காஞ்சி பட்டு சிவப்பு திருமண முகூர்த்த சேலை',
    category: 'silk-sarees',
    categoryLabel: 'Pure Silk Sarees',
    price: 5299,
    originalPrice: 11499,
    discountPercent: 54,
    rating: 4.9,
    ratingCount: 3400,
    images: ['/images/products/dress-14.jpg'],
    fabric: 'Heavy Bridal Kanchipuram Silk',
    description: 'The definitive South Indian wedding saree. Double warp pure silk with solid zari pallu and rudraksha border.',
    tamilDescription: 'தென்னிந்திய திருமண முகூர்த்தத்திற்கான அசல் காஞ்சி பட்டுச் சேலை. கெட்டி ஜரிகை வேலைப்பாடு.',
    sizes: ['Free Size (6.3m with blouse)'],
    colors: ['Muhurtham Red Gold', 'Rani Pink Gold'],
    stock: 22,
    isAssured: true,
    isBestSeller: true
  },
  {
    name: 'Thirubuvanam Pure Silk Grand Pallu Traditional Saree',
    tamilName: 'திருபுவனம் பட்டு கிராண்ட் பல்லு சேலை',
    category: 'silk-sarees',
    categoryLabel: 'Pure Silk Sarees',
    price: 4199,
    originalPrice: 8999,
    discountPercent: 53,
    rating: 4.8,
    ratingCount: 920,
    images: ['/images/products/dress-15.jpg'],
    fabric: 'Pure Thirubuvanam Silk',
    description: 'Famous Thanjavur district Thirubuvanam weave with unique cross-border weaving technique.',
    tamilDescription: 'தஞ்சாவூர் திருபுவனம் பட்டு புடவை. தலைசிறந்த நெசவு கலை மற்றும் பாரம்பரிய வடிவம்.',
    sizes: ['Free Size (6.3m)'],
    colors: ['Copper Sulphate Blue', 'Deep Maroon', 'Parrot Green'],
    stock: 20,
    isAssured: true
  },

  // 16-30: Chudidhars & Salwar Suits
  {
    name: 'Heavily Embroidered Anarkali Chudidhar Set with Zari Dupatta',
    tamilName: 'அனார்கலி சுடிதார் செட் (ஜரிகை துப்பட்டாவுடன்)',
    category: 'chudidhars',
    categoryLabel: 'Chudidhar Sets',
    price: 2199,
    originalPrice: 4999,
    discountPercent: 56,
    rating: 4.7,
    ratingCount: 1450,
    images: ['/images/products/dress-16.jpg', 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=600&q=80'],
    fabric: 'Georgette Top with Santoon Bottom & Nazneen Dupatta',
    description: 'Stunning floor-length Anarkali suit set featuring mirror and thread zari work on neckline and sleeves. Comes with churidar pants and embroidered designer dupatta.',
    tamilDescription: 'கவர்ச்சிகரமான அனார்கலி சுடிதார் செட். கழுத்து மற்றும் கைகளில் நேர்த்தியான ஜரிகை நூல் வேலைப்பாடு. சுடிதார் பேன்ட் மற்றும் துப்பட்டா அடங்கியது.',
    sizes: ['M (38)', 'L (40)', 'XL (42)', 'XXL (44)'],
    colors: ['Rani Pink', 'Teal Green', 'Royal Blue'],
    stock: 30,
    isAssured: true,
    isBestSeller: true,
    featured: true
  },
  {
    name: 'Chanderi Silk Readymade Salwar Suit & Floral Jacquard Dupatta',
    tamilName: 'சந்தேரி சில்க் சல்வார் சுடிதார் செட்',
    category: 'chudidhars',
    categoryLabel: 'Salwar Chudidhars',
    price: 1599,
    originalPrice: 3499,
    discountPercent: 54,
    rating: 4.4,
    ratingCount: 810,
    images: ['/images/products/dress-17.jpg', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'],
    fabric: 'Pure Chanderi Silk Blend',
    description: 'Graceful ready-to-wear Chanderi silk salwar kameez set paired with woven organza jacquard dupatta. Lightweight elegance with premium finishing.',
    tamilDescription: 'ரெடிமேட் சந்தேரி சில்க் சல்வார் கமீஸ். உயர்தர ஜாக்கார்ட் துப்பட்டாவுடன், பண்டிகைகள் மற்றும் அலுவலக விசேஷங்களுக்கு ஏற்றது.',
    sizes: ['S (36)', 'M (38)', 'L (40)', 'XL (42)'],
    colors: ['Maroon Gold', 'Olive Green', 'Dusty Rose'],
    stock: 35,
    isAssured: true,
    isBestSeller: false,
    featured: true
  },
  {
    name: 'Daily Wear Cotton Printed Chudidhar Material with Cotton Dupatta',
    tamilName: 'காட்டன் பிரிண்டட் சுடிதார் மெட்டீரியல்',
    category: 'chudidhars',
    categoryLabel: 'Cotton Chudidhars',
    price: 799,
    originalPrice: 1799,
    discountPercent: 55,
    rating: 4.3,
    ratingCount: 650,
    images: ['/images/products/dress-18.jpg'],
    fabric: '100% Pure Cambric Cotton',
    description: 'High-quality unstitched pure cotton salwar suit dress material with floral printed top, solid salwar bottom, and soft malmal dupatta.',
    tamilDescription: 'தினசரி அணியக்கூடிய 100% தூய காட்டன் சுடிதார் மெட்டீரியல். துவைத்து பயன்படுத்த எளிதானது, நிறம் மங்காது.',
    sizes: ['Unstitched (Top 2.5m, Bottom 2.0m, Dupatta 2.25m)'],
    colors: ['Indigo Blue', 'Maroon Mustard', 'Sage Green'],
    stock: 50,
    isAssured: true
  },
  {
    name: 'Lucknowi Chikankari Hand-Embroidered Georgette Chudidhar Set',
    tamilName: 'லக்னோவி சிக்கன்காரி சுடிதார் செட்',
    category: 'chudidhars',
    categoryLabel: 'Chudidhar Sets',
    price: 2299,
    originalPrice: 4799,
    discountPercent: 52,
    rating: 4.8,
    ratingCount: 1350,
    images: ['/images/products/dress-19.jpg'],
    fabric: 'Pure Viscose Georgette with Cotton Lining',
    description: 'Delicate handmade Chikankari shadow-work embroidery on soft pastel georgette. Comes with matching pants and mukaish work dupatta.',
    tamilDescription: 'கைவேலைப்பாடு கொண்ட லக்னோவி சிக்கன்காரி சுடிதார் செட். நளினமான பார்ட்டி தோற்றம் தரும்.',
    sizes: ['S (36)', 'M (38)', 'L (40)', 'XL (42)'],
    colors: ['Pastel Lavender', 'Powder Blue', 'Mint Green'],
    stock: 25,
    isAssured: true,
    isBestSeller: true
  },
  {
    name: 'Patiala Punjabi Suit with Phulkari Heavy Dupatta',
    tamilName: 'பட்டியாலா சல்வார் சூட் செட்',
    category: 'chudidhars',
    categoryLabel: 'Salwar Chudidhars',
    price: 1899,
    originalPrice: 3999,
    discountPercent: 53,
    rating: 4.6,
    ratingCount: 920,
    images: ['/images/products/dress-20.jpg'],
    fabric: 'Glaze Cotton Kurti with Silk Phulkari Dupatta',
    description: 'Vibrant Punjabi pleated Patiala suit coupled with multi-colored handloom Phulkari embroidered dupatta.',
    tamilDescription: 'பட்டியாலா சல்வார் சூட் செட். பல வண்ண பூல்ஹாரி துப்பட்டாவுடன் கவர்ச்சிகரமான தோற்றம்.',
    sizes: ['M (38)', 'L (40)', 'XL (42)', 'XXL (44)'],
    colors: ['Bright Yellow Red', 'Turquoise Pink', 'Emerald Orange'],
    stock: 30,
    isAssured: true
  },
  {
    name: 'Angrakha Flared Pure Cotton Chudidhar with Latkan Tassels',
    tamilName: 'அங்ரகா ஃப்ளேர்டு காட்டன் சுடிதார்',
    category: 'chudidhars',
    categoryLabel: 'Chudidhar Sets',
    price: 1499,
    originalPrice: 3199,
    discountPercent: 53,
    rating: 4.5,
    ratingCount: 710,
    images: ['/images/products/dress-21.jpg'],
    fabric: 'Pure Mulmul Cotton',
    description: 'Traditional Mughal cross-over Angrakha cut kurti with tie-up doris and gathered flares.',
    tamilDescription: 'அங்ரகா மாடல் காட்டன் சுடிதார் செட். அழகிய தொங்கட்டான் கட்டுகளுடன் கூடிய வசதியான ஆடை.',
    sizes: ['S (36)', 'M (38)', 'L (40)', 'XL (42)'],
    colors: ['Ruby Red', 'Indigo Blue', 'Marigold Yellow'],
    stock: 35,
    isAssured: true
  },
  {
    name: 'Georgette Sharara Suit Set with Gota Patti Lace Work',
    tamilName: 'ஜார்ஜெட் ஷராரா சுடிதார் செட்',
    category: 'chudidhars',
    categoryLabel: 'Chudidhar Sets',
    price: 2599,
    originalPrice: 5499,
    discountPercent: 53,
    rating: 4.8,
    ratingCount: 1620,
    images: ['/images/products/dress-22.jpg'],
    fabric: 'Heavy Faux Georgette with Santoon Inner',
    description: 'Glamorous tiered flared sharara pants paired with short kurti and metallic gota patti lace border dupatta.',
    tamilDescription: 'திருமண விசேஷங்களுக்கு ஏற்ற ஷராரா சுடிதார் செட். கோட்டா பட்டி ஜரிகை பார்டர் வேலைப்பாடு.',
    sizes: ['M (38)', 'L (40)', 'XL (42)', 'XXL (44)'],
    colors: ['Wine Burgundy', 'Bottle Green', 'Navy Blue'],
    stock: 22,
    isAssured: true,
    isBestSeller: true
  },
  {
    name: 'Kalamkari Hand-Painted Cotton Chudidhar Dress Material',
    tamilName: 'கலம்காரி காட்டன் சுடிதார் மெட்டீரியல்',
    category: 'chudidhars',
    categoryLabel: 'Cotton Chudidhars',
    price: 1099,
    originalPrice: 2299,
    discountPercent: 52,
    rating: 4.4,
    ratingCount: 580,
    images: ['/images/products/dress-23.jpg'],
    fabric: '100% Andhra Handloom Cotton',
    description: 'Natural vegetable-dyed mythological figure motifs and peacock patterns on unstitched dress fabric.',
    tamilDescription: 'பாரம்பரிய கலம்காரி இயற்கை சாய காட்டன் சுடிதார் மெட்டீரியல்.',
    sizes: ['Unstitched (Free Size)'],
    colors: ['Earth Ochre', 'Indigo Maroon', 'Sage Olive'],
    stock: 45,
    isAssured: true
  },
  {
    name: 'Printed Muslin Cotton Chudidhar Set with Malmal Dupatta',
    tamilName: 'மஸ்லின் காட்டன் சுடிதார் செட்',
    category: 'chudidhars',
    categoryLabel: 'Cotton Chudidhars',
    price: 1699,
    originalPrice: 3599,
    discountPercent: 53,
    rating: 4.6,
    ratingCount: 840,
    images: ['/images/products/dress-24.jpg'],
    fabric: 'Ultra-Soft Muslin Cotton',
    description: 'Featherweight breathable muslin cotton with hand-block floral motifs and matching straight pants.',
    tamilDescription: 'மென்மையான மஸ்லின் காட்டன் சுடிதார். தினசரி மற்றும் அலுவலக பயன்பாட்டிற்கு மிகச் சிறந்தது.',
    sizes: ['S (36)', 'M (38)', 'L (40)', 'XL (42)'],
    colors: ['Dusty Rose', 'Sky Blue', 'Ivory Mint'],
    stock: 30,
    isAssured: true
  },
  {
    name: 'Pastel Chiffon Party Wear Chudidhar with Threadwork',
    tamilName: 'ஷிப்பான் பார்ட்டி சுடிதார் செட்',
    category: 'chudidhars',
    categoryLabel: 'Chudidhar Sets',
    price: 1999,
    originalPrice: 4299,
    discountPercent: 53,
    rating: 4.5,
    ratingCount: 790,
    images: ['/images/products/dress-25.jpg'],
    fabric: 'Pure Chiffon with Micro Lining',
    description: 'Soft flowing chiffon ethnic set adorned with tonal threadwork and sequins for modern festive looks.',
    tamilDescription: 'மெல்லிய ஷிப்பான் பார்ட்டி சுடிதார். நவீன மாடல் மற்றும் நுணுக்கமான நூல் வேலைப்பாடு.',
    sizes: ['M (38)', 'L (40)', 'XL (42)'],
    colors: ['Peach Blush', 'Sea Green', 'Lavender Lilac'],
    stock: 25,
    isAssured: true
  },
  {
    name: 'South Indian Silk Chudidhar with Traditional Zari Yoke',
    tamilName: 'தென்னிந்திய பட்டு சுடிதார் செட்',
    category: 'chudidhars',
    categoryLabel: 'Chudidhar Sets',
    price: 2399,
    originalPrice: 5199,
    discountPercent: 54,
    rating: 4.7,
    ratingCount: 1190,
    images: ['/images/products/dress-26.jpg'],
    fabric: 'Art Silk with Pure Zari Embroidered Yoke',
    description: 'Rich temple motif zari weaving on neckline. Ideal for South Indian family celebrations and festivals.',
    tamilDescription: 'தென்னிந்திய கோவில் பார்டர் தங்க ஜரிகை வேலைப்பாடு கொண்ட பட்டு சுடிதார்.',
    sizes: ['M (38)', 'L (40)', 'XL (42)', 'XXL (44)'],
    colors: ['Maroon Gold', 'Peacock Blue', 'Mustard Gold'],
    stock: 28,
    isAssured: true
  },
  {
    name: 'Mirror Work Silk Blend Chudidhar Suit with Chiffon Dupatta',
    tamilName: 'மிரர் ஒர்க் சில்க் சுடிதார் சூட்',
    category: 'chudidhars',
    categoryLabel: 'Chudidhar Sets',
    price: 2099,
    originalPrice: 4499,
    discountPercent: 53,
    rating: 4.6,
    ratingCount: 880,
    images: ['/images/products/dress-27.jpg'],
    fabric: 'Silk Poly Blend with Real Glass Mirrors',
    description: 'Scintillating mirror and threadwork neckline with elegant drape and comfortable side-slit kurti.',
    tamilDescription: 'மிரர் ஒர்க் அலங்காரம் கொண்ட சில்க் சுடிதார். மாலை நேர பார்ட்டிகளுக்கு அழகிய தோற்றம்.',
    sizes: ['S (36)', 'M (38)', 'L (40)', 'XL (42)'],
    colors: ['Emerald Green', 'Royal Navy', 'Magenta'],
    stock: 30,
    isAssured: true
  },
  {
    name: 'Banarasi Brocade Straight Cut Salwar Suit Set',
    tamilName: 'பனாரசி ப்ரோகேட் சல்வார் சூட் செட்',
    category: 'chudidhars',
    categoryLabel: 'Salwar Chudidhars',
    price: 2699,
    originalPrice: 5799,
    discountPercent: 53,
    rating: 4.8,
    ratingCount: 1410,
    images: ['/images/products/dress-28.jpg'],
    fabric: 'Woven Banarasi Silk Brocade',
    description: 'Heavy gold brocade woven kameez with solid cigarette pants and lightweight organza dupatta.',
    tamilDescription: 'பனாரசி ப்ரோகேட் நெசவு சல்வார் சூட். திருமண விழாக்களுக்கு ஏற்ற கம்பீரமான உடை.',
    sizes: ['M (38)', 'L (40)', 'XL (42)'],
    colors: ['Wine Red', 'Royal Blue', 'Golden Olive'],
    stock: 20,
    isAssured: true,
    isBestSeller: true
  },
  {
    name: 'A-Line Georgette Salwar Suit with Pearl Embroidery',
    tamilName: 'ஏ-லைன் ஜார்ஜெட் முத்து வேலைப்பாடு சுடிதார்',
    category: 'chudidhars',
    categoryLabel: 'Chudidhar Sets',
    price: 2199,
    originalPrice: 4699,
    discountPercent: 53,
    rating: 4.5,
    ratingCount: 670,
    images: ['/images/products/dress-29.jpg'],
    fabric: 'Flowy Georgette',
    description: 'Flattering A-line silhouette with delicate faux pearl beads embroidered on collar and sleeves.',
    tamilDescription: 'முத்து வேலைப்பாடு கொண்ட ஏ-லைன் ஜார்ஜெட் சுடிதார் செட்.',
    sizes: ['S (36)', 'M (38)', 'L (40)', 'XL (42)'],
    colors: ['Teal Green', 'Deep Plum', 'Charcoal Grey'],
    stock: 24,
    isAssured: true
  },
  {
    name: 'Festive Velvet Embroidered Winter Chudidhar Set',
    tamilName: 'வெல்வெட் எம்பிராய்டரி விண்டர் சுடிதார் செட்',
    category: 'chudidhars',
    categoryLabel: 'Chudidhar Sets',
    price: 2899,
    originalPrice: 6299,
    discountPercent: 54,
    rating: 4.8,
    ratingCount: 950,
    images: ['/images/products/dress-30.jpg'],
    fabric: 'Micro Velvet with Warm Santoon Pants',
    description: 'Plush velvet kurti with antique gold zardozi stitching, perfect for evening weddings and cooler climates.',
    tamilDescription: 'ஆடம்பர வெல்வெட் சுடிதார் செட். குளிர்கால விசேஷங்களுக்கு உகந்தது.',
    sizes: ['M (38)', 'L (40)', 'XL (42)'],
    colors: ['Maroon Velvet', 'Dark Emerald', 'Midnight Navy'],
    stock: 18,
    isAssured: true
  },

  // 31-40: Kurtis & Indo-Western Sets
  {
    name: 'Festive Straight Silk Kurti & Cigarette Pants Set with Dupatta',
    tamilName: 'பட்டு குர்த்தி பேன்ட் செட் (துப்பட்டாவுடன்)',
    category: 'kurtis',
    categoryLabel: 'Kurtis & Suits',
    price: 1199,
    originalPrice: 2499,
    discountPercent: 52,
    rating: 4.6,
    ratingCount: 1220,
    images: ['/images/products/dress-31.jpg'],
    fabric: 'Art Silk Kurti with Cotton Silk Trousers',
    description: 'Minimalist chic straight silk kurti with straight pants and foil print dupatta. Great for family pujas and office ethnic days.',
    tamilDescription: 'பட்டு குர்த்தி மற்றும் பேன்ட் செட். எளிமையான அழகான தோற்றம் தரும் பண்டிகை ஆடை.',
    sizes: ['S (36)', 'M (38)', 'L (40)', 'XL (42)', 'XXL (44)'],
    colors: ['Mustard Yellow', 'Forest Green', 'Burgundy'],
    stock: 40,
    isAssured: true,
    isBestSeller: true
  },
  {
    name: 'A-Line Floral Printed Long Cotton Daily Wear Kurti',
    tamilName: 'ஏ-லைன் காட்டன் லாங் குர்த்தி',
    category: 'kurtis',
    categoryLabel: 'Kurtis & Suits',
    price: 699,
    originalPrice: 1499,
    discountPercent: 53,
    rating: 4.4,
    ratingCount: 890,
    images: ['/images/products/dress-32.jpg'],
    fabric: '100% Breathable Cotton',
    description: 'Comfortable flared calf-length cotton kurti with three-quarter sleeves and mandarin collar.',
    tamilDescription: 'தினசரி அணியக்கூடிய தூய காட்டன் ஏ-லைன் குர்த்தி. கோடை காலத்திற்கு மிகச் சிறந்தது.',
    sizes: ['S (36)', 'M (38)', 'L (40)', 'XL (42)'],
    colors: ['Sky Blue', 'Peach Floral', 'Mint Green'],
    stock: 55,
    isAssured: true
  },
  {
    name: 'Embroidered Rayon Flared Anarkali Kurti with Front Tassels',
    tamilName: 'ரேயான் எம்பிராய்டரி அனார்கலி குர்த்தி',
    category: 'kurtis',
    categoryLabel: 'Kurtis & Suits',
    price: 899,
    originalPrice: 1999,
    discountPercent: 55,
    rating: 4.5,
    ratingCount: 1150,
    images: ['/images/products/dress-33.jpg'],
    fabric: 'Heavy 14kg Liva Rayon',
    description: 'Flowy flared Anarkali silhouette with intricate threadwork yoke and hanging potli tassels.',
    tamilDescription: 'ரேயான் துணியில் அனார்கலி குர்த்தி. அழகான எம்பிராய்டரி கழுத்து வேலைப்பாடு.',
    sizes: ['M (38)', 'L (40)', 'XL (42)', 'XXL (44)'],
    colors: ['Navy Blue', 'Maroon', 'Bottle Green'],
    stock: 45,
    isAssured: true
  },
  {
    name: 'Front Slit Designer Silk Kurti with Flared Palazzo Pants',
    tamilName: 'ஃப்ரண்ட் ஸ்லிட் டிசைனர் குர்த்தி பலாஸோ செட்',
    category: 'kurtis',
    categoryLabel: 'Kurtis & Suits',
    price: 1299,
    originalPrice: 2699,
    discountPercent: 52,
    rating: 4.6,
    ratingCount: 780,
    images: ['/images/products/dress-34.jpg'],
    fabric: 'Chanderi Silk Blend with Crepe Palazzo',
    description: 'Contemporary front-slit kurti paired with wide-leg printed palazzo pants for a modern ethnic fusion look.',
    tamilDescription: 'நவீன மாடல் ஃப்ரண்ட் ஸ்லிட் குர்த்தி மற்றும் பலாஸோ பேன்ட் செட்.',
    sizes: ['S (36)', 'M (38)', 'L (40)', 'XL (42)'],
    colors: ['Teal Gold', 'Black Mustard', 'Rust Orange'],
    stock: 35,
    isAssured: true
  },
  {
    name: 'Jacquard Woven Silk Festive Kurti Set with Banarasi Dupatta',
    tamilName: 'ஜாக்கார்ட் பட்டு பண்டிகை குர்த்தி செட்',
    category: 'kurtis',
    categoryLabel: 'Kurtis & Suits',
    price: 1499,
    originalPrice: 3199,
    discountPercent: 53,
    rating: 4.7,
    ratingCount: 960,
    images: ['/images/products/dress-35.jpg'],
    fabric: 'Banarasi Art Silk Jacquard',
    description: 'All-over woven golden zari motifs on kurti, completed with matching churidar and brocade dupatta.',
    tamilDescription: 'தங்க ஜரிகை ஜாக்கார்ட் நெசவு குர்த்தி செட். பண்டிகைகளுக்கு பிரத்யேகமானது.',
    sizes: ['M (38)', 'L (40)', 'XL (42)'],
    colors: ['Rani Pink', 'Royal Purple', 'Emerald Green'],
    stock: 30,
    isAssured: true,
    isBestSeller: true
  },
  {
    name: 'Block Printed Indigo Handloom Cotton Long Kurti',
    tamilName: 'இண்டிகோ கைத்தறி காட்டன் குர்த்தி',
    category: 'kurtis',
    categoryLabel: 'Kurtis & Suits',
    price: 799,
    originalPrice: 1699,
    discountPercent: 53,
    rating: 4.5,
    ratingCount: 640,
    images: ['/images/products/dress-36.jpg'],
    fabric: '100% Bagru Block Print Cotton',
    description: 'Hand-block printed indigo dyed cotton kurti with traditional dabu floral patterns.',
    tamilDescription: 'அசல் இண்டிகோ கைத்தறி காட்டன் குர்த்தி. இயற்கை அச்சு வேலைப்பாடு.',
    sizes: ['S (36)', 'M (38)', 'L (40)', 'XL (42)'],
    colors: ['Deep Indigo Blue', 'Indigo White'],
    stock: 40,
    isAssured: true
  },
  {
    name: 'Gold Foil Festive Printed Flared Kurti with Gota Lace',
    tamilName: 'தங்க ஃபாயில் பிரிண்ட் குர்த்தி',
    category: 'kurtis',
    categoryLabel: 'Kurtis & Suits',
    price: 999,
    originalPrice: 2199,
    discountPercent: 55,
    rating: 4.6,
    ratingCount: 820,
    images: ['/images/products/dress-37.jpg'],
    fabric: 'Rayon Gold Foil Printed Fabric',
    description: 'Festive flare with gleaming golden geometric prints and tiered frill border.',
    tamilDescription: 'பண்டிகை காலத்திற்கான தங்க ஃபாயில் பிரிண்ட் குர்த்தி.',
    sizes: ['M (38)', 'L (40)', 'XL (42)', 'XXL (44)'],
    colors: ['Ruby Red Gold', 'Dark Green Gold', 'Navy Gold'],
    stock: 35,
    isAssured: true
  },
  {
    name: 'Khadi Handspun Natural Cotton Kurti with Wooden Buttons',
    tamilName: 'கதர் கைத்தறி காட்டன் குர்த்தி',
    category: 'kurtis',
    categoryLabel: 'Kurtis & Suits',
    price: 849,
    originalPrice: 1799,
    discountPercent: 53,
    rating: 4.4,
    ratingCount: 510,
    images: ['/images/products/dress-38.jpg'],
    fabric: 'Eco-Friendly Khadi Cotton',
    description: 'Breathable, sustainable handspun Khadi fabric with functional side pockets and wooden buttons.',
    tamilDescription: 'சுத்தமான கதர் காட்டன் குர்த்தி. இயற்கை துணி மற்றும் மர பொத்தான்கள்.',
    sizes: ['S (36)', 'M (38)', 'L (40)', 'XL (42)'],
    colors: ['Off-White', 'Earthy Brown', 'Olive Khadi'],
    stock: 45,
    isAssured: true
  },
  {
    name: 'Party Wear Velvet Tunic Kurti with Zardozi Neckline',
    tamilName: 'பார்ட்டி வேர் வெல்வெட் குர்த்தி',
    category: 'kurtis',
    categoryLabel: 'Kurtis & Suits',
    price: 1399,
    originalPrice: 2999,
    discountPercent: 53,
    rating: 4.7,
    ratingCount: 730,
    images: ['/images/products/dress-39.jpg'],
    fabric: 'Micro Velvet',
    description: 'Rich velvet tunic featuring handcrafted metallic copper zardozi work around the keyhole collar.',
    tamilDescription: 'ஆடம்பர வெல்வெட் குர்த்தி. விசேஷ இரவுகளுக்கு ஏற்ற தோற்றம்.',
    sizes: ['M (38)', 'L (40)', 'XL (42)'],
    colors: ['Wine Plum', 'Emerald Teal', 'Jet Black'],
    stock: 25,
    isAssured: true
  },
  {
    name: 'Layered Chiffon Anarkali Kurti with Shrug Jacket',
    tamilName: 'ஜாக்கெட் அனார்கலி குர்த்தி செட்',
    category: 'kurtis',
    categoryLabel: 'Kurtis & Suits',
    price: 1599,
    originalPrice: 3399,
    discountPercent: 53,
    rating: 4.6,
    ratingCount: 680,
    images: ['/images/products/dress-40.jpg'],
    fabric: 'Chiffon with Brocade Short Shrug',
    description: 'Double layer dress set with sleeveless inner gown and detachable brocade ethnic jacket.',
    tamilDescription: 'ஜாக்கெட் இணைப்புடன் கூடிய அனார்கலி குர்த்தி செட்.',
    sizes: ['S (36)', 'M (38)', 'L (40)', 'XL (42)'],
    colors: ['Peach Gold', 'Teal Navy', 'Yellow Maroon'],
    stock: 28,
    isAssured: true
  },

  // 41-50: Bridal Lehengas & Cultural Half Saree Sets
  {
    name: 'Bridal Semi-Stitched Velvet Lehenga Choli with Heavy Threadwork',
    tamilName: 'மணப்பெண் வெல்வெட் லெஹங்கா சோளி',
    category: 'lehengas',
    categoryLabel: 'Bridal Lehengas',
    price: 5499,
    originalPrice: 12999,
    discountPercent: 58,
    rating: 4.9,
    ratingCount: 1120,
    images: ['/images/products/dress-41.jpg', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'],
    fabric: 'Micro Velvet with Cancan Net Underlayer',
    description: 'Breathtaking bridal lehenga adorned with antique zari embroidery, dori work, and sequins. Double dupatta styling for a magnificent royal wedding look.',
    tamilDescription: 'ராயல் வெல்வெட் மணப்பெண் லெஹங்கா. தங்க ஜரிகை மற்றும் சீக்வன்ஸ் வேலைப்பாடுகள். ரிசப்ஷன் மற்றும் திருமண மேடைக்கு உகந்தது.',
    sizes: ['Semi-Stitched (Fits up to 44 Bust/Waist)'],
    colors: ['Deep Wine Red', 'Emerald Green', 'Royal Navy'],
    stock: 15,
    isAssured: true,
    isBestSeller: true,
    featured: true
  },
  {
    name: 'Banarasi Brocade Flared Bridal Lehenga with Embroidered Blouse',
    tamilName: 'பனாரசி ப்ரோகேட் பிரைடல் லெஹங்கா',
    category: 'lehengas',
    categoryLabel: 'Bridal Lehengas',
    price: 6499,
    originalPrice: 13999,
    discountPercent: 54,
    rating: 4.9,
    ratingCount: 1420,
    images: ['/images/products/dress-42.jpg'],
    fabric: 'Pure Banarasi Katan Silk Brocade',
    description: 'Grand 4.5 meter circular flare woven in pure gold zari patterns with sweetheart neck blouse.',
    tamilDescription: 'பனாரசி பட்டு ப்ரோகேட் லெஹங்கா. தங்க ஜரிகை வேலைப்பாடு மற்றும் எடுப்பான பளபளப்பு.',
    sizes: ['Semi-Stitched (Up to 42)'],
    colors: ['Vermillion Red', 'Hot Pink', 'Royal Purple'],
    stock: 16,
    isAssured: true,
    isBestSeller: true
  },
  {
    name: 'Kanchipuram Pattu Traditional Half Saree / Dhavani Set',
    tamilName: 'காஞ்சி பட்டு பாரம்பரிய தாவணி செட்',
    category: 'lehengas',
    categoryLabel: 'Traditional Half Sarees',
    price: 4799,
    originalPrice: 9999,
    discountPercent: 52,
    rating: 4.8,
    ratingCount: 1890,
    images: ['/images/products/dress-43.jpg'],
    fabric: 'Pure Kanchi Silk Skirt with Silk Tissue Dhavani',
    description: 'South Indian rite-of-passage half saree (Langa Voni) with authentic temple zari border skirt, contrast blouse, and tissue dupatta.',
    tamilDescription: 'தென்னிந்திய பாரம்பரிய காஞ்சி பட்டு தாவணி செட். கோவில் பார்டர் பாவாடை மற்றும் கிராண்ட் தாவணி.',
    sizes: ['Free Size (Stitched Skirt, Unstitched Blouse)'],
    colors: ['Bottle Green with Pink', 'Maroon with Mustard', 'Peacock Blue with Orange'],
    stock: 25,
    isAssured: true,
    isBestSeller: true
  },
  {
    name: 'Royal Peacock Blue Zari Embroidered Bridal Lehenga',
    tamilName: 'மயில் நீல ஜரிகை பிரைடல் லெஹங்கா',
    category: 'lehengas',
    categoryLabel: 'Bridal Lehengas',
    price: 7299,
    originalPrice: 15999,
    discountPercent: 54,
    rating: 4.9,
    ratingCount: 980,
    images: ['/images/products/dress-44.jpg'],
    fabric: 'Silk Georgette with Multi-layered Cancan',
    description: 'Exemplary artisanal zardozi embroidery depicting peacocks and floral creepers across the entire flare.',
    tamilDescription: 'அழகிய மயில் நீல பிரைடல் லெஹங்கா. திருமண வரவேற்பு நிகழ்ச்சிகளுக்கு ஏற்ற ஆடம்பரம்.',
    sizes: ['Semi-Stitched (Up to 44)'],
    colors: ['Peacock Royal Blue', 'Teal Gold'],
    stock: 12,
    isAssured: true
  },
  {
    name: 'Gujarati Mirror Work Chaniya Choli Navratri Lehenga Set',
    tamilName: 'குஜராத்தி மிரர் ஒர்க் லெஹங்கா சோளி',
    category: 'lehengas',
    categoryLabel: 'Bridal Lehengas',
    price: 4299,
    originalPrice: 8999,
    discountPercent: 52,
    rating: 4.7,
    ratingCount: 1340,
    images: ['/images/products/dress-45.jpg'],
    fabric: 'Heavy Cotton with Original Mirror Embellishment',
    description: 'Vibrant kaleidoscope mirror work skirt with Kutchi embroidered choli and bandhej dupatta.',
    tamilDescription: 'அசல் மிரர் ஒர்க் சானியா சோளி லெஹங்கா. பண்டிகைகள் மற்றும் சங்கீத் நடனத்திற்கு ஏற்றது.',
    sizes: ['Semi-Stitched (Fits 34 to 42)'],
    colors: ['Multi Color Black', 'Rani Pink Yellow', 'Emerald Rust'],
    stock: 20,
    isAssured: true
  },
  {
    name: 'Pastel Pink Bridal Reception Lehenga with Silver Cutwork',
    tamilName: 'ரிசப்ஷன் பிரைடல் லெஹங்கா (வெள்ளி ஜரிகை)',
    category: 'lehengas',
    categoryLabel: 'Bridal Lehengas',
    price: 6899,
    originalPrice: 14999,
    discountPercent: 54,
    rating: 4.9,
    ratingCount: 1150,
    images: ['/images/products/dress-46.jpg'],
    fabric: 'Italian Net with Satin Silk Inner',
    description: 'Sophisticated modern bridal reception lehenga studded with Swarovski crystals and silver cutwork.',
    tamilDescription: 'வெள்ளி ஜரிகை மற்றும் படிக வேலைப்பாடு கொண்ட ரிசப்ஷன் பிரைடல் லெஹங்கா.',
    sizes: ['Semi-Stitched (Up to 42)'],
    colors: ['Blush Pink', 'Champagne Gold', 'Powder Grey'],
    stock: 14,
    isAssured: true
  },
  {
    name: 'Maroon Velvet Royal Wedding Lehenga Gown with Trails',
    tamilName: 'மெரூன் வெல்வெட் வெட்டிங் கவுன் லெஹங்கா',
    category: 'lehengas',
    categoryLabel: 'Bridal Lehengas',
    price: 7999,
    originalPrice: 16999,
    discountPercent: 53,
    rating: 4.9,
    ratingCount: 1680,
    images: ['/images/products/dress-47.jpg'],
    fabric: '9000 Micro Velvet with Embroidered Trail Pallu',
    description: 'Opulent bridal attire featuring majestic trail pallu and antique metallic dori craft.',
    tamilDescription: 'மெரூன் வெல்வெட் வெட்டிங் லெஹங்கா. நீண்ட டிரெயில் பல்லு கொண்ட அரண்மனை தோற்றம்.',
    sizes: ['Custom Semi-Stitched (Up to 44)'],
    colors: ['Imperial Crimson Maroon', 'Burgundy Gold'],
    stock: 10,
    isAssured: true,
    isBestSeller: true
  },
  {
    name: 'Golden Tissue Traditional Half Saree Set with Contrast Blouse',
    tamilName: 'தங்க திசு பாரம்பரிய தாவணி செட்',
    category: 'lehengas',
    categoryLabel: 'Traditional Half Sarees',
    price: 4999,
    originalPrice: 10499,
    discountPercent: 52,
    rating: 4.8,
    ratingCount: 890,
    images: ['/images/products/dress-48.jpg'],
    fabric: 'Golden Tissue Handloom with Pure Brocade',
    description: 'Gleaming tissue silk pleated skirt with contrasting magenta embroidered velvet blouse and tissue dhavani.',
    tamilDescription: 'தங்க திசு தாவணி செட். பிரகாசமான தங்க பட்டு பாவாடை மற்றும் மெஜந்தா பிளவுஸ்.',
    sizes: ['Free Size (Skirt 42 Length, Blouse Piece 1m)'],
    colors: ['Gold with Magenta', 'Gold with Emerald', 'Gold with Peacock Blue'],
    stock: 22,
    isAssured: true
  },
  {
    name: 'Floral Printed Organza Lightweight Party Lehenga',
    tamilName: 'ஆர்கன்சா பூவேலைப்பாடு பார்ட்டி லெஹங்கா',
    category: 'lehengas',
    categoryLabel: 'Bridal Lehengas',
    price: 3899,
    originalPrice: 8199,
    discountPercent: 52,
    rating: 4.6,
    ratingCount: 740,
    images: ['/images/products/dress-49.jpg'],
    fabric: 'Pure Sheer Organza Silk',
    description: 'Modern lightweight organza lehenga with watercolor floral prints and subtle sequin border highlight.',
    tamilDescription: 'லேசான ஆர்கன்சா மலர் பிரிண்ட் லெஹங்கா. சங்கீத் மற்றும் பார்ட்டிகளுக்கு அழகிய ஆடை.',
    sizes: ['Semi-Stitched (Fits 34 to 42)'],
    colors: ['Lavender Floral', 'Mint Floral', 'Peach Blossom'],
    stock: 26,
    isAssured: true
  },
  {
    name: 'Aalayam Bridal Gold Border Maroon Silk Saree (Signature Collection)',
    tamilName: 'ஆலயம் மணப்பெண் தங்க ஜரிகை மென் பட்டுச் சேலை (பிரத்யேக தயாரிப்பு)',
    category: 'silk-sarees',
    categoryLabel: 'Pure Silk Sarees',
    price: 5999,
    originalPrice: 12999,
    discountPercent: 54,
    rating: 4.9,
    ratingCount: 2840,
    images: ['/images/products/dress-50.jpg'],
    fabric: '100% Kanchipuram Mulberry Silk with Pure Zari',
    description: 'Signature bridal silk saree from Aalayam master weavers. Intricate peacock, elephant, and chakra motifs woven in authentic gold zari.',
    tamilDescription: 'ஆலயம் சில்க்ஸ் நிறுவனத்தின் பிரத்யேக மணப்பெண் பட்டுச் சேலை. மயில் மற்றும் யானை தங்க ஜரிகை வேலைப்பாடு.',
    sizes: ['Free Size (6.3m with blouse)'],
    colors: ['Signature Maroon Gold', 'Temple Red', 'Deep Peacock Blue'],
    stock: 18,
    isAssured: true,
    isBestSeller: true,
    featured: true
  }
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDirectory();
    this.data = this.load();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // If file already exists and has 50 products, return it
        if (parsed.products && parsed.products.length >= 40) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to read db file, initializing seed:', e);
    }

    // Build the 50 products list with IDs
    const products: Product[] = ALL_50_PRODUCTS_DATA.map((p, idx) => ({
      ...p,
      id: `prod-${idx + 1}`,
      createdAt: new Date(Date.now() - (50 - idx) * 3600000 * 24).toISOString()
    }));

    const initialOrders: CustomerOrder[] = [
      {
        id: 'ord-1001',
        orderNumber: 'FK-AAL-8921',
        date: '15 Oct 2026',
        createdAt: '2026-10-15T11:30:00.000Z',
        customer: {
          name: 'Kaviyarasu Sanmuga',
          phone: '6374823101',
          email: 'kavaiyaraalsuesienmuga1234@gmail.com',
          addressLine: '15 Gandhi Road, Near Temple',
          city: 'Coimbatore',
          state: 'Tamil Nadu',
          pincode: '641001'
        },
        items: [
          {
            productId: 'prod-1',
            name: 'Kanchipuram Pure Silk Bridal Wedding Saree with Pure Zari Border',
            tamilName: 'காஞ்சிபுரம் பட்டு திருமணப் புடவை',
            image: '/images/products/dress-1.jpg',
            price: 4999,
            originalPrice: 10999,
            quantity: 1,
            selectedSize: 'Free Size',
            selectedColor: 'Bridal Crimson Red'
          }
        ],
        pricing: {
          totalMRP: 10999,
          discount: 6000,
          subtotal: 4999,
          deliveryFee: 0,
          packagingFee: 29,
          totalPayable: 5028
        },
        paymentMethod: 'UPI',
        paymentDetails: {
          upiApp: 'Google Pay',
          upiId: 'kaviyarasu@okhdfcbank',
          transactionRef: 'UPI-9821389123'
        },
        paymentStatus: 'PAID',
        orderStatus: 'SHIPPED',
        courier: {
          partner: 'Ekart Logistics',
          trackingNumber: 'EKT928491823IN',
          estimatedDelivery: '18 Oct 2026'
        },
        notifications: {
          whatsappSent: true,
          whatsappTo: '6374823101',
          emailSent: true,
          emailTo: 'kavaiyaraalsuesienmuga1234@gmail.com',
          sentAt: '2026-10-15T11:31:00.000Z'
        }
      },
      {
        id: 'ord-1002',
        orderNumber: 'FK-AAL-8922',
        date: '16 Oct 2026',
        createdAt: '2026-10-16T16:45:00.000Z',
        customer: {
          name: 'Priya Meenakshi',
          phone: '9840123456',
          email: 'priya.meenakshi@gmail.com',
          addressLine: '42 South Mada Street, Mylapore',
          city: 'Chennai',
          state: 'Tamil Nadu',
          pincode: '600004'
        },
        items: [
          {
            productId: 'prod-16',
            name: 'Heavily Embroidered Anarkali Chudidhar Set with Zari Dupatta',
            tamilName: 'அனார்கலி சுடிதார் செட்',
            image: '/images/products/dress-16.jpg',
            price: 2199,
            originalPrice: 4999,
            quantity: 1,
            selectedSize: 'L (40)',
            selectedColor: 'Rani Pink'
          }
        ],
        pricing: {
          totalMRP: 4999,
          discount: 2800,
          subtotal: 2199,
          deliveryFee: 0,
          packagingFee: 29,
          totalPayable: 2228
        },
        paymentMethod: 'COD',
        paymentStatus: 'COD_VERIFIED',
        orderStatus: 'PACKED',
        courier: {
          partner: 'BlueDart Express',
          trackingNumber: 'BLU77382910IN',
          estimatedDelivery: '19 Oct 2026'
        },
        notifications: {
          whatsappSent: true,
          whatsappTo: '6374823101',
          emailSent: true,
          emailTo: 'kavaiyaraalsuesienmuga1234@gmail.com',
          sentAt: '2026-10-16T16:46:00.000Z'
        }
      }
    ];

    const initialCustomers: Customer[] = [
      {
        id: 'cust-1',
        name: 'Kaviyarasu Sanmuga',
        phone: '6374823101',
        email: 'kavaiyaraalsuesienmuga1234@gmail.com',
        address: '15 Gandhi Road, Near Temple',
        city: 'Coimbatore',
        state: 'Tamil Nadu',
        pincode: '641001',
        ordersCount: 3,
        totalSpent: 11497,
        lastLogin: new Date().toISOString(),
        createdAt: '2026-08-15T09:00:00.000Z'
      },
      {
        id: 'cust-2',
        name: 'Priya Meenakshi',
        phone: '9840123456',
        email: 'priya.meenakshi@gmail.com',
        address: '42 South Mada Street, Mylapore',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600004',
        ordersCount: 2,
        totalSpent: 7498,
        lastLogin: '2026-10-16T14:30:00.000Z',
        createdAt: '2026-08-20T11:00:00.000Z'
      }
    ];

    const initialLogins: LoginLog[] = [
      {
        id: 'log-1',
        identifier: '6374823101',
        customerName: 'Kaviyarasu Sanmuga',
        type: 'PHONE_OTP',
        status: 'SUCCESS',
        ipAddress: '106.215.88.12',
        userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) Chrome/128.0',
        timestamp: new Date().toISOString()
      }
    ];

    const initialNotifications: NotificationLog[] = [
      {
        id: 'notif-1',
        orderId: 'FK-AAL-8921',
        type: 'WHATSAPP',
        recipient: '+916374823101',
        contentSummary: 'Order #FK-AAL-8921 placed by Kaviyarasu Sanmuga (₹5,028, UPI Paid)',
        status: 'SENT',
        timestamp: '2026-10-15T11:31:00.000Z'
      },
      {
        id: 'notif-2',
        orderId: 'FK-AAL-8921',
        type: 'EMAIL',
        recipient: 'kavaiyaraalsuesienmuga1234@gmail.com',
        contentSummary: '[New Order #FK-AAL-8921] ₹5,028 - Kaviyarasu Sanmuga',
        status: 'SENT',
        timestamp: '2026-10-15T11:31:05.000Z'
      }
    ];

    const initialData: DatabaseSchema = {
      version: '2.0.0',
      lastUpdated: new Date().toISOString(),
      products,
      orders: initialOrders,
      customers: initialCustomers,
      logins: initialLogins,
      notifications: initialNotifications,
      settings: {
        whatsappNumber: '6374823101',
        adminEmail: 'kavaiyaraalsuesienmuga1234@gmail.com',
        storeName: 'Aalayam Silks & Sarees',
        storeUpiId: 'aalayamsilks@okicici'
      }
    };

    this.saveData(initialData);
    return initialData;
  }

  private saveData(data: DatabaseSchema) {
    try {
      data.lastUpdated = new Date().toISOString();
      const content = JSON.stringify(data, null, 2);
      fs.writeFileSync(DB_FILE, content, 'utf-8');
      fs.writeFileSync(path.join(DATA_DIR, 'db.json'), content, 'utf-8');
    } catch (err) {
      console.error('Error saving database to file:', err);
    }
  }

  public getProducts(): Product[] {
    return this.data.products;
  }

  public getProductById(id: string): Product | undefined {
    return this.data.products.find((p) => p.id === id);
  }

  public addProduct(productData: Omit<Product, 'id' | 'createdAt'>): Product {
    const id = 'prod-' + (this.data.products.length + 1);
    const newProduct: Product = {
      ...productData,
      id,
      createdAt: new Date().toISOString()
    };
    this.data.products.unshift(newProduct);
    this.saveData(this.data);
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    const idx = this.data.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.data.products[idx] = { ...this.data.products[idx], ...updates };
    this.saveData(this.data);
    return this.data.products[idx];
  }

  public deleteProduct(id: string): boolean {
    const prevLen = this.data.products.length;
    this.data.products = this.data.products.filter((p) => p.id !== id);
    if (this.data.products.length !== prevLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  public getOrders(): CustomerOrder[] {
    return this.data.orders;
  }

  public getOrderById(idOrNumber: string): CustomerOrder | undefined {
    return this.data.orders.find(
      (o) => o.id === idOrNumber || o.orderNumber.toLowerCase() === idOrNumber.toLowerCase()
    );
  }

  public createOrder(orderInput: {
    customer: CustomerOrder['customer'];
    items: CustomerOrder['items'];
    pricing: CustomerOrder['pricing'];
    paymentMethod: CustomerOrder['paymentMethod'];
    paymentDetails?: CustomerOrder['paymentDetails'];
    paymentStatus: CustomerOrder['paymentStatus'];
  }): CustomerOrder {
    const now = new Date();
    const orderNumber = `FK-AAL-${Math.floor(1000 + Math.random() * 9000)}`;
    const id = `ord-${Date.now()}`;

    const newOrder: CustomerOrder = {
      id,
      orderNumber,
      date: now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      createdAt: now.toISOString(),
      customer: orderInput.customer,
      items: orderInput.items,
      pricing: orderInput.pricing,
      paymentMethod: orderInput.paymentMethod,
      paymentDetails: orderInput.paymentDetails,
      paymentStatus: orderInput.paymentStatus,
      orderStatus: 'ORDER_PLACED',
      courier: {
        partner: 'Ekart Logistics',
        trackingNumber: `EKT${Math.floor(10000000 + Math.random() * 90000000)}IN`,
        estimatedDelivery: new Date(now.getTime() + 3 * 86400000).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })
      },
      notifications: {
        whatsappSent: true,
        whatsappTo: this.data.settings.whatsappNumber,
        emailSent: true,
        emailTo: this.data.settings.adminEmail,
        sentAt: now.toISOString()
      }
    };

    // Live insertion into the database
    this.data.orders.unshift(newOrder);

    // Record notification logs
    this.data.notifications.unshift({
      id: `notif-${Date.now()}-wa`,
      orderId: orderNumber,
      type: 'WHATSAPP',
      recipient: `+91${this.data.settings.whatsappNumber}`,
      contentSummary: `Order #${orderNumber} placed by ${orderInput.customer.name} (₹${orderInput.pricing.totalPayable.toLocaleString('en-IN')})`,
      status: 'SENT',
      timestamp: now.toISOString()
    });

    this.data.notifications.unshift({
      id: `notif-${Date.now()}-em`,
      orderId: orderNumber,
      type: 'EMAIL',
      recipient: this.data.settings.adminEmail,
      contentSummary: `[New Order #${orderNumber}] ₹${orderInput.pricing.totalPayable.toLocaleString('en-IN')} - ${orderInput.customer.name}`,
      status: 'SENT',
      timestamp: now.toISOString()
    });

    // Update customer in database
    const existingCust = this.data.customers.find((c) => c.phone === orderInput.customer.phone);
    if (existingCust) {
      existingCust.ordersCount += 1;
      existingCust.totalSpent += orderInput.pricing.totalPayable;
      existingCust.address = orderInput.customer.addressLine;
      existingCust.city = orderInput.customer.city;
      existingCust.state = orderInput.customer.state;
      existingCust.pincode = orderInput.customer.pincode;
      existingCust.lastLogin = now.toISOString();
    } else {
      this.data.customers.unshift({
        id: `cust-${Date.now()}`,
        name: orderInput.customer.name,
        phone: orderInput.customer.phone,
        email: orderInput.customer.email || '',
        address: orderInput.customer.addressLine,
        city: orderInput.customer.city,
        state: orderInput.customer.state,
        pincode: orderInput.customer.pincode,
        ordersCount: 1,
        totalSpent: orderInput.pricing.totalPayable,
        lastLogin: now.toISOString(),
        createdAt: now.toISOString()
      });
    }

    // Live sync to disk
    this.saveData(this.data);
    return newOrder;
  }

  public updateOrderStatus(orderId: string, status: CustomerOrder['orderStatus']): CustomerOrder | null {
    const order = this.data.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!order) return null;
    order.orderStatus = status;
    this.saveData(this.data);
    return order;
  }

  public getCustomers(): Customer[] {
    return this.data.customers;
  }

  public recordLogin(log: {
    identifier: string;
    customerName?: string;
    type: 'PHONE_OTP' | 'EMAIL_OTP' | 'PASSWORD';
    status: 'SUCCESS' | 'FAILED';
    ipAddress?: string;
    userAgent?: string;
  }): LoginLog {
    const entry: LoginLog = {
      id: `log-${Date.now()}`,
      identifier: log.identifier,
      customerName: log.customerName || 'Customer',
      type: log.type,
      status: log.status,
      ipAddress: log.ipAddress || '127.0.0.1',
      userAgent: log.userAgent || 'Web Browser',
      timestamp: new Date().toISOString()
    };
    this.data.logins.unshift(entry);

    const customer = this.data.customers.find(
      (c) => c.phone === log.identifier || c.email.toLowerCase() === log.identifier.toLowerCase()
    );
    if (customer) {
      customer.lastLogin = entry.timestamp;
      if (log.customerName) customer.name = log.customerName;
    } else if (log.status === 'SUCCESS') {
      this.data.customers.unshift({
        id: `cust-${Date.now()}`,
        name: log.customerName || 'Registered Shopper',
        phone: /^\d+$/.test(log.identifier) ? log.identifier : '',
        email: log.identifier.includes('@') ? log.identifier : '',
        address: '',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600001',
        ordersCount: 0,
        totalSpent: 0,
        lastLogin: entry.timestamp,
        createdAt: entry.timestamp
      });
    }

    this.saveData(this.data);
    return entry;
  }

  public getLogins(): LoginLog[] {
    return this.data.logins;
  }

  public getNotifications(): NotificationLog[] {
    return this.data.notifications;
  }

  public getStats() {
    const totalOrders = this.data.orders.length;
    const totalRevenue = this.data.orders.reduce((sum, o) => sum + o.pricing.totalPayable, 0);
    const totalCustomers = this.data.customers.length;
    const totalProducts = this.data.products.length;
    const pendingOrders = this.data.orders.filter(
      (o) => o.orderStatus === 'ORDER_PLACED' || o.orderStatus === 'PACKED'
    ).length;

    return {
      totalOrders,
      totalRevenue,
      totalCustomers,
      totalProducts,
      pendingOrders,
      notificationsSent: this.data.notifications.length,
      settings: this.data.settings,
      dbFile: 'data/ecommerce_database.json',
      lastUpdated: this.data.lastUpdated
    };
  }
}

export const db = new Database();
