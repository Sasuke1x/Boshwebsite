# Required Dependencies for PayPal & Resend Integration

Run these commands to install the necessary packages:

```bash
# PayPal SDK
npm install @paypal/paypal-js @paypal/checkout-server-sdk

# Resend for emails
npm install resend

# Additional utilities
npm install @types/paypal__checkout-server-sdk
```

## Environment Variables Setup

Create a `.env.local` file in your project root with:

```env
# PayPal Configuration
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here
PAYPAL_ENVIRONMENT=sandbox # Change to 'production' for live

# Resend Email Configuration
RESEND_API_KEY=your_resend_api_key_here
RESEND_FROM_EMAIL=hello@boshanovart.com

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```



