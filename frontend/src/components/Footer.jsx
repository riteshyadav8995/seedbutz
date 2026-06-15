import React from 'react';

const Footer = () => {
  return (
    <footer style={{ background: 'var(--footer-bg)', padding: '4rem 0 2rem 0', marginTop: '4rem', borderTop: '1px solid var(--glass-border)' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
        <div>
          <h3 style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }}>Seednutz</h3>
          <p style={{ color: 'var(--text-muted)' }}>Premium, roasted, and raw seed nuts tailored to your health needs.</p>
        </div>
        <div>
          <h4 style={{ marginBottom: '1rem' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none' }}>
            <li style={{ marginBottom: '0.5rem' }}><a href="/">Home</a></li>
            <li style={{ marginBottom: '0.5rem' }}><a href="/catalog">Shop</a></li>
            <li style={{ marginBottom: '0.5rem' }}><a href="/about">About</a></li>
            <li style={{ marginBottom: '0.5rem' }}><a href="/contact">Contact</a></li>
          </ul>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        &copy; {new Date().getFullYear()} Seednutz. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
