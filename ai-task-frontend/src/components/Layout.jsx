import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-bg1)' }}>
      <Navbar />
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
      {/* Footer */}
      <footer style={{ marginTop: 'auto', padding: '30px', textAlign: 'center', borderTop: '1px solid var(--glass-border)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        <p>&copy; {new Date().getFullYear()} AI Tasks Platform. All Rights Reserved.</p>
        <p style={{ marginTop: '5px' }}>Powered by advanced LLM Agents.</p>
      </footer>
    </div>
  );
};

export default Layout;
