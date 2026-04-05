import React from 'react';

const Settings = () => {
  return (
    <div className="dashboard-container" style={{ display: 'block', maxWidth: '800px', margin: '40px auto' }}>
      <div className="glass-panel" style={{ padding: '40px' }}>
        <h2 className="mb-4">General Settings</h2>
        
        <div style={{ marginBottom: '30px' }}>
          <h4>Theme Preferences</h4>
          <p className="text-muted mb-2">Switch between light and dark modes from the top navigation bar.</p>
        </div>

        <div style={{ marginBottom: '30px', padding: '20px', background: 'var(--color-bg2)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
          <h4>Notification Preferences</h4>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '15px' }}>
            <input type="checkbox" defaultChecked /> Email alerts for failed tasks
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
            <input type="checkbox" defaultChecked /> Push notifications on task complete
          </label>
        </div>

        <div style={{ padding: '20px', background: 'var(--color-bg2)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
          <h4>API Configurations</h4>
          <p className="text-muted mb-2">Configure default AI Agents and fallback options.</p>
          <select className="input-field" style={{ maxWidth: '300px' }} defaultValue="openai">
            <option value="openai">OpenAI (Default)</option>
            <option value="anthropic">Anthropic</option>
            <option value="gemini">Gemini</option>
          </select>
        </div>
        
        <button className="btn-primary" style={{ marginTop: '30px' }}>
          Save Configuration
        </button>
      </div>
    </div>
  );
};

export default Settings;
