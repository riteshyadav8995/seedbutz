import React from 'react';
import { useCart } from '../context/CartContext';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import api from '../api';

const CartDrawer = () => {
  const { cartItems, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();

  if (!isCartOpen) return null;

  const handleCheckout = async () => {
    if (!localStorage.getItem('token')) {
      alert('please login first');
      return;
    }
    try {
      const res = await api.post('/payment/create-order', { amount: cartTotal });
      
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_T1nqMAqhhnFDeC', // Fallback for dev
        amount: res.data.amount,
        currency: res.data.currency,
        name: 'Seednutz',
        description: 'Purchase from Seednutz',
        order_id: res.data.id,
        handler: async function (response) {
          try {
            await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            alert('Payment Successful!');
            clearCart();
            setIsCartOpen(false);
          } catch (error) {
            alert('Payment verification failed.');
          }
        },
        prefill: {
          name: localStorage.getItem('userName') || 'User',
        },
        theme: {
          color: '#D4AF37'
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        alert('Payment Failed');
      });
      rzp.open();
    } catch (error) {
      console.error('Error in checkout:', error);
      alert('Error initiating checkout.');
    }
  };

  return (
    <>
      <div 
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', zIndex: 1000 }} 
        onClick={() => setIsCartOpen(false)}
      />
      <div className="glass-panel" style={{ 
        position: 'fixed', top: 0, right: 0, width: '400px', maxWidth: '100vw', height: '100vh', 
        zIndex: 1001, borderRadius: 0, borderLeft: '1px solid var(--glass-border)',
        display: 'flex', flexDirection: 'column', padding: '1.5rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
          <h2 style={{ fontSize: '1.5rem' }}>Your Cart</h2>
          <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {cartItems.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>Your cart is empty.</p>
          ) : (
            cartItems.map(item => (
              <div key={item._id} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', fontSize: '2rem' }}>🌰</div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ marginBottom: '0.2rem' }}>{item.name}</h4>
                  <p style={{ color: 'var(--accent-gold)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>₹{item.price.toFixed(2)}</p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '24px', height: '24px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Minus size={14} /></button>
                    <span style={{ fontSize: '0.9rem', width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '24px', height: '24px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={14} /></button>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item._id)} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', alignSelf: 'flex-start' }}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
              <span>Total</span>
              <span style={{ color: 'var(--accent-gold)' }}>₹{cartTotal.toFixed(2)}</span>
            </div>
            <button onClick={handleCheckout} className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>Proceed to Checkout</button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
