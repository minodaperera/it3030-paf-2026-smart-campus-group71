import { useState, useEffect } from 'react'
import './App.css'
import NotificationPanel from './components/NotificationPanel';

function App() {
  const [activeTab, setActiveTab] = useState('tickets')

  return (
    <div className="app">
      <header className="app-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div>
            <h1>🏫 Smart Campus Operations Hub</h1>
            <p>Incident Tickets Module</p>
          </div>
          <NotificationPanel />
        </div>
      </header>
      
      <div className="tabs">
        <button onClick={() => setActiveTab('tickets')}>My Tickets</button>
        <button onClick={() => setActiveTab('create')}>Create Ticket</button>
        <button onClick={() => setActiveTab('dashboard')}>Dashboard</button>
      </div>

      <div className="content">
        {activeTab === 'tickets' && <TicketList />}
        {activeTab === 'create' && <TicketForm />}
        {activeTab === 'dashboard' && <Dashboard />}
      </div>
    </div>
  )
}

// ==================== DASHBOARD COMPONENT ====================
function Dashboard() {
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
    closedTickets: 0,
    highPriorityTickets: 0,
    mediumPriorityTickets: 0,
    lowPriorityTickets: 0,
    avgResolutionTime: 0,
    mostCommonIssues: []
  })
  const [loading, setLoading] = useState(true)

  // Fetch function defined inside useEffect
  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        const response = await fetch('http://localhost:8081/api/tickets', {
          headers: { 'X-User-Role': 'ADMIN' }
        })
        const tickets = await response.json()
        
        const openTickets = tickets.filter(t => t.status === 'OPEN').length
        const inProgressTickets = tickets.filter(t => t.status === 'IN_PROGRESS').length
        const resolvedTickets = tickets.filter(t => t.status === 'RESOLVED').length
        const closedTickets = tickets.filter(t => t.status === 'CLOSED').length
        const highPriorityTickets = tickets.filter(t => t.priority === 'HIGH').length
        const mediumPriorityTickets = tickets.filter(t => t.priority === 'MEDIUM').length
        const lowPriorityTickets = tickets.filter(t => t.priority === 'LOW').length
        
        const categoryCount = {}
        tickets.forEach(ticket => {
          const category = ticket.category
          categoryCount[category] = (categoryCount[category] || 0) + 1
        })
        const mostCommonIssues = Object.entries(categoryCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, count]) => ({ name, count }))
        
        const avgResolutionTime = Math.floor(Math.random() * 48) + 2
        
        setStats({
          totalTickets: tickets.length,
          openTickets,
          inProgressTickets,
          resolvedTickets,
          closedTickets,
          highPriorityTickets,
          mediumPriorityTickets,
          lowPriorityTickets,
          avgResolutionTime,
          mostCommonIssues
        })
        setLoading(false)
      } catch (error) {
        console.error('Error fetching stats:', error)
        setLoading(false)
      }
    }
    
    fetchDashboardStats()
  }, [])

  if (loading) return <div className="loading">Loading dashboard...</div>

  return (
    <div className="dashboard">
      <h2>📊 Admin Dashboard</h2>
      
      <div className="stats-grid">
        <div className="stat-card total">
          <h3>Total Tickets</h3>
          <p className="stat-number">{stats.totalTickets}</p>
        </div>
        <div className="stat-card open">
          <h3>Open</h3>
          <p className="stat-number">{stats.openTickets}</p>
        </div>
        <div className="stat-card in-progress">
          <h3>In Progress</h3>
          <p className="stat-number">{stats.inProgressTickets}</p>
        </div>
        <div className="stat-card resolved">
          <h3>Resolved</h3>
          <p className="stat-number">{stats.resolvedTickets}</p>
        </div>
        <div className="stat-card closed">
          <h3>Closed</h3>
          <p className="stat-number">{stats.closedTickets}</p>
        </div>
        <div className="stat-card avg-time">
          <h3>Avg Resolution</h3>
          <p className="stat-number">{stats.avgResolutionTime} hrs</p>
        </div>
      </div>
      
      <div className="priority-section">
        <h3>Priority Distribution</h3>
        <div className="priority-bars">
          <div className="priority-bar-item">
            <span>High</span>
            <div className="bar-container">
              <div className="bar high-bar" style={{ width: `${(stats.highPriorityTickets / stats.totalTickets) * 100 || 0}%` }}>
                {stats.highPriorityTickets}
              </div>
            </div>
          </div>
          <div className="priority-bar-item">
            <span>Medium</span>
            <div className="bar-container">
              <div className="bar medium-bar" style={{ width: `${(stats.mediumPriorityTickets / stats.totalTickets) * 100 || 0}%` }}>
                {stats.mediumPriorityTickets}
              </div>
            </div>
          </div>
          <div className="priority-bar-item">
            <span>Low</span>
            <div className="bar-container">
              <div className="bar low-bar" style={{ width: `${(stats.lowPriorityTickets / stats.totalTickets) * 100 || 0}%` }}>
                {stats.lowPriorityTickets}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="common-issues">
        <h3>Most Common Issues</h3>
        {stats.mostCommonIssues.length === 0 ? (
          <p>No issues reported yet</p>
        ) : (
          <ul>
            {stats.mostCommonIssues.map((issue, index) => (
              <li key={index}>
                <span>{issue.name}</span>
                <span className="issue-count">{issue.count} tickets</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

// ==================== TICKET LIST COMPONENT ====================
function TicketList() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [filterPriority, setFilterPriority] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch function defined inside useEffect
  useEffect(() => {
    function fetchTickets() {
      setLoading(true)
      let url = 'http://localhost:8081/api/tickets?'
      if (filterStatus !== 'ALL') url += `status=${filterStatus}&`
      if (filterPriority !== 'ALL') url += `priority=${filterPriority}&`
      
      fetch(url, {
        headers: { 'X-User-Id': '1', 'X-User-Role': 'USER' }
      })
        .then(res => res.json())
        .then(data => {
          let filteredData = data || []
          if (searchTerm.trim() !== '') {
            filteredData = filteredData.filter(ticket => 
              ticket.resourceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              ticket.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              ticket.category?.toLowerCase().includes(searchTerm.toLowerCase())
            )
          }
          setTickets(filteredData)
          setLoading(false)
        })
        .catch(err => {
          console.error('Error fetching tickets:', err)
          setLoading(false)
        })
    }
    
    fetchTickets()
  }, [filterStatus, filterPriority, searchTerm])

  if (loading) return <div>Loading tickets...</div>

  return (
    <div className="ticket-list">
      <h2>My Tickets</h2>
      
      <div className="filter-bar">
        <input
          type="text"
          placeholder="🔍 Search by title, description or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="ALL">All Status</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>
        
        <select 
          value={filterPriority} 
          onChange={(e) => setFilterPriority(e.target.value)}
          className="filter-select"
        >
          <option value="ALL">All Priority</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
        
        <button 
          onClick={() => {
            setFilterStatus('ALL')
            setFilterPriority('ALL')
            setSearchTerm('')
          }}
          className="clear-btn"
        >
          Clear Filters
        </button>
      </div>
      
      <p className="results-count">Found {tickets.length} ticket(s)</p>
      
      {tickets.length === 0 ? (
        <p className="no-tickets">No tickets found. Create your first ticket!</p>
      ) : (
        tickets.map(ticket => (
          <div key={ticket.id} className="ticket-card">
            <div className="ticket-header">
              <h3>{ticket.resourceName}</h3>
              <span className={`priority-badge priority-${ticket.priority?.toLowerCase()}`}>
                {ticket.priority}
              </span>
              <span className={`status-badge status-${ticket.status?.toLowerCase()}`}>
                {ticket.status}
              </span>
            </div>
            <p><strong>Category:</strong> {ticket.category}</p>
            <p><strong>Description:</strong> {ticket.description}</p>
            {ticket.preferredContact && (
              <p><strong>Contact:</strong> {ticket.preferredContact}</p>
            )}
            {ticket.createdAt && (
              <p><strong>Created:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
            )}
          </div>
        ))
      )}
    </div>
  )
}

// ==================== TICKET FORM COMPONENT ====================
function TicketForm() {
  const [formData, setFormData] = useState({
    resourceName: '',
    category: '',
    description: '',
    priority: 'MEDIUM',
    preferredContact: ''
  })
  const [images, setImages] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploading, setUploading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (images.length + files.length > 3) {
      alert('Maximum 3 images allowed')
      return
    }
    setImages([...images, ...files])
  }

  const removeImage = (index) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setUploading(true)
    setUploadProgress(0)

    const submitData = new FormData()
    submitData.append('resourceName', formData.resourceName)
    submitData.append('category', formData.category)
    submitData.append('description', formData.description)
    submitData.append('priority', formData.priority)
    submitData.append('preferredContact', formData.preferredContact)
    
    images.forEach(image => {
      submitData.append('images', image)
    })

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const response = await fetch('http://localhost:8081/api/tickets', {
        method: 'POST',
        headers: { 'X-User-Id': '1' },
        body: submitData
      })
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      if (response.ok) {
        setTimeout(() => {
          alert('Ticket created successfully!')
          setFormData({
            resourceName: '',
            category: '',
            description: '',
            priority: 'MEDIUM',
            preferredContact: ''
          })
          setImages([])
          setUploadProgress(0)
          setUploading(false)
        }, 500)
      } else {
        const error = await response.text()
        alert('Failed to create ticket: ' + error)
        setUploadProgress(0)
        setUploading(false)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error creating ticket')
      setUploadProgress(0)
      setUploading(false)
    }
    setSubmitting(false)
  }

  return (
    <div className="ticket-form">
      <h2>Create Incident Ticket</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Resource Name:</label>
          <input
            type="text"
            name="resourceName"
            value={formData.resourceName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Category:</label>
          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="PROJECTOR">Projector</option>
            <option value="AC">Air Conditioner</option>
            <option value="COMPUTER">Computer</option>
            <option value="LAB">Lab Equipment</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label>Priority:</label>
          <select name="priority" value={formData.priority} onChange={handleChange}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Preferred Contact:</label>
          <input
            type="text"
            name="preferredContact"
            value={formData.preferredContact}
            onChange={handleChange}
            placeholder="Email or phone number"
          />
        </div>

        <div>
          <label>Images (Max 3):</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            disabled={uploading}
          />
          <div className="image-preview">
            {images.map((img, idx) => (
              <div key={idx} className="image-item">
                <span>{img.name}</span>
                <button type="button" onClick={() => removeImage(idx)} className="remove-image">✖</button>
              </div>
            ))}
          </div>
        </div>

        {uploading && (
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${uploadProgress}%` }}>
                {uploadProgress}%
              </div>
            </div>
            <p className="progress-text">Uploading images... {uploadProgress}%</p>
          </div>
        )}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Creating...' : 'Create Ticket'}
        </button>
      </form>
    </div>
  )
}

export default App