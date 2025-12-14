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
          
          <p>Your order has been confirmed and payment processed successfully.</p>
          
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
          
          <p>For digital downloads, you'll receive access links within 24 hours.</p>
          <p>For physical prints, we'll send shipping information separately.</p>
          
          <p>If you have any questions, feel free to reply to this email.</p>
          
          <p>Best regards,<br>
          novART FILMS Team</p>
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



