import { useState, useEffect } from 'react'
import './App.css'
import NotificationPanel from './components/NotificationPanel';
import { ToastContainer } from './components/Toast';
import ExportButtons from './components/ExportButtons';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

function App() {
  const [activeTab, setActiveTab] = useState('tickets')
  const [ticketCount, setTicketCount] = useState(0)
  const [toasts, setToasts] = useState([])
  const [darkMode, setDarkMode] = useState(false)
  const [user, setUser] = useState({
    id: 1,
    name: 'Hirushi Fernando',
    email: 'hirushi@campus.com',
    role: 'USER',
    joinDate: '2024-01-15',
    avatar: '👩‍💻'
  })

  const addToast = (message, type) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, 3000)
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const switchRole = (newRole) => {
    setUser({ ...user, role: newRole })
    addToast(`Switched to ${newRole} role`, 'success')
  }

  useEffect(() => {
    fetch('http://localhost:8081/api/tickets', {
      headers: { 'X-User-Id': '1', 'X-User-Role': user.role }
    })
      .then(res => res.json())
      .then(data => setTicketCount(data.length))
      .catch(err => console.error('Error fetching count:', err))
  }, [user.role])

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault()
        setActiveTab('create')
        addToast('Ctrl+N pressed - Create new ticket', 'success')
      }
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault()
        setActiveTab('dashboard')
      }
      if (e.ctrlKey && e.key === 't') {
        e.preventDefault()
        setActiveTab('tickets')
      }
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault()
        setActiveTab('profile')
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <header className="app-header">
        <div className="header-content">
          <div className="header-icon">
            <span>🏫</span>
          </div>
          <div className="header-text">
            <h1>Smart Campus Operations Hub</h1>
            <p>Incident Tickets Module</p>
          </div>
        </div>
        <div style={{ position: 'absolute', top: '20px', right: '30px' }}>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <select 
              value={user.role}
              onChange={(e) => switchRole(e.target.value)}
              className="role-switcher"
              title="Switch Role (Demo Only)"
            >
              <option value="USER">👤 User View</option>
              <option value="TECHNICIAN">🔧 Technician View</option>
              <option value="ADMIN">👑 Admin View</option>
            </select>
            <button onClick={() => setDarkMode(!darkMode)} className="dark-mode-btn">
              {darkMode ? '☀️' : '🌙'}
            </button>
            <NotificationPanel />
          </div>
        </div>
      </header>
      
      <div className="tabs">
        <button className={activeTab === 'tickets' ? 'active' : ''} onClick={() => setActiveTab('tickets')}>
          🎫 My Tickets {ticketCount > 0 && <span className="tab-badge">{ticketCount}</span>}
        </button>
        <button className={activeTab === 'create' ? 'active' : ''} onClick={() => setActiveTab('create')}>
          ✨ Create Ticket
        </button>
        <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
          📊 Dashboard
        </button>
        <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
          👤 Profile
        </button>
      </div>

      <div className="content">
        {activeTab === 'tickets' && <TicketList addToast={addToast} userRole={user.role} />}
        {activeTab === 'create' && <TicketForm addToast={addToast} />}
        {activeTab === 'dashboard' && <Dashboard addToast={addToast} userRole={user.role} userId={user.id} />}
        {activeTab === 'profile' && <UserProfile user={user} addToast={addToast} />}
      </div>
    </div>
  )
}

