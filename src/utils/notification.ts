/**
 * Notification generators for WhatsApp (+91 6374823101)
 * and Email (kavaiyaraalsuesienmuga1234@gmail.com)
 */

export const ADMIN_CONFIG = {
  WHATSAPP_NUMBER: '6374823101',
  WHATSAPP_INTERNATIONAL: '916374823101',
  ADMIN_EMAIL: 'kavaiyaraalsuesienmuga1234@gmail.com',
  STORE_NAME: 'Aalayam Silks & Sarees'
};

export interface OrderItemPayload {
  name: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  email?: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderNotificationPayload {
  orderId: string;
  date: string;
  customer: CustomerDetails;
  items: OrderItemPayload[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  notes?: string;
}

export function generateWhatsAppMessage(payload: OrderNotificationPayload): string {
  const itemsText = payload.items
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.name} (${item.size ? item.size + ', ' : ''}Qty: ${item.quantity}) - ₹${(item.price * item.quantity).toLocaleString('en-IN')}`
    )
    .join('\n');

  return `🛍️ *புதிய ஆர்டர் பதிவு - ${ADMIN_CONFIG.STORE_NAME}*
---------------------------------------
📌 *ஆர்டர் எண் (Order ID):* #${payload.orderId}
📅 *தேதி (Date):* ${payload.date}

👤 *வாடிக்கையாளர் விபரம் (Customer Details):*
- பெயர் (Name): ${payload.customer.name}
- தொடர்பு எண் (Phone): ${payload.customer.phone}
${payload.customer.email ? `- மின்னஞ்சல் (Email): ${payload.customer.email}\n` : ''}- முகவரி (Address): ${payload.customer.addressLine}, ${payload.customer.city}, ${payload.customer.state} - ${payload.customer.pincode}

📦 *ஆர்டர் செய்த ஆடைகள் (Items):*
${itemsText}

💰 *மொத்த தொகை (Total Amount):* ₹${payload.totalAmount.toLocaleString('en-IN')}
💳 *பணம் செலுத்தும் முறை (Payment Method):* ${payload.paymentMethod}
📊 *பணம் செலுத்திய நிலை (Payment Status):* ${payload.paymentStatus}
---------------------------------------
✨ *ஆலயம் சில்க்ஸ் அட்மின் போர்டல் தானியங்கி தகவல்*`;
}

export function generateWhatsAppUrl(payload: OrderNotificationPayload): string {
  const message = generateWhatsAppMessage(payload);
  return `https://api.whatsapp.com/send?phone=${ADMIN_CONFIG.WHATSAPP_INTERNATIONAL}&text=${encodeURIComponent(message)}`;
}

export function generateEmailPayload(payload: OrderNotificationPayload): {
  to: string;
  subject: string;
  body: string;
  html: string;
} {
  const subject = `[புதிய ஆர்டர் New Order #${payload.orderId}] ₹${payload.totalAmount.toLocaleString('en-IN')} - ${payload.customer.name} | ${ADMIN_CONFIG.STORE_NAME}`;
  
  const textBody = `புதிய ஆர்டர் விவரம் (${ADMIN_CONFIG.STORE_NAME}):
------------------------------------------------
ஆர்டர் எண்: #${payload.orderId}
தேதி: ${payload.date}

வாடிக்கையாளர்:
- பெயர்: ${payload.customer.name}
- தொலைபேசி: ${payload.customer.phone}
- முகவரி: ${payload.customer.addressLine}, ${payload.customer.city}, ${payload.customer.state} - ${payload.customer.pincode}

ஆடைகள்:
${payload.items.map((it) => `- ${it.name} (அளவு: ${it.size || 'Free Size'}, எண்ணிக்கை: ${it.quantity}) - ₹${it.price * it.quantity}`).join('\n')}

மொத்த தொகை: ₹${payload.totalAmount.toLocaleString('en-IN')}
பணம் செலுத்தும் முறை: ${payload.paymentMethod} (${payload.paymentStatus})

இந்த ஆர்டர் விவரம் தானியங்கியாக ஜிமெயில் மற்றும் வாட்ஸ்அப் (+91 6374823101) க்கு பதிவு செய்யப்பட்டுள்ளது.`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #7e1d2c; color: #ffffff; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">ஆலயம் சில்க்ஸ் & ஆடைகள்</h1>
        <p style="margin: 5px 0 0; font-size: 14px; opacity: 0.9;">புதிய ஆர்டர் பெறப்பட்டது - #${payload.orderId}</p>
      </div>
      <div style="padding: 24px;">
        <h2 style="font-size: 18px; color: #1e293b; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">வாடிக்கையாளர் விவரம்</h2>
        <p style="margin: 4px 0;"><strong>பெயர்:</strong> ${payload.customer.name}</p>
        <p style="margin: 4px 0;"><strong>தொலைபேசி:</strong> ${payload.customer.phone}</p>
        <p style="margin: 4px 0;"><strong>முகவரி:</strong> ${payload.customer.addressLine}, ${payload.customer.city}, ${payload.customer.state} - ${payload.customer.pincode}</p>
        
        <h2 style="font-size: 18px; color: #1e293b; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-top: 20px;">ஆர்டர் செய்த ஆடைகள்</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr style="background: #f8fafc; text-align: left;">
              <th style="padding: 8px; border-bottom: 1px solid #cbd5e1;">பொருள்</th>
              <th style="padding: 8px; border-bottom: 1px solid #cbd5e1;">அளவு</th>
              <th style="padding: 8px; border-bottom: 1px solid #cbd5e1;">எண்ணிக்கை</th>
              <th style="padding: 8px; border-bottom: 1px solid #cbd5e1;">விலை</th>
            </tr>
          </thead>
          <tbody>
            ${payload.items
              .map(
                (item) => `
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${item.name}</td>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${item.size || 'Free Size'}</td>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${item.quantity}</td>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
        
        <div style="margin-top: 20px; background: #fffbeb; padding: 16px; border-radius: 6px; border: 1px solid #fef3c7;">
          <p style="margin: 0; font-size: 16px; font-weight: bold; color: #92400e;">மொத்த தொகை (Total): ₹${payload.totalAmount.toLocaleString('en-IN')}</p>
          <p style="margin: 4px 0 0; font-size: 13px; color: #b45309;">முறை: ${payload.paymentMethod} | நிலை: ${payload.paymentStatus}</p>
        </div>
      </div>
      <div style="background: #f8fafc; padding: 12px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
        ஆலயம் சில்க்ஸ் இ-காமர்ஸ் ஆட்டோமேஷன் | WhatsApp: 6374823101 | Email: ${ADMIN_CONFIG.ADMIN_EMAIL}
      </div>
    </div>
  `;

  return {
    to: ADMIN_CONFIG.ADMIN_EMAIL,
    subject,
    body: textBody,
    html
  };
}
