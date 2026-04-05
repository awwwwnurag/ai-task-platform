import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'https://ai-task-backend-xt0g.onrender.com/api';

const MyAccount = () => {
  const { user, setUser } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setAvatar(user.avatar || '');
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result); // Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await axios.put(`${API_URL}/auth/profile`, { name, email, avatar });
      if (res.data.success) {
        setUser(res.data.data);
        alert('Profile updated successfully!');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update profile.');
    }
    setIsSaving(false);
  };

  return (
    <div className="dashboard-container" style={{ display: 'block', maxWidth: '800px', margin: '40px auto' }}>
      <div className="glass-panel" style={{ padding: '40px' }}>
        <h2 className="mb-4">My Account</h2>
        <form onSubmit={handleSave}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '30px' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--primary)' }}>
              {avatar ? (
                <img src={avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', background: 'var(--color-bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  No Image
                </div>
              )}
            </div>
            <div>
              <label className="btn-primary" style={{ cursor: 'pointer', padding: '8px 16px', fontSize: '0.9rem' }}>
                Change Picture
                <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
              </label>
              <p className="text-muted mt-2" style={{ fontSize: '0.8rem', marginTop: '10px' }}>Recommended size: 256x256px.</p>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Full Name</label>
            <input 
              className="input-field" 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Email Address</label>
            <input 
              className="input-field" 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="btn-primary" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MyAccount;