function UserProfile({ user, addToast }) {
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState(user)

  const handleSave = () => {
    setIsEditing(false)
    addToast('Profile updated successfully!', 'success')
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar-wrapper">
          <div className="profile-avatar">{userData.avatar}</div>
        </div>
        <div className="profile-name-wrapper">
          <h2 className="profile-name">{userData.name}</h2>
          <span className="profile-role-badge">{userData.role}</span>
        </div>
      </div>
      
      <div className="profile-stats">
        <div className="profile-stat-card">
          <h3>Total Tickets</h3>
          <p className="stat-number">0</p>
        </div>
        <div className="profile-stat-card">
          <h3>Open Tickets</h3>
          <p className="stat-number">0</p>
        </div>
        <div className="profile-stat-card">
          <h3>Resolved Tickets</h3>
          <p className="stat-number">0</p>
        </div>
        <div className="profile-stat-card">
          <h3>Member Since</h3>
          <p className="stat-number" style={{ fontSize: '0.875rem' }}>
            {new Date(userData.joinDate).toLocaleDateString()}
          </p>
        </div>
      </div>
      
      <div className="profile-info">
        <h3>Profile Information</h3>
        {isEditing ? (
          <div className="profile-form">
            <div>
              <label>Name:</label>
              <input type="text" value={userData.name} onChange={(e) => setUserData({...userData, name: e.target.value})} />
            </div>
            <div>
              <label>Email:</label>
              <input type="email" value={userData.email} onChange={(e) => setUserData({...userData, email: e.target.value})} />
            </div>
            <div>
              <label>Avatar Emoji:</label>
              <input type="text" value={userData.avatar} onChange={(e) => setUserData({...userData, avatar: e.target.value})} maxLength="2" />
            </div>
            <button onClick={handleSave} className="save-btn">Save Changes</button>
            <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
          </div>
        ) : (
          <div className="profile-details">
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Role:</strong> {userData.role}</p>
            <p><strong>Joined:</strong> {new Date(userData.joinDate).toLocaleDateString()}</p>
            <button onClick={() => setIsEditing(true)} className="edit-btn">Edit Profile</button>
          </div>
        )}
      </div>
      
      <div className="profile-shortcuts">
        <h3>Keyboard Shortcuts</h3>
        <ul>
          <li><kbd>Ctrl</kbd> + <kbd>N</kbd> - Create New Ticket</li>
          <li><kbd>Ctrl</kbd> + <kbd>T</kbd> - Go to My Tickets</li>
          <li><kbd>Ctrl</kbd> + <kbd>D</kbd> - Go to Dashboard</li>
          <li><kbd>Ctrl</kbd> + <kbd>P</kbd> - Go to Profile</li>
        </ul>
      </div>
    </div>
  )
}

