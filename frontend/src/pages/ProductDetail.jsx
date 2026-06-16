import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    const baseUrl = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
    const normalizedPath = imagePath.replace(/\\/g, '/');
    return `${baseUrl}${normalizedPath.startsWith('/') ? '' : '/'}${normalizedPath}`;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="container fade-in-up" style={{ padding: '4rem 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
        {/* Image Placeholder or Actual Image */}
        <div className="glass-panel" style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: 0 }}>
          {product.image ? (
            <img src={getImageUrl(product.image)} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: '8rem' }}>🌰</span>
          )}
        </div>
        
        {/* Details */}
        <div>
          <span style={{ color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600 }}>{product.type} / {product.flavor}</span>
          <h1 style={{ fontSize: '3rem', margin: '0.5rem 0 1rem 0' }}>{product.name}</h1>
          <p style={{ fontSize: '2rem', fontWeight: 300, marginBottom: '2rem' }}>₹{product.price.toFixed(2)}</p>
          
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: 1.8 }}>
            {product.description}
          </p>

          <button onClick={() => addToCart(product)} className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem', marginBottom: '3rem' }}>Add to Cart</button>

          {/* Nutrition & Ingredients */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <h3 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Nutrition Facts</h3>
              <ul style={{ listStyle: 'none', color: 'var(--text-muted)' }}>
                <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}><span>Calories</span> <span>{product.nutritionFacts?.calories || 'N/A'}</span></li>
                <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}><span>Fat</span> <span>{product.nutritionFacts?.fat || 'N/A'}</span></li>
                <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}><span>Protein</span> <span>{product.nutritionFacts?.protein || 'N/A'}</span></li>
                <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}><span>Carbs</span> <span>{product.nutritionFacts?.carbs || 'N/A'}</span></li>
              </ul>
            </div>
            <div>
              <h3 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Ingredients</h3>
              <p style={{ color: 'var(--text-muted)' }}>{product.ingredients || '100% natural seed nuts.'}</p>
              
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {product.dietaryRestrictions?.map((restriction, index) => (
                  <span key={index} style={{ background: 'rgba(212, 175, 55, 0.1)', color: 'var(--accent-gold)', padding: '0.2rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem' }}>
                    {restriction}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
