import React, { useState, useEffect } from 'react';
import api from '../api';

const Contact = () => {
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      if (res.data && res.data.contactFormFields) {
        setFields(res.data.contactFormFields);
        const initialData = {};
        res.data.contactFormFields.forEach(f => {
          initialData[f.id] = '';
        });
        setFormData(initialData);
      }
    } catch (error) {
      console.error('Error fetching contact form settings:', error);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');
    
    // Separate standard fields (name, email, subject, message) from customData
    const standardKeys = ['name', 'email', 'subject', 'message'];
    const payload = { customData: {} };
    
    Object.keys(formData).forEach(key => {
      if (standardKeys.includes(key)) {
        payload[key] = formData[key];
      } else {
        payload.customData[key] = formData[key];
      }
    });

    try {
      await api.post('/messages', payload);
      setStatus('Message sent successfully!');
      
      const resetData = {};
      fields.forEach(f => { resetData[f.id] = ''; });
      setFormData(resetData);
    } catch (error) {
      setStatus('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="container fade-in-up" style={{ padding: '4rem 0', maxWidth: '600px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>Get in <span style={{ color: 'var(--accent-gold)' }}>Touch</span></h1>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '3rem' }}>
        Have questions about our products or want to place a bulk order? We'd love to hear from you.
      </p>

      {fields.length > 0 ? (
        <form onSubmit={handleSubmit} className="glass-panel">
          {fields.map(field => (
            <div key={field.id} style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                {field.label} {field.required && '*'}
              </label>
              {field.type === 'textarea' ? (
                <textarea 
                  name={field.id} 
                  rows="5" 
                  required={field.required} 
                  value={formData[field.id] || ''} 
                  onChange={handleChange}
                ></textarea>
              ) : (
                <input 
                  type={field.type} 
                  name={field.id} 
                  required={field.required} 
                  value={formData[field.id] || ''} 
                  onChange={handleChange} 
                />
              )}
            </div>
          ))}
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Send Message</button>
          {status && <p style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--accent-gold)' }}>{status}</p>}
        </form>
      ) : (
        <p style={{ textAlign: 'center' }}>Loading contact form...</p>
      )}
    </div>
  );
};

export default Contact;
