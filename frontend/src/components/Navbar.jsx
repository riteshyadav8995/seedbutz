import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const userName = localStorage.getItem('userName');
  
  const { cartItems, toggleCart, clearCart } = useCart();
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userName');
    localStorage.removeItem('userMobile');
    clearCart();
    setShowLogoutModal(false);
    navigate('/');
  };

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <nav style={{ position: 'fixed', top: 0, width: '100%', zIndex: 100, background: 'var(--nav-bg)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--glass-border)' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
          <Link to="/" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-gold)' }}>Seednutz</Link>
        </div>

        {/* Mobile Cart Button (Visible only on mobile) */}
        {!isAdmin && (
          <button className="mobile-menu-btn mobile-cart" onClick={toggleCart} style={{ position: 'relative', display: 'none', alignItems: 'center' }}>
            <ShoppingCart size={24} color="var(--text-main)" />
            {cartItemCount > 0 && (
              <span style={{ position: 'absolute', top: '-8px', right: '-10px', background: 'var(--accent-gold)', color: '#000', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                {cartItemCount}
              </span>
            )}
          </button>
        )}

        <div className="nav-links">
          <Link to="/">Home</Link>
          {!isAdmin && <Link to="/catalog">Shop</Link>}
          <Link to="/about">About Us</Link>
          {!isAdmin && <Link to="/contact">Contact</Link>}
          
          {!isAdmin && (
            <button className="desktop-cart" onClick={toggleCart} style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center' }}>
              <ShoppingCart size={24} color="var(--text-main)" />
              {cartItemCount > 0 && (
                <span style={{ position: 'absolute', top: '-8px', right: '-10px', background: 'var(--accent-gold)', color: '#000', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  {cartItemCount}
                </span>
              )}
            </button>
          )}

          {token ? (
            <>
              {isAdmin && <Link to="/admin/dashboard" style={{ color: 'var(--accent-gold)' }}>Dashboard</Link>}
              
              <div style={{ position: 'relative' }}>
                <button onClick={() => setShowDropdown(!showDropdown)} style={{ background: 'none', border: 'none', color: 'var(--accent-gold)', fontSize: '1rem', cursor: 'pointer', fontWeight: 600 }}>
                  {userName ? userName.split(' ')[0] : 'User'} ▼
                </button>
                {showDropdown && (
                  <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: '0.5rem', background: 'var(--nav-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', overflow: 'hidden', minWidth: '150px', zIndex: 101 }}>
                    <Link to="/profile" onClick={() => setShowDropdown(false)} style={{ display: 'block', padding: '0.8rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)', textDecoration: 'none' }}>Update Profile</Link>
                    <button onClick={() => { setShowDropdown(false); setShowLogoutModal(true); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.8rem 1rem', background: 'none', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#ff6b6b', cursor: 'pointer', fontSize: '1rem' }}>Signout</button>
                    <button onClick={() => { toggleTheme(); setShowDropdown(false); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.8rem 1rem', background: 'none', border: 'none', color: 'var(--accent-gold)', cursor: 'pointer', fontSize: '0.9rem' }}>
                      {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline" style={{ padding: '0.4rem 1rem' }}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.4rem 1rem' }}>Sign Up</Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer fade-in-up">
          <Link to="/" onClick={closeMobile}>Home</Link>
          {!isAdmin && <Link to="/catalog" onClick={closeMobile}>Shop</Link>}
          <Link to="/about" onClick={closeMobile}>About Us</Link>
          {!isAdmin && <Link to="/contact" onClick={closeMobile}>Contact</Link>}
          
          {token ? (
            <>
              {isAdmin && <Link to="/admin/dashboard" onClick={closeMobile} style={{ color: 'var(--accent-gold)' }}>Dashboard</Link>}
              <Link to="/profile" onClick={closeMobile}>Update Profile</Link>
              <button onClick={() => { toggleTheme(); closeMobile(); }} style={{ background: 'none', border: 'none', color: 'var(--accent-gold)', textAlign: 'left', cursor: 'pointer', fontSize: '1rem', padding: 0 }}>
                {theme === 'dark' ? '☀️ Switch to Light Mode' : '🌙 Switch to Dark Mode'}
              </button>
              <button onClick={() => { closeMobile(); setShowLogoutModal(true); }} style={{ background: 'none', border: 'none', color: '#ff6b6b', textAlign: 'left', cursor: 'pointer', fontSize: '1rem', padding: 0 }}>Signout</button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <Link to="/login" className="btn btn-outline" onClick={closeMobile}>Login</Link>
              <Link to="/register" className="btn btn-primary" onClick={closeMobile}>Sign Up</Link>
            </div>
          )}
        </div>
      )}

      {showLogoutModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem', maxWidth: '400px' }}>
            <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem', color: '#fff' }}>Are you really want to signout?</h3>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={handleLogout} className="btn btn-primary" style={{ background: '#ff6b6b', borderColor: '#ff6b6b' }}>Yes</button>
              <button onClick={() => setShowLogoutModal(false)} className="btn btn-outline">No</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
