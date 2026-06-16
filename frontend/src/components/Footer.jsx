import React from 'react';

const Footer = () => {
  return (
    <footer style={{ background: 'var(--footer-bg)', padding: '4rem 0 2rem 0', marginTop: '4rem', borderTop: '1px solid var(--glass-border)' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
        <div>
          <h3 style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }}>Seednutz</h3>
          <p style={{ color: 'var(--text-muted)' }}>Premium, roasted, and raw seed nuts tailored to your health needs.</p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-gold)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-gold)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-gold)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
          </div>
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
