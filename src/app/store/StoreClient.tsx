"use client";

import { useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, Plus } from 'lucide-react';
import { Product, CartItem } from '@/types';

interface StorePageContent {
  title?: string;
  subtitle?: string;
  headerImage?: {
    asset: {
      url: string;
    };
    alt?: string;
  };
  shippingInfo?: string;
  returnPolicy?: string;
}

interface StoreClientProps {
  products: Product[];
  storePageContent?: StorePageContent;
}

export default function StoreClient({ products, storePageContent }: StoreClientProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.product.id === productId
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const handlePayPalCheckout = async () => {
    if (cart.length === 0) return;

    try {
      // Create PayPal order
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart,
          total: getTotalPrice()
        })
      });

      const data = await response.json();
      
      if (data.orderId) {
        // Redirect to PayPal for payment
        window.location.href = `https://www.${process.env.NODE_ENV === 'production' ? '' : 'sandbox.'}paypal.com/checkoutnow?token=${data.orderId}`;
      } else {
        alert('Error creating PayPal order. Please try again.');
      }
    } catch (error) {
      console.error('PayPal checkout error:', error);
      alert('Error processing payment. Please try again.');
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'print': return 'Fine Art Print';
      case 'digital': return 'Digital Download';
      case 'package': return 'Service Package';
      default: return category;
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-light text-gray-800 mb-2">
                {storePageContent?.title || 'Store'}
              </h1>
              {storePageContent?.subtitle && (
                <p className="text-gray-600 max-w-2xl">{storePageContent.subtitle}</p>
              )}
            </div>
            
            {/* Cart Button */}
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative flex items-center space-x-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <ShoppingCart size={20} />
              <span>Cart ({cart.length})</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
          
          {/* Optional Header Image */}
          {storePageContent?.headerImage?.asset?.url && (
            <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden mb-6">
              <Image
                src={storePageContent.headerImage.asset.url}
                alt={storePageContent.headerImage.alt || 'Store header'}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>

        {/* Product Grid - Chi Modu style - responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-8">
          {products.map((product) => (
            <div key={product.id} className="group">
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden bg-gray-100 mb-3">
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {!product.isAvailable && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-medium">Sold Out</span>
                  </div>
                )}
              </div>
              
              {/* Product Info */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-800">{product.title}</h3>
                <p className="text-xs text-gray-600">{getCategoryLabel(product.category)}</p>
                {product.size && (
                  <p className="text-xs text-gray-500">{product.size}</p>
                )}
                <p className="text-xs text-gray-600 line-clamp-2">{product.description}</p>
                {product.stockQuantity !== undefined && product.stockQuantity > 0 && (
                  <p className="text-xs text-gray-500">
                    {product.stockQuantity} {product.stockQuantity === 1 ? 'available' : 'available'}
                  </p>
                )}
                
                <div className="flex items-center justify-between pt-2">
                  <span className="text-lg font-medium text-gray-900">${product.price}</span>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={!product.isAvailable}
                    className="flex items-center space-x-1 px-3 py-1 bg-black text-white text-xs hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <Plus size={14} />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Sidebar - responsive */}
        {showCart && (
          <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-lg z-50 flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">Shopping Cart</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center mt-8">Your cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex space-x-4 py-4 border-b border-gray-100">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-800 truncate">
                          {item.product.title}
                        </h3>
                        <p className="text-xs text-gray-500">${item.product.price}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center border border-gray-300 text-xs"
                          >
                            -
                          </button>
                          <span className="text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center border border-gray-300 text-xs"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-xs text-red-500 hover:text-red-700 ml-2"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-medium">Total:</span>
                  <span className="text-lg font-bold">${getTotalPrice().toFixed(2)}</span>
                </div>
                <button
                  onClick={handlePayPalCheckout}
                  className="w-full bg-blue-600 text-white py-3 px-4 hover:bg-blue-700 transition-colors"
                >
                  Checkout with PayPal
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Secure payment processing via PayPal
                </p>
              </div>
            )}
          </div>
        )}

        {/* Overlay */}
        {showCart && (
          <div 
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setShowCart(false)}
          />
        )}
      </div>
    </div>
  );
}

