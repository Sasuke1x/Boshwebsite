import { NextRequest, NextResponse } from 'next/server';

interface CartItem {
  product: {
    title: string;
    description: string;
    price: number;
  };
  quantity: number;
}

export async function POST(request: NextRequest) {
  try {
    const { items, total }: { items: CartItem[]; total: number } = await request.json();

    // PayPal API integration
    const paypalResponse = await fetch(`https://api-m.${process.env.PAYPAL_ENVIRONMENT === 'production' ? '' : 'sandbox.'}paypal.com/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getPayPalAccessToken()}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: total.toString(),
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: total.toString()
              }
            }
          },
          items: items.map((item) => ({
            name: item.product.title,
            description: item.product.description,
            unit_amount: {
              currency_code: 'USD',
              value: item.product.price.toString()
            },
            quantity: item.quantity.toString(),
            category: 'DIGITAL_GOODS'
          }))
        }],
        application_context: {
          return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/store/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/store/cancel`,
          brand_name: 'novART FILMS',
          user_action: 'PAY_NOW'
        }
      })
    });

    const order = await paypalResponse.json();
    
    if (paypalResponse.ok) {
      return NextResponse.json({ orderId: order.id });
    } else {
      return NextResponse.json({ error: 'Failed to create PayPal order' }, { status: 400 });
    }
  } catch (error) {
    console.error('PayPal order creation error:', error);
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