// ==================== ROLE-BASED DASHBOARD ====================
function Dashboard({ addToast, userRole, userId }) {
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
    closedTickets: 0,
    highPriorityTickets: 0,
    mediumPriorityTickets: 0,
    lowPriorityTickets: 0,
    myTickets: 0,
    myOpenTickets: 0,
    myResolvedTickets: 0,
    weeklyTrends: [12, 19, 15, 17, 14, 22, 18],
    myWeeklyTrends: [2, 5, 3, 4, 6, 8, 7]
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://localhost:8081/api/tickets', { 
          headers: { 'X-User-Role': userRole } 
        })
        const tickets = await response.json()
        
        // My tickets stats (for USER view)
        const myTickets = tickets.filter(t => t.userId === userId)
        const myOpenTickets = myTickets.filter(t => t.status === 'OPEN').length
        const myResolvedTickets = myTickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length
        
        // All tickets stats (for ADMIN/TECHNICIAN view)
        const openTickets = tickets.filter(t => t.status === 'OPEN').length
        const inProgressTickets = tickets.filter(t => t.status === 'IN_PROGRESS').length
        const resolvedTickets = tickets.filter(t => t.status === 'RESOLVED').length
        const closedTickets = tickets.filter(t => t.status === 'CLOSED').length
        const highPriorityTickets = tickets.filter(t => t.priority === 'HIGH').length
        const mediumPriorityTickets = tickets.filter(t => t.priority === 'MEDIUM').length
        const lowPriorityTickets = tickets.filter(t => t.priority === 'LOW').length
        
        setStats({
          totalTickets: tickets.length,
          openTickets,
          inProgressTickets,
          resolvedTickets,
          closedTickets,
          highPriorityTickets,
          mediumPriorityTickets,
          lowPriorityTickets,
          myTickets: myTickets.length,
          myOpenTickets,
          myResolvedTickets,
          weeklyTrends: [12, 19, 15, 17, 14, 22, 18],
          myWeeklyTrends: [2, 5, 3, 4, 6, 8, 7]
        })
        setLoading(false)
      } catch (error) {
        console.error('Error fetching stats:', error)
        setLoading(false)
      }
    }
    fetchData()
  }, [userRole, userId])

  const getWeeklyData = () => {
    if (userRole === 'USER') {
      return {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'My Tickets Created',
          data: stats.myWeeklyTrends,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
        }]
      }
    } else {
      return {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'All Tickets Created',
          data: stats.weeklyTrends,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
        }]
      }
    }
  }

  const getPriorityData = () => {
    return {
      labels: ['High', 'Medium', 'Low'],
      datasets: [{
        data: [stats.highPriorityTickets, stats.mediumPriorityTickets, stats.lowPriorityTickets],
        backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
      }]
    }
  }

  const getStatusData = () => {
    return {
      labels: ['Open', 'In Progress', 'Resolved', 'Closed'],
      datasets: [{
        data: [stats.openTickets, stats.inProgressTickets, stats.resolvedTickets, stats.closedTickets],
        backgroundColor: ['#3b82f6', '#f59e0b', '#10b981', '#64748b'],
      }]
    }
  }

  const getMyStatusData = () => {
    return {
      labels: ['Open', 'Resolved'],
      datasets: [{
        data: [stats.myOpenTickets, stats.myResolvedTickets],
        backgroundColor: ['#3b82f6', '#10b981'],
      }]
    }
  }

  if (loading) return <div className="loading">Loading dashboard...</div>

  // ==================== USER DASHBOARD ====================
  if (userRole === 'USER') {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h2>📊 My Personal Dashboard</h2>
          <div className="role-badge user-badge">👤 User View</div>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card total">
            <h3>My Total Tickets</h3>
            <p className="stat-number">{stats.myTickets}</p>
          </div>
          <div className="stat-card open">
            <h3>Open Tickets</h3>
            <p className="stat-number">{stats.myOpenTickets}</p>
          </div>
          <div className="stat-card resolved">
            <h3>Resolved Tickets</h3>
            <p className="stat-number">{stats.myResolvedTickets}</p>
          </div>
          <div className="stat-card avg-time">
            <h3>Resolution Rate</h3>
            <p className="stat-number">{stats.myTickets === 0 ? 0 : Math.round((stats.myResolvedTickets / stats.myTickets) * 100)}%</p>
          </div>
        </div>
        
        <div className="charts-section">
          <div className="chart-card">
            <h3>📈 My Ticket Activity (Weekly)</h3>
            <Bar data={getWeeklyData()} options={{ responsive: true }} />
          </div>
          <div className="chart-card">
            <h3>🥧 My Ticket Status</h3>
            <Pie data={getMyStatusData()} options={{ responsive: true }} />
          </div>
        </div>
        
        <div className="priority-section">
          <h3>⚡ My Priority Distribution</h3>
          <div className="priority-bars">
            <div className="priority-bar-item">
              <span>High</span>
              <div className="bar-container">
                <div className="bar high-bar" style={{ width: `${(stats.highPriorityTickets / stats.myTickets) * 100 || 0}%` }}>
                  {stats.highPriorityTickets}
                </div>
              </div>
            </div>
            <div className="priority-bar-item">
              <span>Medium</span>
              <div className="bar-container">
                <div className="bar medium-bar" style={{ width: `${(stats.mediumPriorityTickets / stats.myTickets) * 100 || 0}%` }}>
                  {stats.mediumPriorityTickets}
                </div>
              </div>
            </div>
            <div className="priority-bar-item">
              <span>Low</span>
              <div className="bar-container">
                <div className="bar low-bar" style={{ width: `${(stats.lowPriorityTickets / stats.myTickets) * 100 || 0}%` }}>
                  {stats.lowPriorityTickets}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="insight-card">
          <h3>💡 Personal Insight</h3>
          <p>You have {stats.myOpenTickets} open ticket(s). {stats.myResolvedTickets} ticket(s) resolved successfully!</p>
        </div>
      </div>
    )
  }

  // ==================== TECHNICIAN DASHBOARD ====================
  if (userRole === 'TECHNICIAN') {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h2>🔧 Technician Dashboard</h2>
          <div className="role-badge technician-badge">👨‍🔧 Technician View</div>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card total">
            <h3>Total System Tickets</h3>
            <p className="stat-number">{stats.totalTickets}</p>
          </div>
          <div className="stat-card open">
            <h3>Open Tickets</h3>
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
            <h3>Pending Tasks</h3>
            <p className="stat-number">{stats.openTickets + stats.inProgressTickets}</p>
          </div>
        </div>
        
        <div className="charts-section">
          <div className="chart-card">
            <h3>📈 System Ticket Trends</h3>
            <Bar data={getWeeklyData()} options={{ responsive: true }} />
          </div>
          <div className="chart-card">
            <h3>🔄 Ticket Status Distribution</h3>
            <Doughnut data={getStatusData()} options={{ responsive: true }} />
          </div>
        </div>
        
        <div className="priority-section">
          <h3>⚠️ Priority Distribution</h3>
          <div className="priority-bars">
            <div className="priority-bar-item">
              <span>High Priority</span>
              <div className="bar-container">
                <div className="bar high-bar" style={{ width: `${(stats.highPriorityTickets / stats.totalTickets) * 100 || 0}%` }}>
                  {stats.highPriorityTickets}
                </div>
              </div>
            </div>
            <div className="priority-bar-item">
              <span>Medium Priority</span>
              <div className="bar-container">
                <div className="bar medium-bar" style={{ width: `${(stats.mediumPriorityTickets / stats.totalTickets) * 100 || 0}%` }}>
                  {stats.mediumPriorityTickets}
                </div>
              </div>
            </div>
            <div className="priority-bar-item">
              <span>Low Priority</span>
              <div className="bar-container">
                <div className="bar low-bar" style={{ width: `${(stats.lowPriorityTickets / stats.totalTickets) * 100 || 0}%` }}>
                  {stats.lowPriorityTickets}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="insight-card">
          <h3>💡 Technician Insight</h3>
          <p>There are {stats.openTickets} open tickets that need attention. {stats.inProgressTickets} tickets are currently being worked on.</p>
        </div>
      </div>
    )
  }

  // ==================== ADMIN DASHBOARD ====================
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>👑 Admin Dashboard</h2>
        <button onClick={() => {
          import('jspdf').then(({ default: jsPDF }) => {
            const doc = new jsPDF()
            doc.setFontSize(18)
            doc.text('System Statistics Report', 14, 20)
            doc.setFontSize(12)
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 35)
            doc.text(`Total Tickets: ${stats.totalTickets}`, 14, 50)
            doc.text(`Open: ${stats.openTickets} | In Progress: ${stats.inProgressTickets}`, 14, 60)
            doc.text(`Resolved: ${stats.resolvedTickets} | Closed: ${stats.closedTickets}`, 14, 70)
            doc.text(`High Priority: ${stats.highPriorityTickets} | Medium: ${stats.mediumPriorityTickets} | Low: ${stats.lowPriorityTickets}`, 14, 80)
            doc.save(`system_report_${new Date().toISOString().slice(0, 19)}.pdf`)
            addToast('System report downloaded!', 'success')
          })
        }} className="download-report-btn">
          📥 Download Full Report
        </button>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card total"><h3>Total Tickets</h3><p className="stat-number">{stats.totalTickets}</p></div>
        <div className="stat-card open"><h3>Open</h3><p className="stat-number">{stats.openTickets}</p></div>
        <div className="stat-card in-progress"><h3>In Progress</h3><p className="stat-number">{stats.inProgressTickets}</p></div>
        <div className="stat-card resolved"><h3>Resolved</h3><p className="stat-number">{stats.resolvedTickets}</p></div>
        <div className="stat-card closed"><h3>Closed</h3><p className="stat-number">{stats.closedTickets}</p></div>
        <div className="stat-card avg-time"><h3>Completion Rate</h3><p className="stat-number">{stats.totalTickets === 0 ? 0 : Math.round(((stats.resolvedTickets + stats.closedTickets) / stats.totalTickets) * 100)}%</p></div>
      </div>
      
      <div className="charts-section">
        <div className="chart-card">
          <h3>📈 Weekly Ticket Trends</h3>
          <Bar data={getWeeklyData()} options={{ responsive: true }} />
        </div>
        <div className="chart-card">
          <h3>🥧 Priority Distribution</h3>
          <Pie data={getPriorityData()} options={{ responsive: true }} />
        </div>
      </div>
      
      <div className="charts-section">
        <div className="chart-card">
          <h3>🔄 Status Distribution</h3>
          <Doughnut data={getStatusData()} options={{ responsive: true }} />
        </div>
        <div className="chart-card">
          <h3>📊 System Overview</h3>
          <div className="system-overview">
            <div className="overview-item">
              <span className="overview-label">Resolution Rate</span>
              <span className="overview-value">{stats.totalTickets === 0 ? 0 : Math.round(((stats.resolvedTickets + stats.closedTickets) / stats.totalTickets) * 100)}%</span>
            </div>
            <div className="overview-item">
              <span className="overview-label">Open Tickets</span>
              <span className="overview-value" style={{ color: '#ef4444' }}>{stats.openTickets}</span>
            </div>
            <div className="overview-item">
              <span className="overview-label">High Priority Issues</span>
              <span className="overview-value" style={{ color: '#ef4444' }}>{stats.highPriorityTickets}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="priority-section">
        <h3>⚠️ Priority Distribution</h3>
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
      
      <div className="insight-card">
        <h3>💡 Admin Insight</h3>
        <p>System health: {stats.openTickets} open tickets. High priority issues: {stats.highPriorityTickets}. Overall resolution rate: {stats.totalTickets === 0 ? 0 : Math.round(((stats.resolvedTickets + stats.closedTickets) / stats.totalTickets) * 100)}%</p>
      </div>
    </div>
  )
}

