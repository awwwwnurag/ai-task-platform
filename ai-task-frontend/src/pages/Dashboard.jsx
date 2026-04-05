import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'https://ai-task-backend-xt0g.onrender.com/api';

const Dashboard = () => {
  const { logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [inputText, setInputText] = useState('');
  const [agent, setAgent] = useState('openai');
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/tasks`);
      if (res.data.success) setTasks(res.data.data);
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
      await axios.post(`${API_URL}/tasks`, {
        title,
        input_text: inputText,
        operation: "ai_prompt",
        agent
      });
      setTitle('');
      setInputText('');
      setAgent('openai');
      fetchTasks();
    } catch (error) {
      console.error('Task submission failed:', error);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // prevent modal opening if TaskModal is used
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const formatTimeInfo = (task) => {
    const createdAt = new Date(task.createdAt);
    const updatedAt = new Date(task.updatedAt);
    const addedTime = createdAt.toLocaleString();
    let timeTaken = '';

    if (task.status === 'success' || task.status === 'failed') {
      const diffStr = ((updatedAt - createdAt) / 1000).toFixed(1);
      timeTaken = `${diffStr} seconds`;
    } else if (task.status === 'running') {
      const diffStr = ((new Date() - createdAt) / 1000).toFixed(1);
      timeTaken = `${diffStr}s (running...)`;
    } else {
      timeTaken = 'Pending...';
    }

    return { addedTime, timeTaken };
  };

  return (
    <div style={{ minHeight: '100vh', padding: '20px', overflow: 'hidden' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 40px', maxWidth: '1300px', margin: '0 auto', animation: 'slideInRight 0.8s ease-out' }}>
        <h2 style={{ textShadow: '0 0 15px rgba(143,148,251,0.5)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.5rem' }}>✨</span> AI Tasks
        </h2>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)} 
            className="btn-primary" 
            style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--primary)', borderRadius: '20px', color: 'var(--text-main)' }}>
            {isDarkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
          <button onClick={logout} className="btn-primary" style={{ padding: '8px 24px', width: 'auto', background: 'transparent', border: '1px solid var(--primary)', borderRadius: '20px' }}>Logout</button>
        </div>
      </header>
      
      <div className="dashboard-container">
        <div className="glass-panel" style={{ padding: '30px' }}>
          <h3 className="mb-4">Create AI Prompt</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Task Name</label>
              <input 
                className="input-field" 
                placeholder="e.g. Generate Image" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                required 
                style={{ marginBottom: 0 }}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Task Prompt</label>
              <textarea 
                className="input-field" 
                placeholder="Enter your detailed AI Prompt here..." 
                value={inputText} 
                onChange={e => setInputText(e.target.value)} 
                required 
                rows="4"
                style={{ resize: 'vertical', marginBottom: 0 }}
              />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Agent Selection</label>
              <select 
                className="input-field" 
                value={agent} 
                onChange={e => setAgent(e.target.value)}
                style={{ cursor: 'pointer', marginBottom: 0 }}
              >
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
                <option value="gemini">Gemini</option>
                <option value="llama3">Llama 3</option>
              </select>
            </div>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : 'Submit Prompt'}
            </button>
          </form>
        </div>

        <div className="glass-panel" style={{ padding: '30px', minHeight: '400px' }}>
          <h3 className="mb-4">Task History</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '600px', overflowY: 'auto', paddingRight: '10px' }}>
            {tasks.length === 0 ? (
              <p className="text-muted">No tasks created yet.</p>
            ) : (
              tasks.map((task, i) => {
                const timeInfo = formatTimeInfo(task);
                return (
                 <div 
                   key={task._id} 
                   className="glass-panel task-item" 
                   style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', animationDelay: `${i * 0.05}s` }}
                 >
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div>
                       <span className={`badge ${task.status}`}>{task.status}</span>
                     </div>
                     <button 
                       onClick={(e) => handleDelete(e, task._id)}
                       style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.5)', color: '#ef4444', padding: '5px 10px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.3s' }}
                       onMouseOver={e => e.target.style.background = 'rgba(239, 68, 68, 0.4)'}
                       onMouseOut={e => e.target.style.background = 'rgba(239, 68, 68, 0.2)'}
                     >
                       Delete
                     </button>
                   </div>
                   
                   <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                     <strong>Task Name: </strong> {task.title}
                     <br/>
                     <strong>Agent: </strong> <span style={{textTransform: 'capitalize'}}>{task.agent || 'Gemini'}</span>
                     <hr style={{ borderColor: 'var(--glass-border)', margin: '10px 0' }}/>
                     <strong>Prompt: </strong> {task.input_text}
                   </div>
                   
                   {task.status === 'success' && (
                     <div style={{ background: 'rgba(78, 84, 200, 0.1)', padding: '10px', borderRadius: '8px', border: '1px solid var(--primary)', color: 'var(--primary-hover)' }}>
                       <strong>Result: </strong> {task.result}
                     </div>
                   )}
                   {(task.status === 'pending' || task.status === 'running') && (
                      <div className="terminal-window" style={{ maxHeight: '100px', padding: '10px' }}>
                        Processing prompt...
                      </div>
                   )}
                   
                   <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '5px' }}>
                     <span><strong>Added: </strong> {timeInfo.addedTime}</span>
                     <span><strong>Time Taken: </strong> {timeInfo.timeTaken}</span>
                   </div>
                 </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
