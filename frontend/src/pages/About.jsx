import React from 'react';

const About = () => {
  return (
    <div className="container fade-in-up" style={{ padding: '4rem 0', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '3.5rem', textAlign: 'center', marginBottom: '3rem' }}>Our <span style={{ color: 'var(--accent-gold)' }}>Story</span></h1>
      
      <div className="glass-panel" style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>The Seednutz Origin</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.8 }}>
          Seednutz began with a simple idea: healthy snacking shouldn't be boring. Founded by nut enthusiasts who were tired of the same old bland options on the shelves, we set out to create a line of seed nuts that are as delicious as they are nutritious.
        </p>
      </div>

      <div className="glass-panel" style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Our Values</h2>
        <ul style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.8, paddingLeft: '1.5rem' }}>
          <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: 'var(--text-main)' }}>Quality First:</strong> We source only the highest grade, organic seeds from sustainable farms.</li>
          <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: 'var(--text-main)' }}>Health Conscious:</strong> Our roasting process preserves essential nutrients without adding unhealthy oils.</li>
          <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: 'var(--text-main)' }}>Flavor Driven:</strong> We believe in bold, natural flavors that satisfy your cravings.</li>
        </ul>
      </div>

      <div className="glass-panel">
        <h2 style={{ marginBottom: '1rem' }}>The Process</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.8 }}>
          Every batch of Seednutz is carefully inspected and artisan-roasted in small batches. This meticulous process ensures the perfect crunch and allows our signature flavor blends to fully develop. From farm to bag, we oversee every step to guarantee you get the best.
        </p>
      </div>
    </div>
  );
};

export default About;