function TicketDetailModal({ ticket, onClose }) {
  if (!ticket) return null
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header"><h3>Ticket Details</h3><button className="modal-close" onClick={onClose}>×</button></div>
        <div className="modal-body">
          <p><strong>Resource:</strong> {ticket.resourceName}</p>
          <p><strong>Category:</strong> {ticket.category}</p>
          <p><strong>Description:</strong> {ticket.description}</p>
          <p><strong>Priority:</strong> {ticket.priority}</p>
          <p><strong>Status:</strong> {ticket.status}</p>
          <p><strong>Contact:</strong> {ticket.preferredContact || 'N/A'}</p>
          <p><strong>Created:</strong> {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : 'N/A'}</p>
          <p><strong>Assigned To:</strong> {ticket.assignedTechnician || 'Not Assigned'}</p>
        </div>
        <div className="modal-footer"><button onClick={onClose}>Close</button></div>
      </div>
    </div>
  )
}

// ==================== TICKET LIST ====================
function TicketList({ addToast, userRole }) {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState(null)

  useEffect(() => {
    function loadTickets() {
      setLoading(true)
      fetch('http://localhost:8081/api/tickets', { 
        headers: { 'X-User-Id': '1', 'X-User-Role': userRole } 
      })
        .then(res => res.json())
        .then(data => {
          setTickets(data || [])
          setLoading(false)
        })
        .catch(err => { 
          console.error('Error:', err)
          setLoading(false)
        })
    }
    
    loadTickets()
  }, [userRole])

  function updateStatus(id, newStatus) {
    fetch(`http://localhost:8081/api/tickets/${id}/status?status=${newStatus}`, { 
      method: 'PUT', 
      headers: { 'X-User-Id': '1' } 
    })
      .then(() => { 
        addToast(`Status updated to ${newStatus}`, 'success')
        fetch('http://localhost:8081/api/tickets', { 
          headers: { 'X-User-Id': '1', 'X-User-Role': userRole } 
        })
          .then(res => res.json())
          .then(data => setTickets(data || []))
          .catch(err => console.error('Error reloading:', err))
      })
      .catch(() => addToast('Error updating status', 'error'))
  }

  if (loading) return <div className="loading">Loading tickets...</div>

  return (
    <div className="ticket-list">
      <div className="list-header">
        <h2>My Tickets</h2>
        <ExportButtons tickets={tickets} addToast={addToast} />
      </div>
      
      <p className="results-count">Found {tickets.length} ticket(s)</p>
      
      {tickets.length === 0 ? (
        <p className="no-tickets">No tickets found. Create your first ticket!</p>
      ) : (
        tickets.map(ticket => (
          <div key={ticket.id} className="ticket-card">
            <div className="ticket-header">
              <h3>{ticket.resourceName || 'Untitled'}</h3>
              <span className={`priority-badge priority-${(ticket.priority || 'LOW').toLowerCase()}`}>
                {ticket.priority || 'LOW'}
              </span>
              {(userRole === 'ADMIN' || userRole === 'TECHNICIAN') && (
                <select 
                  value={ticket.status || 'OPEN'}
                  onChange={(e) => {
                    e.stopPropagation()
                    updateStatus(ticket.id, e.target.value)
                  }}
                  className="status-select"
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
              )}
              {userRole === 'USER' && (
                <span className={`status-badge status-${(ticket.status || 'OPEN').toLowerCase()}`}>
                  {ticket.status || 'OPEN'}
                </span>
              )}
            </div>
            <div onClick={() => setSelectedTicket(ticket)}>
              <p><strong>Category:</strong> {ticket.category || 'N/A'}</p>
              <p><strong>Description:</strong> {ticket.description || 'N/A'}</p>
              {ticket.createdAt && (
                <p><strong>Created:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
              )}
              <div className="view-details">🔍 Click for details →</div>
            </div>
          </div>
        ))
      )}
      
      {selectedTicket && (
        <TicketDetailModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
      )}
    </div>
  )
}

