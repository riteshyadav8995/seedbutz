import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus } from 'lucide-react';
import api from '../api';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [settings, setSettings] = useState(null);
  
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'messages', 'settings'
  const [editingProductId, setEditingProductId] = useState(null);

  // Product form
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', type: 'Roasted', flavor: '', dietaryRestrictions: '',
    nutritionFacts: { calories: '', fat: '', protein: '', carbs: '' }, ingredients: '', image: '', images: []
  });

  // Settings new field states
  const [newContactField, setNewContactField] = useState({ id: '', label: '', type: 'text', required: false });
  const [newOptionValue, setNewOptionValue] = useState({ type: '', flavor: '', dietary: '' });

  useEffect(() => {
    fetchProducts();
    fetchMessages();
    fetchSettings();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchMessages = async () => {
    try {
      const res = await api.get('/messages');
      setMessages(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      setSettings(res.data);
    } catch (err) { console.error(err); }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        dietaryRestrictions: typeof formData.dietaryRestrictions === 'string' 
          ? formData.dietaryRestrictions.split(',').map(s => s.trim()) 
          : formData.dietaryRestrictions
      };
      if (editingProductId) {
        await api.put(`/products/${editingProductId}`, dataToSubmit);
        alert("Product updated!");
      } else {
        await api.post('/products', dataToSubmit);
        alert("Product added!");
      }
      fetchProducts();
      resetForm();
    } catch (err) { console.error(err); }
  };

  const resetForm = () => {
    setFormData({
      name: '', description: '', price: '', type: 'Roasted', flavor: '', dietaryRestrictions: '',
      nutritionFacts: { calories: '', fat: '', protein: '', carbs: '' }, ingredients: '', image: '', images: []
    });
    setEditingProductId(null);
  };

  const handleEditProduct = (p) => {
    setFormData({
      name: p.name || '',
      description: p.description || '',
      price: p.price || '',
      type: p.type || 'Roasted',
      flavor: p.flavor || '',
      dietaryRestrictions: Array.isArray(p.dietaryRestrictions) ? p.dietaryRestrictions.join(', ') : (p.dietaryRestrictions || ''),
      nutritionFacts: p.nutritionFacts || { calories: '', fat: '', protein: '', carbs: '' },
      ingredients: p.ingredients || '',
      image: p.image || '',
      images: p.images || []
    });
    setEditingProductId(p._id);
  };

  const handleDeleteProduct = async (id) => {
    if(window.confirm('Delete this product?')){
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (err) { console.error(err); }
    }
  };

  // --- Settings Logic ---
  const saveSettings = async () => {
    try {
      await api.put('/settings', settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to save settings.');
    }
  };

  const addContactField = () => {
    if (!newContactField.id || !newContactField.label) return;
    setSettings({
      ...settings,
      contactFormFields: [...settings.contactFormFields, { ...newContactField }]
    });
    setNewContactField({ id: '', label: '', type: 'text', required: false });
  };

  const removeContactField = (id) => {
    setSettings({
      ...settings,
      contactFormFields: settings.contactFormFields.filter(f => f.id !== id)
    });
  };

  const addProductOption = (category, valueKey) => {
    const val = newOptionValue[valueKey];
    if (!val) return;
    setSettings({
      ...settings,
      [category]: [...(settings[category] || []), val]
    });
    setNewOptionValue({ ...newOptionValue, [valueKey]: '' });
  };

  const removeProductOption = (category, value) => {
    setSettings({
      ...settings,
      [category]: settings[category].filter(v => v !== value)
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if(files.length === 0) return;
    
    const uploadData = new FormData();
    files.forEach(file => uploadData.append('images', file));
    
    try {
      const res = await api.post('/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData({ ...formData, images: res.data.imageUrls, image: res.data.imageUrls[0] });
    } catch (err) {
      console.error(err);
      alert('Failed to upload image');
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    const baseUrl = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
    const normalizedPath = imagePath.replace(/\\/g, '/');
    return `${baseUrl}${normalizedPath.startsWith('/') ? '' : '/'}${normalizedPath}`;
  };

  return (
    <div className="container fade-in-up" style={{ padding: '2rem 0' }}>
      <h1>Admin Dashboard</h1>
      
      <div style={{ display: 'flex', gap: '1rem', margin: '2rem 0', alignItems: 'center' }}>
        <button onClick={() => setActiveTab('products')} className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-outline'}`}>Manage Products</button>
        <button onClick={() => setActiveTab('messages')} className={`btn ${activeTab === 'messages' ? 'btn-primary' : 'btn-outline'}`}>View Inquiries</button>
        <button onClick={() => setActiveTab('settings')} className={`btn ${activeTab === 'settings' ? 'btn-primary' : 'btn-outline'}`}>Settings</button>
      </div>

      {activeTab === 'products' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          <div className="glass-panel">
            <h3>{editingProductId ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleProductSubmit} style={{ marginTop: '1rem' }}>
              <input type="text" placeholder="Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Product Images</label>
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ background: 'transparent', padding: 0 }} />
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  {formData.images && formData.images.length > 0 ? (
                    formData.images.map((img, idx) => (
                      <img key={idx} src={getImageUrl(img)} alt={`Preview ${idx}`} style={{ height: '60px', borderRadius: '4px' }} />
                    ))
                  ) : formData.image ? (
                    <img src={getImageUrl(formData.image)} alt="Preview" style={{ height: '60px', borderRadius: '4px' }} />
                  ) : null}
                </div>
              </div>

              <textarea placeholder="Description" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              <input type="number" placeholder="Price" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option value="">Select Type</option>
                {settings?.productTypes?.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              
              <select value={formData.flavor} onChange={e => setFormData({...formData, flavor: e.target.value})} style={{ marginBottom: '1rem' }}>
                <option value="">Select Flavor</option>
                {settings?.productFlavors?.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
              
              <select value={formData.dietaryRestrictions} onChange={e => setFormData({...formData, dietaryRestrictions: e.target.value})} style={{ marginBottom: '1rem' }}>
                <option value="">Select Dietary Restriction</option>
                {settings?.productDietary?.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              
              <h4 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Nutrition & Ingredients</h4>
              <input type="number" placeholder="Calories" value={formData.nutritionFacts.calories} onChange={e => setFormData({...formData, nutritionFacts: {...formData.nutritionFacts, calories: e.target.value}})} />
              <input type="text" placeholder="Fat (e.g. 15g)" value={formData.nutritionFacts.fat} onChange={e => setFormData({...formData, nutritionFacts: {...formData.nutritionFacts, fat: e.target.value}})} />
              <input type="text" placeholder="Protein (e.g. 7g)" value={formData.nutritionFacts.protein} onChange={e => setFormData({...formData, nutritionFacts: {...formData.nutritionFacts, protein: e.target.value}})} />
              <input type="text" placeholder="Carbs (e.g. 5g)" value={formData.nutritionFacts.carbs} onChange={e => setFormData({...formData, nutritionFacts: {...formData.nutritionFacts, carbs: e.target.value}})} />
              
              <textarea placeholder="Ingredients (e.g. Organic Almonds, Sea Salt)" required value={formData.ingredients} onChange={e => setFormData({...formData, ingredients: e.target.value})} style={{ marginTop: '0.5rem' }}></textarea>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{editingProductId ? 'Update Product' : 'Add Product'}</button>
                {editingProductId && (
                  <button type="button" onClick={resetForm} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                )}
              </div>
            </form>
          </div>

          <div className="glass-panel" style={{ overflowY: 'auto', maxHeight: '800px' }}>
            <h3>Existing Products</h3>
            <ul style={{ listStyle: 'none', marginTop: '1rem' }}>
              {products.map(p => (
                <li key={p._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                  <div>
                    <strong>{p.name}</strong> - ₹{p.price} <br/>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.type} / {p.flavor}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleEditProduct(p)} style={{ background: 'var(--accent-gold)', color: '#000', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Edit</button>
                    <button onClick={() => handleDeleteProduct(p._id)} style={{ background: '#ff6b6b', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="glass-panel">
          <h3>Customer Inquiries</h3>
          <div style={{ marginTop: '1rem' }}>
            {messages.map(m => (
              <div key={m._id} style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <strong>{m.subject || m.customData?.subject || 'No Subject'}</strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{new Date(m.createdAt).toLocaleString()}</span>
                </div>
                <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--accent-gold)' }}>From: {m.name || m.customData?.name} ({m.email || m.customData?.email})</div>
                <p>{m.message || m.customData?.message}</p>
                
                {m.customData && Object.keys(m.customData).length > 0 && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <h5 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Additional Data:</h5>
                    {Object.entries(m.customData).map(([k, v]) => {
                      if (['name', 'email', 'subject', 'message'].includes(k)) return null;
                      return <div key={k}><strong>{k}:</strong> {v}</div>;
                    })}
                  </div>
                )}
              </div>
            ))}
            {messages.length === 0 && <p>No messages found.</p>}
          </div>
        </div>
      )}

      {activeTab === 'settings' && settings && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          
          {/* Dynamic Contact Form Settings */}
          <div className="glass-panel">
            <h3>Contact Form Fields</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>Configure the fields displayed on the Contact Us page.</p>
            
            <ul style={{ listStyle: 'none', marginBottom: '1rem' }}>
              {settings.contactFormFields.map(f => (
                <li key={f.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem', background: 'rgba(0,0,0,0.2)', borderRadius: '4px', marginBottom: '0.5rem' }}>
                  <div>
                    <strong>{f.label}</strong> <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>({f.type}) {f.required && '*'}</span>
                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-gold)' }}>ID: {f.id}</div>
                  </div>
                  <button onClick={() => removeContactField(f.id)} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer' }}><Trash2 size={18} /></button>
                </li>
              ))}
            </ul>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <input type="text" placeholder="Field ID (e.g. phone)" value={newContactField.id} onChange={e => setNewContactField({...newContactField, id: e.target.value.toLowerCase().replace(/\s+/g, '')})} style={{ flex: 1, minWidth: '100px' }} />
              <input type="text" placeholder="Label (e.g. Phone No)" value={newContactField.label} onChange={e => setNewContactField({...newContactField, label: e.target.value})} style={{ flex: 1, minWidth: '100px' }} />
              <select value={newContactField.type} onChange={e => setNewContactField({...newContactField, type: e.target.value})} style={{ flex: 1, minWidth: '100px' }}>
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="textarea">Textarea</option>
                <option value="number">Number</option>
              </select>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '100px' }}>
                <input type="checkbox" checked={newContactField.required} onChange={e => setNewContactField({...newContactField, required: e.target.checked})} style={{ width: 'auto' }} /> Required
              </label>
              <button onClick={addContactField} className="btn btn-primary" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={18} /></button>
            </div>
            
            <button onClick={saveSettings} className="btn btn-primary" style={{ width: '100%' }}>Save Settings</button>
          </div>

          {/* Dynamic Product Options Settings */}
          <div className="glass-panel">
            <h3>Product Options</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>Add or delete options for the Add Product dropdowns.</p>

            <div style={{ marginBottom: '2rem' }}>
              <h4>Types</h4>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                {settings.productTypes.map(t => (
                  <span key={t} style={{ background: 'rgba(255,255,255,0.1)', padding: '0.3rem 0.8rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {t} <XIcon onClick={() => removeProductOption('productTypes', t)} />
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="text" placeholder="New Type" value={newOptionValue.type} onChange={e => setNewOptionValue({...newOptionValue, type: e.target.value})} />
                <button onClick={() => addProductOption('productTypes', 'type')} className="btn btn-outline">Add</button>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h4>Flavors</h4>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                {settings.productFlavors.map(f => (
                  <span key={f} style={{ background: 'rgba(255,255,255,0.1)', padding: '0.3rem 0.8rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {f} <XIcon onClick={() => removeProductOption('productFlavors', f)} />
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="text" placeholder="New Flavor" value={newOptionValue.flavor} onChange={e => setNewOptionValue({...newOptionValue, flavor: e.target.value})} />
                <button onClick={() => addProductOption('productFlavors', 'flavor')} className="btn btn-outline">Add</button>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h4>Dietary Restrictions</h4>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                {settings.productDietary.map(d => (
                  <span key={d} style={{ background: 'rgba(255,255,255,0.1)', padding: '0.3rem 0.8rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {d} <XIcon onClick={() => removeProductOption('productDietary', d)} />
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="text" placeholder="New Dietary Option" value={newOptionValue.dietary} onChange={e => setNewOptionValue({...newOptionValue, dietary: e.target.value})} />
                <button onClick={() => addProductOption('productDietary', 'dietary')} className="btn btn-outline">Add</button>
              </div>
            </div>

            <button onClick={saveSettings} className="btn btn-primary" style={{ width: '100%' }}>Save Settings</button>
          </div>

        </div>
      )}
    </div>
  );
};

const XIcon = ({ onClick }) => (
  <span onClick={onClick} style={{ cursor: 'pointer', color: '#ff6b6b', fontWeight: 'bold' }}>&times;</span>
);

export default AdminDashboard;
