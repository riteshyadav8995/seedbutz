import React, { useState, useEffect } from 'react';
import api from '../api';
import ProductCard from '../components/ProductCard';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ type: '', flavor: '', dietaryRestrictions: '' });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.flavor) params.append('flavor', filters.flavor);
      if (filters.dietaryRestrictions) params.append('dietaryRestrictions', filters.dietaryRestrictions);
      
      const res = await api.get(`/products?${params.toString()}`);
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="container fade-in-up" style={{ padding: '2rem 0' }}>
      <h1 style={{ marginBottom: '2rem' }}>Our Collection</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
        {/* Filters Sidebar */}
        <div className="glass-panel" style={{ alignSelf: 'start' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-gold)' }}>Filters</h3>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Type</label>
            <select name="type" onChange={handleFilterChange} value={filters.type}>
              <option value="">All Types</option>
              <option value="Raw">Raw</option>
              <option value="Roasted">Roasted</option>
            </select>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Flavor</label>
            <select name="flavor" onChange={handleFilterChange} value={filters.flavor}>
              <option value="">All Flavors</option>
              <option value="Salted">Salted</option>
              <option value="Spicy">Spicy</option>
              <option value="Honey">Honey</option>
              <option value="Natural">Natural</option>
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Dietary Restrictions</label>
            <select name="dietaryRestrictions" onChange={handleFilterChange} value={filters.dietaryRestrictions}>
              <option value="">All Diets</option>
              <option value="Vegan">Vegan</option>
              <option value="Gluten-Free">Gluten-Free</option>
              <option value="Keto">Keto</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
          {products.length > 0 ? (
            products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              No products found matching your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
