import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    const baseUrl = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
    const normalizedPath = imagePath.replace(/\\/g, '/');
    return `${baseUrl}${normalizedPath.startsWith('/') ? '' : '/'}${normalizedPath}`;
  };

  const primaryImage = product.images && product.images.length > 0 ? product.images[0] : product.image;

  return (
    <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ height: '200px', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {primaryImage ? (
          <img src={getImageUrl(primaryImage)} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: '3rem' }}>🌰</span>
        )}
      </div>
      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>{product.type}</span>
          <span style={{ fontWeight: 800, fontSize: '1.2rem' }}>₹{product.price.toFixed(2)}</span>
        </div>
        
        <h3 style={{ marginBottom: '0.5rem', fontSize: '1.3rem' }}>{product.name}</h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '1rem', color: '#ffb400' }}>
          <Star size={14} fill="currentColor" />
          <Star size={14} fill="currentColor" />
          <Star size={14} fill="currentColor" />
          <Star size={14} fill="currentColor" />
          <Star size={14} fill="currentColor" />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: '6px' }}>(124)</span>
        </div>
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
