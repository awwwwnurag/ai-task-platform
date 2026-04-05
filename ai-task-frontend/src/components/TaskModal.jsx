import React from 'react';

const TaskModal = ({ task, onClose }) => {
  if (!task) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
      <div className="glass-panel" style={{ width: '90%', maxWidth: '600px', padding: '30px', position: 'relative', transform: 'scale(1)', animation: 'scaleUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
        <style>{`@keyframes scaleUp { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer', transition: 'transform 0.2s' }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.2)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}>
          &times;
        </button>
        <h2 className="mb-2">{task.title}</h2>
        <span className={`badge ${task.status}`}>{task.status}</span>
        
        <div style={{ marginTop: '20px' }}>
          <h4 className="text-muted mb-2">Operation</h4>
          <p style={{ fontWeight: '500', color: 'var(--primary-hover)' }}>{task.operation}</p>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h4 className="text-muted mb-2">Input</h4>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
            {task.input_text}
          </div>
        </div>

        {task.status !== 'pending' && task.status !== 'running' && (
          <div style={{ marginTop: '20px' }}>
            <h4 className="text-muted mb-2">Result</h4>
            <div style={{ background: 'rgba(78, 84, 200, 0.1)', border: '1px solid var(--primary)', padding: '15px', borderRadius: '8px', boxShadow: 'inset 0 0 10px rgba(78,84,200,0.2)' }}>
              {task.result !== null ? String(task.result) : 'No result'}
            </div>
          </div>
        )}

        <div style={{ marginTop: '20px' }}>
          <h4 className="text-muted mb-2">Execution Logs</h4>
          <div className="terminal-window">
            {task.logs && task.logs.length > 0 ? (
              task.logs.map((log, i) => (
                <div key={i} className="terminal-line">&gt; {log}</div>
              ))
            ) : (
              <span className="text-muted">Awaiting logs... <span className="text-accent" style={{animation: 'blink 1s infinite'}}>_</span></span>
            )}
            <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
