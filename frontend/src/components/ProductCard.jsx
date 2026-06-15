import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  return (
    <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ height: '200px', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {product.image ? (
          <img src={`${(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api').replace('/api', '')}${product.image}`} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: '3rem' }}>🌰</span>
        )}
      </div>
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>{product.type}</span>
          <span style={{ fontWeight: 600 }}>₹{product.price.toFixed(2)}</span>
        </div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>{product.name}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', flexGrow: 1 }}>
          {product.description.substring(0, 60)}...
        </p>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => addToCart(product)} className="btn btn-primary" style={{ flex: 1, padding: '0.5rem' }}>Add to Cart</button>
          <Link to={`/product/${product._id}`} className="btn btn-outline" style={{ flex: 1, textAlign: 'center', padding: '0.5rem' }}>Details</Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
