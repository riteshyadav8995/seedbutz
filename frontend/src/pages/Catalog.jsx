import React, { useState, useEffect } from 'react';
import api from '../api';
import ProductCard from '../components/ProductCard';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ type: '', flavor: '', dietaryRestrictions: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('');

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

        {/* Main Content Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Top Control Bar: Search & Sort */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
            <input 
              type="text" 
              placeholder="Search products by name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: '1 1 300px', margin: 0 }}
            />
            <select 
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value)}
              style={{ flex: '0 0 200px', margin: 0 }}
            >
              <option value="">Sort by Price</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>

          {/* Product Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
            {(() => {
              let displayedProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
              if (sortOrder === 'lowToHigh') displayedProducts.sort((a, b) => a.price - b.price);
              else if (sortOrder === 'highToLow') displayedProducts.sort((a, b) => b.price - a.price);

              return displayedProducts.length > 0 ? (
                displayedProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No products found matching your search or filters.
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalog;
