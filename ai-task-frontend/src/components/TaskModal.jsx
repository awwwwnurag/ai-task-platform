import React from 'react';

const TaskModal = ({ task, onClose }) => {
  if (!task) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="glass-panel" style={{ width: '90%', maxWidth: '600px', padding: '30px', position: 'relative' }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>
          &times;
        </button>
        <h2 className="mb-2">{task.title}</h2>
        <span className={`badge ${task.status}`}>{task.status}</span>
        
        <div style={{ marginTop: '20px' }}>
          <h4 className="text-muted mb-2">Operation</h4>
          <p>{task.operation}</p>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h4 className="text-muted mb-2">Input</h4>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px' }}>
            {task.input_text}
          </div>
        </div>

        {task.status !== 'pending' && task.status !== 'running' && (
          <div style={{ marginTop: '20px' }}>
            <h4 className="text-muted mb-2">Result</h4>
            <div style={{ background: 'rgba(99, 102, 241, 0.2)', border: '1px solid var(--primary)', padding: '10px', borderRadius: '8px' }}>
              {task.result !== null ? String(task.result) : 'No result'}
            </div>
          </div>
        )}

        <div style={{ marginTop: '20px' }}>
          <h4 className="text-muted mb-2">Execution Logs</h4>
          <div style={{ background: '#000', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'monospace', maxHeight: '150px', overflowY: 'auto' }}>
            {task.logs && task.logs.length > 0 ? (
              task.logs.map((log, i) => (
                <div key={i} style={{ marginBottom: '4px', color: '#10b981' }}>&gt; {log}</div>
              ))
            ) : (
              <span className="text-muted">Awaiting logs...</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
