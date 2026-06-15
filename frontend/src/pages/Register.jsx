import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [otpMethod, setOtpMethod] = useState('email');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/auth/send-otp', { email, mobile_no: mobileNo, method: otpMethod });
      setSuccess(`OTP sent to your ${otpMethod}!`);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/auth/register', { email, mobile_no: mobileNo, password, otp });
      setSuccess('Registration successful! You can now login.');
      setTimeout(() => navigate('/login'), 2000); // Redirect to login page
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container fade-in-up" style={{ padding: '5rem 0', maxWidth: '400px' }}>
      <div className="glass-panel">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--accent-gold)' }}>Sign Up</h2>
        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email (Use @seednutz.co.in for Admin)</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Mobile Number</label>
              <input type="text" required value={mobileNo} onChange={(e) => setMobileNo(e.target.value)} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Receive OTP Via</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <label><input type="radio" value="email" checked={otpMethod === 'email'} onChange={(e) => setOtpMethod(e.target.value)} /> Email</label>
                <label><input type="radio" value="mobile" checked={otpMethod === 'mobile'} onChange={(e) => setOtpMethod(e.target.value)} /> Mobile SMS</label>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send OTP</button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Enter 6-digit OTP</label>
              <input type="text" required value={otp} onChange={(e) => setOtp(e.target.value)} maxLength="6" />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Verify & Register</button>
            <button type="button" onClick={() => setStep(1)} className="btn btn-outline" style={{ width: '100%', marginTop: '1rem' }}>Back</button>
          </form>
        )}
        
        {error && <p style={{ color: '#ff6b6b', marginTop: '1rem', textAlign: 'center' }}>{error}</p>}
        {success && <p style={{ color: '#6bff6b', marginTop: '1rem', textAlign: 'center' }}>{success}</p>}
      </div>
    </div>
  );
};

export default Register;
