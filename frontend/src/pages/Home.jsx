import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/products');
        // Grab the first 3 products for highlights
        setFeaturedProducts(res.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching featured products:', error);
      }
    };
    fetchFeatured();
  }, []);
  return (
    <div className="fade-in-up">
      {/* Hero Section */}
      <section style={{ height: '80vh', display: 'flex', alignItems: 'center', position: 'relative' }}>
        <div className="container">
          <div style={{ maxWidth: '600px' }}>
            <h1 style={{ fontSize: '4rem', lineHeight: 1.1, marginBottom: '1.5rem' }}>
              Nature's Power, <br/><span style={{ color: 'var(--accent-gold)' }}>Perfectly Roasted.</span>
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Discover the finest selection of seed nuts tailored for your health, energy, and cravings. Pure, organic, and relentlessly delicious.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/catalog" className="btn btn-primary">Shop Now</Link>
              <Link to="/about" className="btn btn-outline">Our Story</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '4rem 2rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--accent-gold)' }}>Our Story</h2>
            <p style={{ maxWidth: '800px', fontSize: '1.2rem', lineHeight: 1.8, color: 'var(--text-muted)' }}>
              Seednutz was born from a simple belief: snacks should be as nourishing as they are delicious. We started with a small roaster and a passion for finding the world's finest seeds and nuts. Today, we continue our commitment to organic farming, artisanal roasting, and nutrient-dense goodness. Every crunch is a testament to nature's power, perfectly roasted.
            </p>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section style={{ padding: '5rem 0', background: 'rgba(255,255,255,0.02)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '3rem' }}>Why Seednutz?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div className="glass-panel" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🌱</div>
              <h3>100% Organic</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Sourced from the best organic farms globally.</p>
            </div>
            <div className="glass-panel" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔥</div>
              <h3>Artisan Roasted</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Roasted to perfection for that ultimate crunch.</p>
            </div>
            <div className="glass-panel" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💪</div>
              <h3>Nutrient Dense</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Packed with proteins, healthy fats, and vitamins.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Highlights Section */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', margin: 0 }}>Product Highlights</h2>
            <Link to="/catalog" style={{ color: 'var(--accent-gold)', textDecoration: 'none', fontWeight: 600 }}>View All →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {featuredProducts.length > 0 ? (
              featuredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                Loading our finest selections...
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
