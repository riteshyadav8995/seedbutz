import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/profile');
        setName(res.data.name || '');
        setEmail(res.data.email || '');
        setMobileNo(res.data.mobile_no || '');
      } catch (err) {
        console.error('Failed to fetch profile', err);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    try {
      const payload = { name, mobile_no: mobileNo };
      if (password) payload.password = password;
      
      const res = await api.put('/auth/profile', payload);
      
      // Update local storage
      localStorage.setItem('userName', res.data.name || res.data.email.split('@')[0]);
      localStorage.setItem('userMobile', res.data.mobile_no || '');
      
      setMessage('Profile updated successfully! Redirecting...');
      setPassword(''); // clear password field
      setTimeout(() => navigate('/'), 2000); // Redirect to home page after 2 seconds
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div className="container fade-in-up" style={{ padding: '5rem 0', maxWidth: '600px' }}>
      <div className="glass-panel">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--accent-gold)' }}>Update Profile</h2>
        
        <form onSubmit={handleUpdate}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email (Read-only)</label>
            <input type="email" value={email} disabled style={{ background: 'rgba(255,255,255,0.05)', cursor: 'not-allowed', color: 'var(--text-muted)' }} />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Display Name" />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Mobile Number</label>
            <input type="text" value={mobileNo} onChange={(e) => setMobileNo(e.target.value)} required />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>New Password (leave blank to keep current)</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Save Changes</button>
          
          {message && <p style={{ color: '#6bff6b', marginTop: '1rem', textAlign: 'center' }}>{message}</p>}
          {error && <p style={{ color: '#ff6b6b', marginTop: '1rem', textAlign: 'center' }}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Profile;
