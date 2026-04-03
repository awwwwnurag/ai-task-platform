import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import TaskModal from '../components/TaskModal';

const Dashboard = () => {
  const { logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [inputText, setInputText] = useState('');
  const [operation, setOperation] = useState('uppercase');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks');
      if (res.data.success) setTasks(res.data.data);
      // Automatically refresh the open modal info if the task is actively viewed
      setSelectedTask(prev => {
        if (!prev) return null;
        const updated = res.data.data.find(t => t._id === prev._id);
        return updated || prev;
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 2000); // Polling every 2s for more real-time feel
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:5000/api/tasks', {
        title,
        input_text: inputText,
        operation
      });
      setTitle('');
      setInputText('');
      setOperation('uppercase');
      fetchTasks();
    } catch (error) {
      console.error('Task submission failed:', error);
    }
    setIsSubmitting(false);
  };

  return (
    <div style={{ minHeight: '100vh', padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2>AI Tasks Dashboard</h2>
        <button onClick={logout} style={{ background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e)=>e.target.style.background='var(--surface-glass)'} onMouseOut={(e)=>e.target.style.background='transparent'}>Logout</button>
      </header>
      
      <div className="dashboard-container">
        <div className="glass-panel" style={{ padding: '30px' }}>
          <h3 className="mb-4">Create New Task</h3>
          <form onSubmit={handleSubmit}>
            <input 
              className="input-field mb-4" 
              placeholder="Task Title" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              required 
            />
            <textarea 
              className="input-field mb-4" 
              placeholder="Input Text" 
              value={inputText} 
              onChange={e => setInputText(e.target.value)} 
              required 
              rows="4"
              style={{ resize: 'vertical' }}
            />
            <select 
              className="input-field mb-4" 
              value={operation} 
              onChange={e => setOperation(e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              <option value="uppercase">Uppercase</option>
              <option value="lowercase">Lowercase</option>
              <option value="reverse string">Reverse String</option>
              <option value="word count">Word Count</option>
            </select>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Task'}
            </button>
          </form>
        </div>

        <div className="glass-panel" style={{ padding: '30px', minHeight: '400px' }}>
          <h3 className="mb-4">Your Tasks</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '600px', overflowY: 'auto', paddingRight: '10px' }}>
            {tasks.length === 0 ? (
              <p className="text-muted">No tasks created yet.</p>
            ) : (
              tasks.map(task => (
                <div 
                  key={task._id} 
                  className="glass-panel" 
                  style={{ padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                  onClick={() => setSelectedTask(task)}
                >
                  <div>
                    <h4 style={{ marginBottom: '5px' }}>{task.title}</h4>
                    <span className="text-muted" style={{ fontSize: '0.85rem' }}>{task.operation}</span>
                  </div>
                  <span className={`badge ${task.status}`}>{task.status}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
    </div>
  );
};

export default Dashboard;
