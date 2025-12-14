import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmationEmail, sendOrderNotificationToAdmin } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { orderId, customerEmail, orderDetails } = await request.json();

    // Capture the PayPal payment
    const paypalResponse = await fetch(`https://api-m.${process.env.PAYPAL_ENVIRONMENT === 'production' ? '' : 'sandbox.'}paypal.com/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getPayPalAccessToken()}`,
      },
    });

    const captureData = await paypalResponse.json();
    
    if (paypalResponse.ok && captureData.status === 'COMPLETED') {
      const transactionId = captureData.purchase_units[0].payments.captures[0].id;
      const shippingAddress = captureData.purchase_units[0]?.shipping?.address 
        ? `${captureData.purchase_units[0].shipping.address.address_line_1 || ''}, ${captureData.purchase_units[0].shipping.address.admin_area_2 || ''}, ${captureData.purchase_units[0].shipping.address.admin_area_1 || ''} ${captureData.purchase_units[0].shipping.address.postal_code || ''}, ${captureData.purchase_units[0].shipping.address.country_code || ''}`
        : undefined;
      
      // Send confirmation email to customer
      try {
        await sendOrderConfirmationEmail({
          to: customerEmail,
          orderDetails,
          paypalOrderId: orderId,
          transactionId
        });
      } catch (emailError) {
        console.error('Customer email sending failed:', emailError);
        // Don't fail the entire transaction if email fails
      }

      // Send notification email to Bosh/admin
      try {
        await sendOrderNotificationToAdmin({
          customerEmail,
          orderDetails,
          paypalOrderId: orderId,
          transactionId,
          shippingAddress
        });
      } catch (emailError) {
        console.error('Admin notification email failed:', emailError);
        // Don't fail the entire transaction if email fails
      }

      return NextResponse.json({ 
        success: true, 
        transactionId 
      });
    } else {
      return NextResponse.json({ error: 'Payment capture failed' }, { status: 400 });
    }
  } catch (error) {
    console.error('PayPal capture error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const base64Credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch(`https://api-m.${process.env.PAYPAL_ENVIRONMENT === 'production' ? '' : 'sandbox.'}paypal.com/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${base64Credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials'
  });

  const data = await response.json();
  return data.access_token;
}



