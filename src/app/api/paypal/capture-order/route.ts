import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmationEmail } from '@/lib/email';

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
      // Send confirmation email via Resend
      try {
        await sendOrderConfirmationEmail({
          to: customerEmail,
          orderDetails,
          paypalOrderId: orderId,
          transactionId: captureData.purchase_units[0].payments.captures[0].id
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the entire transaction if email fails
      }

      return NextResponse.json({ 
        success: true, 
        transactionId: captureData.purchase_units[0].payments.captures[0].id 
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



