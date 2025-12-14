import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderItem {
  product: {
    title: string;
    price: number;
  };
  quantity: number;
}

interface OrderDetails {
  items: OrderItem[];
  total: number;
}

interface OrderConfirmationData {
  to: string;
  orderDetails: OrderDetails;
  paypalOrderId: string;
  transactionId: string;
}

export async function sendOrderConfirmationEmail({
  to,
  orderDetails,
  paypalOrderId,
  transactionId
}: OrderConfirmationData) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'hello@boshanovart.com',
      to: [to],
      subject: 'Order Confirmation - novART FILMS',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc2626;">Thank you for your order!</h1>
          
          <p>Hi there,</p>
          
          <p>Your order has been confirmed and payment processed successfully. We're excited to get your items ready!</p>
          
          <div style="background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h3>Order Details:</h3>
            <p><strong>Transaction ID:</strong> ${transactionId}</p>
            <p><strong>PayPal Order ID:</strong> ${paypalOrderId}</p>
            
            <h4>Items Ordered:</h4>
            <ul>
              ${orderDetails.items.map((item) => `
                <li>${item.product.title} - Quantity: ${item.quantity} - $${(item.product.price * item.quantity).toFixed(2)}</li>
              `).join('')}
            </ul>
            
            <p><strong>Total: $${orderDetails.total.toFixed(2)}</strong></p>
          </div>
          
          <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #856404;">📦 Shipping Timeline</h4>
            <p style="margin-bottom: 0; color: #856404;">
              Your order will be carefully prepared and shipped within <strong>2-4 weeks</strong>. 
              You'll receive tracking information once your package is on its way.
            </p>
          </div>
          
          <p>Each item is handled with care to ensure you receive the highest quality product. 
          We'll notify you as soon as your order ships.</p>
          
          <p>If you have any questions about your order, feel free to reply to this email.</p>
          
          <p>Best regards,<br>
          <strong>BOSH</strong><br>
          novART FILMS</p>
        </div>
      `
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

interface ContactFormData {
  name: string;
  email: string;
  project: string;
  message: string;
}

interface AdminOrderNotificationData {
  customerEmail: string;
  orderDetails: OrderDetails;
  paypalOrderId: string;
  transactionId: string;
  shippingAddress?: string;
}

// Send order notification to Bosh/admin
export async function sendOrderNotificationToAdmin({
  orderDetails,
  customerEmail,
  paypalOrderId,
  transactionId,
  shippingAddress
}: AdminOrderNotificationData) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.RESEND_FROM_EMAIL || 'hello@boshanovart.com';
    
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'hello@boshanovart.com',
      to: [adminEmail],
      subject: `🚨 NEW ORDER - Action Required`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc2626;">🎉 New Order Received!</h1>
          
          <p><strong>Action needed:</strong> Prepare and ship this order within 2-4 weeks.</p>
          
          <div style="background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h3>Order Information:</h3>
            <p><strong>Transaction ID:</strong> ${transactionId}</p>
            <p><strong>PayPal Order ID:</strong> ${paypalOrderId}</p>
            <p><strong>Customer Email:</strong> ${customerEmail}</p>
            ${shippingAddress ? `<p><strong>Shipping Address:</strong><br>${shippingAddress}</p>` : ''}
            
            <h4>Items to Prepare:</h4>
            <ul>
              ${orderDetails.items.map((item) => `
                <li><strong>${item.product.title}</strong> - Qty: ${item.quantity} - $${(item.product.price * item.quantity).toFixed(2)}</li>
              `).join('')}
            </ul>
            
            <p><strong>Total: $${orderDetails.total.toFixed(2)}</strong></p>
          </div>
          
          <div style="background: #d1ecf1; border-left: 4px solid #0c5460; padding: 15px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #0c5460;">📋 Next Steps:</h4>
            <ol style="margin-bottom: 0; color: #0c5460;">
              <li>Prepare the items for shipping</li>
              <li>Package securely</li>
              <li>Ship within 2-4 weeks</li>
              <li>Email customer with tracking info (optional)</li>
            </ol>
          </div>
          
          <p><strong>Note:</strong> Customer has been notified that shipping will take 2-4 weeks.</p>
          
          <p>View transaction in PayPal: <a href="https://www.paypal.com/activity/payment/${transactionId}">Click here</a></p>
        </div>
      `
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error sending admin notification:', error);
    throw error;
  }
}

export async function sendContactFormEmail(formData: ContactFormData) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'hello@boshanovart.com',
      to: [process.env.RESEND_FROM_EMAIL || 'hello@boshanovart.com'],
      subject: `New Contact Form Submission - ${formData.project}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc2626;">New Contact Form Submission</h1>
          
          <div style="background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <p><strong>Name:</strong> ${formData.name}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Project Type:</strong> ${formData.project}</p>
            
            <h3>Message:</h3>
            <p style="background: white; padding: 15px; border-radius: 4px;">${formData.message}</p>
          </div>
          
          <p>Reply to: ${formData.email}</p>
        </div>
      `
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error sending contact form email:', error);
    throw error;
  }
}



