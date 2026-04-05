import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // Default avatar if none provided
  const avatarUrl = user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=4e54c8&color=fff&rounded=true`;

  return (
    <nav style={{ padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--glass-bg)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--glass-border)', position: 'sticky', top: 0, zIndex: 100 }}>
      <Link to="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h2 style={{ textShadow: '0 0 15px rgba(143,148,251,0.5)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
          <span style={{ fontSize: '1.5rem' }}>✨</span> AI Tasks
        </h2>
      </Link>
      
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)} 
          className="btn-primary" 
          title="Toggle Theme"
          style={{ padding: '8px 12px', background: 'transparent', border: '1px solid var(--primary)', borderRadius: '20px', color: 'var(--text-main)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, width: 'max-content' }}>
          {isDarkMode ? '☀️' : '🌙'}
        </button>

        <div className="user-dropdown-container" ref={dropdownRef} style={{ position: 'relative' }}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{ 
              background: 'transparent', 
              border: '2px solid var(--primary)', 
              borderRadius: '50%', 
              padding: '2px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              width: '40px',
              height: '40px',
              boxShadow: '0 0 10px rgba(78, 84, 200, 0.3)'
            }}
          >
            <img src={avatarUrl} alt="User Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
          </button>

          {dropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '55px',
              right: '0',
              width: '200px',
              background: 'var(--color-bg2)',
              border: '1px solid var(--glass-border)',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-3d)',
              overflow: 'hidden',
              animation: 'slideInRight 0.2s ease-out'
            }}>
              <ul style={{ listStyle: 'none', margin: 0, padding: '10px 0' }}>
                <li>
                  <Link 
                    to="/my-account" 
                    onClick={() => setDropdownOpen(false)}
                    style={{ display: 'block', padding: '10px 20px', textDecoration: 'none', color: 'var(--text-main)', borderBottom: '1px solid var(--glass-border)' }}
                    onMouseOver={(e) => e.target.style.background = 'var(--glass-bg)'}
                    onMouseOut={(e) => e.target.style.background = 'transparent'}
                  >
                    👤 My account
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/settings" 
                    onClick={() => setDropdownOpen(false)}
                    style={{ display: 'block', padding: '10px 20px', textDecoration: 'none', color: 'var(--text-main)', borderBottom: '1px solid var(--glass-border)' }}
                    onMouseOver={(e) => e.target.style.background = 'var(--glass-bg)'}
                    onMouseOut={(e) => e.target.style.background = 'transparent'}
                  >
                    ⚙️ Settings
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', padding: '10px 20px', cursor: 'pointer', color: 'var(--accent)', fontWeight: 'bold' }}
                    onMouseOver={(e) => e.target.style.background = 'rgba(255, 42, 95, 0.1)'}
                    onMouseOut={(e) => e.target.style.background = 'transparent'}
                  >
                    🚪 Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
