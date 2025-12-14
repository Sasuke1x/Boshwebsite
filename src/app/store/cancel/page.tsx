import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md">
        <XCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
        <p className="text-gray-600 mb-6">
          Your payment was cancelled. No charges were made to your account.
        </p>
        <div className="space-y-3">
          <Link 
            href="/store"
            className="block bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors"
          >
            Return to Store
          </Link>
          <Link 
            href="/"
            className="block text-gray-600 hover:text-gray-800 transition-colors"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}