// ==================== TICKET FORM COMPONENT ====================
function TicketForm({ addToast }) {
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
      addToast('Maximum 3 images allowed', 'error')
      return 
    }
    setImages([...images, ...files])
  }

  const removeImage = (idx) => {
    if (window.confirm('Remove this image?')) { 
      const newImages = [...images]
      newImages.splice(idx, 1)
      setImages(newImages)
    }
  }

  const handleSubmit = (e) => {
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
    images.forEach(img => submitData.append('images', img))

    const interval = setInterval(() => {
      setUploadProgress(function(prev) {
        if (prev >= 90) {
          clearInterval(interval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    fetch('http://localhost:8081/api/tickets', { 
      method: 'POST', 
      headers: { 'X-User-Id': '1' }, 
      body: submitData 
    })
      .then(function(response) {
        clearInterval(interval)
        setUploadProgress(100)
        
        if (response.ok) {
          addToast('Ticket created successfully!', 'success')
          setTimeout(function() {
            setFormData({ resourceName: '', category: '', description: '', priority: 'MEDIUM', preferredContact: '' })
            setImages([])
            setUploadProgress(0)
            setUploading(false)
            setSubmitting(false)
          }, 500)
        } else {
          addToast('Failed to create ticket', 'error')
          setUploadProgress(0)
          setUploading(false)
          setSubmitting(false)
        }
      })
      .catch(function(error) {
        console.error('Error:', error)
        addToast('Error creating ticket', 'error')
        setUploadProgress(0)
        setUploading(false)
        setSubmitting(false)
      })
  }

  return (
    <div className="ticket-form">
      <h2>Create Incident Ticket</h2>
      <form onSubmit={handleSubmit}>
        <div><label>Resource Name:</label><input type="text" name="resourceName" value={formData.resourceName} onChange={handleChange} required /></div>
        <div><label>Category:</label>
          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="PROJECTOR">Projector</option>
            <option value="AC">AC</option>
            <option value="COMPUTER">Computer</option>
            <option value="LAB">Lab</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <div><label>Priority:</label>
          <select name="priority" value={formData.priority} onChange={handleChange}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
        <div><label>Description ({formData.description.length}/1000):</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required maxLength="1000" />
        </div>
        <div><label>Preferred Contact:</label>
          <input type="text" name="preferredContact" value={formData.preferredContact} onChange={handleChange} placeholder="Email or phone" />
        </div>
        <div><label>Images (Max 3):</label>
          <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading} />
          <div className="image-preview">
            {images.map(function(img, idx) {
              return (
                <div key={idx} className="image-item">
                  <span>📷 {img.name}</span>
                  <button type="button" onClick={() => removeImage(idx)}>✖</button>
                </div>
              )
            })}
          </div>
        </div>
        {uploading && (
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: uploadProgress + '%' }}>{uploadProgress}%</div>
            </div>
            <p className="progress-text">Uploading... {uploadProgress}%</p>
          </div>
        )}
        <button type="submit" disabled={submitting}>{submitting ? 'Creating...' : 'Create Ticket'}</button>
      </form>
    </div>
  )
}

export default App