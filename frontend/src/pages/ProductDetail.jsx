import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/CartContext';
import { ChevronLeft, ChevronRight, Star, AlertTriangle } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

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
        setActiveImage(res.data.images && res.data.images.length > 0 ? res.data.images[0] : res.data.image);

        if (res.data && res.data.type) {
          const relatedRes = await api.get(`/products?type=${res.data.type}`);
          setRelatedProducts(relatedRes.data.filter(p => p._id !== id).slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>Loading...</div>;

  const allImages = (product?.images && product.images.length > 0) ? product.images : (product?.image ? [product.image] : []);
  const activeIndex = allImages.indexOf(activeImage);

  const handlePrev = () => {
    if (activeIndex > 0) setActiveImage(allImages[activeIndex - 1]);
    else setActiveImage(allImages[allImages.length - 1]);
  };

  const handleNext = () => {
    if (activeIndex < allImages.length - 1) setActiveImage(allImages[activeIndex + 1]);
    else setActiveImage(allImages[0]);
  };

  return (
    <div className="container fade-in-up" style={{ padding: '4rem 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
        {/* Image Placeholder or Actual Image */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="glass-panel" style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: 0, position: 'relative' }}>
            {activeImage ? (
              <>
                <img src={getImageUrl(activeImage)} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {allImages.length > 1 && (
                  <>
                    <button onClick={handlePrev} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <ChevronLeft />
                    </button>
                    <button onClick={handleNext} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <ChevronRight />
                    </button>
                  </>
                )}
              </>
            ) : (
              <span style={{ fontSize: '8rem' }}>🌰</span>
            )}
          </div>
          {/* Thumbnail Gallery */}
          {((product.images && product.images.length > 0) ? product.images : (product.image ? [product.image] : [])).length > 1 && (
            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {((product.images && product.images.length > 0) ? product.images : [product.image]).map((img, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setActiveImage(img)} 
                  style={{ 
                    width: '80px', height: '80px', flexShrink: 0, cursor: 'pointer', 
                    border: activeImage === img ? '2px solid var(--accent-gold)' : '2px solid transparent', 
                    borderRadius: '8px', overflow: 'hidden' 
                  }}
                >
                  <img src={getImageUrl(img)} alt={`${product.name} ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Details */}
        <div>
          <span style={{ color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600 }}>{product.type} / {product.flavor}</span>
          <h1 style={{ fontSize: '3rem', margin: '0.5rem 0 0.5rem 0' }}>{product.name}</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '1rem', color: '#ffb400' }}>
            <Star size={18} fill="currentColor" />
            <Star size={18} fill="currentColor" />
            <Star size={18} fill="currentColor" />
            <Star size={18} fill="currentColor" />
            <Star size={18} fill="currentColor" />
            <span style={{ color: 'var(--text-muted)', fontSize: '1rem', marginLeft: '8px' }}>4.8 (124 reviews)</span>
          </div>

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

            {/* Allergen Warning */}
            <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255, 107, 107, 0.05)', borderLeft: '4px solid #ff6b6b', borderRadius: '0 8px 8px 0' }}>
              <h4 style={{ color: '#ff6b6b', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <AlertTriangle size={18} /> Allergen Warning
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
                Processed in a facility that also handles peanuts, tree nuts, wheat, and soy. May contain trace amounts.
              </p>
            </div>
          </div>
        </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div style={{ marginTop: '6rem', borderTop: '1px solid var(--glass-border)', paddingTop: '4rem' }}>
          <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>You Might Also Like</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
            {relatedProducts.map(rp => (
              <ProductCard key={rp._id} product={rp} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
