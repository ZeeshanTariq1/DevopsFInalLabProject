import { useState, useEffect } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || '/api'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('medium')
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 })

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API}/tasks`)
      setTasks(res.data)
      const completed = res.data.filter(t => t.completed).length
      setStats({ total: res.data.length, completed, pending: res.data.length - completed })
    } catch (err) {
      console.error('Fetch error:', err)
    }
  }

  useEffect(() => {
    fetchTasks()
    const interval = setInterval(fetchTasks, 5000)
    return () => clearInterval(interval)
  }, [])

  const addTask = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    try {
      await axios.post(`${API}/tasks`, { title, priority })
      setTitle('')
      fetchTasks()
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const toggleTask = async (id) => {
    await axios.patch(`${API}/tasks/${id}`)
    fetchTasks()
  }

  const deleteTask = async (id) => {
    await axios.delete(`${API}/tasks/${id}`)
    fetchTasks()
  }

  const priorityColor = { low: '#22c55e', medium: '#f59e0b', high: '#ef4444' }
  const filtered = tasks.filter(t =>
    filter === 'all' ? true : filter === 'done' ? t.completed : !t.completed
  )

  return (
    <div className="app">
      <header>
        <h1>📋 Smart Task Manager</h1>
        <p>DevOps Final Lab Project hvyy krke — Full Stack with AKS Deployment</p>
        <p>Group Members - Abdul Mateen Moeed Butt Muhammad Zeeshan Tariq</p>
      </header>

      <div className="stats">
        <div className="stat-card"><span className="stat-num">{stats.total}</span><span className="stat-label">Total</span></div>
        <div className="stat-card pending"><span className="stat-num">{stats.pending}</span><span className="stat-label">Pending</span></div>
        <div className="stat-card done"><span className="stat-num">{stats.completed}</span><span className="stat-label">Completed</span></div>
      </div>

      <form onSubmit={addTask} className="form" id="task-form">
        <input
          id="task-input"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Enter task title..."
          className="input"
        />
        <select id="priority-select" value={priority} onChange={e => setPriority(e.target.value)} className="select">
          <option value="low">🟢 Low</option>
          <option value="medium">🟡 Medium</option>
          <option value="high">🔴 High</option>
        </select>
        <button id="add-btn" type="submit" disabled={loading} className="btn-add">
          {loading ? 'Adding...' : '+ Add Task'}
        </button>
      </form>

      <div className="filter-bar">
        {['all', 'pending', 'done'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`filter-btn ${filter === f ? 'active' : ''}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="tasks" id="task-list">
        {filtered.length === 0 && <p className="empty">No tasks found.</p>}
        {filtered.map(task => (
          <div key={task._id} className={`task-card ${task.completed ? 'done' : ''}`} data-testid="task-item">
            <div className="task-left">
              <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task._id)} />
              <div>
                <p className="task-title">{task.title}</p>
                <span className="badge" style={{ background: priorityColor[task.priority] }}>
                  {task.priority}
                </span>
              </div>
            </div>
            <button onClick={() => deleteTask(task._id)} className="btn-del" aria-label="delete">✕</button>
          </div>
        ))}
      </div>

      <footer>
        <p>🚀 Deployed on Azure Kubernetes Service (AKS) | Built with React + Node.js + MongoDB</p>
      </footer>
    </div>
  )
}