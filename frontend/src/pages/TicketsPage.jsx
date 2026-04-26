import React from "react";
import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import "../App.css";
import NotificationPanel from "../components/NotificationPanel";
import { ToastContainer } from "../components/Toast";
import ExportButtons from "../components/ExportButtons";
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

export default function TicketsPage() {
  const [activeTab, setActiveTab] = useState('tickets')
  const [ticketCount, setTicketCount] = useState(0)
  const [toasts, setToasts] = useState([])
  const [darkMode, setDarkMode] = useState(false)
  const { user, token } = useAuth();

  // Fixed addToast function
  const addToast = useCallback((message, type) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, 3000)
  }, [])

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const switchRole = (newRole) => {
    setUser({ ...user, role: newRole })
    addToast(`Switched to ${newRole} role`, 'success')
  }

  useEffect(() => {
    fetch('http://localhost:8081/api/tickets', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
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
  }, [addToast])

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

// ==================== DASHBOARD ====================
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
  const [allTickets, setAllTickets] = useState([])
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' })
  const [filteredStats, setFilteredStats] = useState(null)
  const [showDateFilter, setShowDateFilter] = useState(false)

  const generateWeeklyTrends = (tickets) => {
    const trends = [0, 0, 0, 0, 0, 0, 0]
    tickets.forEach(ticket => {
      if (ticket.createdAt) {
        const date = new Date(ticket.createdAt)
        const dayOfWeek = date.getDay()
        trends[dayOfWeek]++
      }
    })
    return [...trends.slice(1), trends[0]]
  }

  const filterTicketsByDateRange = (tickets, startDate, endDate) => {
    if (!startDate && !endDate) return tickets
    return tickets.filter(ticket => {
      if (!ticket.createdAt) return false
      const ticketDate = new Date(ticket.createdAt).toISOString().split('T')[0]
      if (startDate && endDate) {
        return ticketDate >= startDate && ticketDate <= endDate
      } else if (startDate) {
        return ticketDate >= startDate
      } else if (endDate) {
        return ticketDate <= endDate
      }
      return true
    })
  }

  const applyDateFilter = () => {
    if (!dateRange.startDate && !dateRange.endDate) {
      addToast('Please select a date range', 'error')
      return
    }
    
    const filtered = filterTicketsByDateRange(allTickets, dateRange.startDate, dateRange.endDate)
    
    const openTickets = filtered.filter(t => t.status === 'OPEN').length
    const inProgressTickets = filtered.filter(t => t.status === 'IN_PROGRESS').length
    const resolvedTickets = filtered.filter(t => t.status === 'RESOLVED').length
    const closedTickets = filtered.filter(t => t.status === 'CLOSED').length
    const highPriorityTickets = filtered.filter(t => t.priority === 'HIGH').length
    const mediumPriorityTickets = filtered.filter(t => t.priority === 'MEDIUM').length
    const lowPriorityTickets = filtered.filter(t => t.priority === 'LOW').length
    
    const myTickets = filtered.filter(t => t.userId === userId)
    const myOpenTickets = myTickets.filter(t => t.status === 'OPEN').length
    const myResolvedTickets = myTickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length
    
    const weeklyTrends = generateWeeklyTrends(filtered)
    const myWeeklyTrends = generateWeeklyTrends(myTickets)
    
    setFilteredStats({
      totalTickets: filtered.length,
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
      weeklyTrends,
      myWeeklyTrends
    })
    
    setShowDateFilter(false)
    addToast(`Showing reports from ${dateRange.startDate || 'start'} to ${dateRange.endDate || 'today'}`, 'success')
  }

  const resetDateFilter = () => {
    setDateRange({ startDate: '', endDate: '' })
    setFilteredStats(null)
    addToast('Date filter cleared - showing all data', 'success')
  }

  const currentStats = filteredStats || stats

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://localhost:8081/api/tickets', { 
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } 
        })
        const tickets = await response.json()
        setAllTickets(tickets)
        
        const myTickets = tickets.filter(t => t.userId === userId)
        const myOpenTickets = myTickets.filter(t => t.status === 'OPEN').length
        const myResolvedTickets = myTickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length
        
        const openTickets = tickets.filter(t => t.status === 'OPEN').length
        const inProgressTickets = tickets.filter(t => t.status === 'IN_PROGRESS').length
        const resolvedTickets = tickets.filter(t => t.status === 'RESOLVED').length
        const closedTickets = tickets.filter(t => t.status === 'CLOSED').length
        const highPriorityTickets = tickets.filter(t => t.priority === 'HIGH').length
        const mediumPriorityTickets = tickets.filter(t => t.priority === 'MEDIUM').length
        const lowPriorityTickets = tickets.filter(t => t.priority === 'LOW').length
        
        const weeklyTrends = generateWeeklyTrends(tickets)
        const myWeeklyTrends = generateWeeklyTrends(myTickets)
        
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
          weeklyTrends,
          myWeeklyTrends
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
        datasets: [{ label: 'My Tickets Created', data: currentStats.myWeeklyTrends, backgroundColor: 'rgba(54, 162, 235, 0.6)' }]
      }
    }
    return {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{ label: 'All Tickets Created', data: currentStats.weeklyTrends, backgroundColor: 'rgba(54, 162, 235, 0.6)' }]
    }
  }

  const getPriorityData = () => ({
    labels: ['High', 'Medium', 'Low'],
    datasets: [{ data: [currentStats.highPriorityTickets, currentStats.mediumPriorityTickets, currentStats.lowPriorityTickets], backgroundColor: ['#ef4444', '#f59e0b', '#10b981'] }]
  })

  const getStatusData = () => ({
    labels: ['Open', 'In Progress', 'Resolved', 'Closed'],
    datasets: [{ data: [currentStats.openTickets, currentStats.inProgressTickets, currentStats.resolvedTickets, currentStats.closedTickets], backgroundColor: ['#3b82f6', '#f59e0b', '#10b981', '#64748b'] }]
  })

  const getMyStatusData = () => ({
    labels: ['Open', 'Resolved'],
    datasets: [{ data: [currentStats.myOpenTickets, currentStats.myResolvedTickets], backgroundColor: ['#3b82f6', '#10b981'] }]
  })

  if (loading) return <div className="loading">Loading dashboard...</div>

  if (userRole === 'USER') {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h2>📊 My Personal Dashboard</h2>
          <div className="dashboard-actions">
            <button onClick={() => setShowDateFilter(!showDateFilter)} className="date-filter-btn">📅 Date Range</button>
            {filteredStats && <button onClick={resetDateFilter} className="reset-filter-btn">🔄 Reset Filter</button>}
            <div className="role-badge user-badge">👤 User View</div>
          </div>
        </div>
        
        {showDateFilter && (
          <div className="date-range-modal">
            <div className="date-range-content">
              <h3>Select Date Range</h3>
              <div className="date-range-inputs">
                <div><label>Start Date</label><input type="date" value={dateRange.startDate} onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})} /></div>
                <div><label>End Date</label><input type="date" value={dateRange.endDate} onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})} /></div>
              </div>
              <div className="quick-filters">
                <button onClick={() => { const today = new Date().toISOString().split('T')[0]; setDateRange({ startDate: today, endDate: today }) }}>Today</button>
                <button onClick={() => { const today = new Date().toISOString().split('T')[0]; const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; setDateRange({ startDate: weekAgo, endDate: today }) }}>Last 7 Days</button>
                <button onClick={() => { const today = new Date().toISOString().split('T')[0]; const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; setDateRange({ startDate: monthAgo, endDate: today }) }}>Last 30 Days</button>
              </div>
              <div className="date-range-actions">
                <button onClick={applyDateFilter} className="apply-btn">Apply Filter</button>
                <button onClick={() => setShowDateFilter(false)} className="cancel-btn">Cancel</button>
              </div>
            </div>
          </div>
        )}
        
        {filteredStats && <div className="filter-info">📅 Showing data from {dateRange.startDate || 'start'} to {dateRange.endDate || 'today'}</div>}
        
        <div className="stats-grid">
          <div className="stat-card total"><h3>My Total Tickets</h3><p className="stat-number">{currentStats.myTickets}</p></div>
          <div className="stat-card open"><h3>Open Tickets</h3><p className="stat-number">{currentStats.myOpenTickets}</p></div>
          <div className="stat-card resolved"><h3>Resolved Tickets</h3><p className="stat-number">{currentStats.myResolvedTickets}</p></div>
          <div className="stat-card avg-time"><h3>Resolution Rate</h3><p className="stat-number">{currentStats.myTickets === 0 ? 0 : Math.round((currentStats.myResolvedTickets / currentStats.myTickets) * 100)}%</p></div>
        </div>
        
        <div className="charts-section">
          <div className="chart-card"><h3>📈 My Ticket Activity</h3><Bar data={getWeeklyData()} options={{ responsive: true }} /></div>
          <div className="chart-card"><h3>🥧 My Ticket Status</h3><Pie data={getMyStatusData()} options={{ responsive: true }} /></div>
        </div>
        
        <div className="insight-card"><h3>💡 Personal Insight</h3><p>You have {currentStats.myOpenTickets} open ticket(s). {currentStats.myResolvedTickets} ticket(s) resolved!</p></div>
      </div>
    )
  }

  if (userRole === 'TECHNICIAN') {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h2>🔧 Technician Dashboard</h2>
          <div className="dashboard-actions">
            <button onClick={() => setShowDateFilter(!showDateFilter)} className="date-filter-btn">📅 Date Range</button>
            {filteredStats && <button onClick={resetDateFilter} className="reset-filter-btn">🔄 Reset Filter</button>}
            <div className="role-badge technician-badge">👨‍🔧 Technician View</div>
          </div>
        </div>
        
        {showDateFilter && (
          <div className="date-range-modal">
            <div className="date-range-content">
              <h3>Select Date Range</h3>
              <div className="date-range-inputs">
                <div><label>Start Date</label><input type="date" value={dateRange.startDate} onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})} /></div>
                <div><label>End Date</label><input type="date" value={dateRange.endDate} onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})} /></div>
              </div>
              <div className="quick-filters">
                <button onClick={() => { const today = new Date().toISOString().split('T')[0]; setDateRange({ startDate: today, endDate: today }) }}>Today</button>
                <button onClick={() => { const today = new Date().toISOString().split('T')[0]; const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; setDateRange({ startDate: weekAgo, endDate: today }) }}>Last 7 Days</button>
                <button onClick={() => { const today = new Date().toISOString().split('T')[0]; const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; setDateRange({ startDate: monthAgo, endDate: today }) }}>Last 30 Days</button>
              </div>
              <div className="date-range-actions">
                <button onClick={applyDateFilter} className="apply-btn">Apply Filter</button>
                <button onClick={() => setShowDateFilter(false)} className="cancel-btn">Cancel</button>
              </div>
            </div>
          </div>
        )}
        
        {filteredStats && <div className="filter-info">📅 Showing data from {dateRange.startDate || 'start'} to {dateRange.endDate || 'today'}</div>}
        
        <div className="stats-grid">
          <div className="stat-card total"><h3>Total Tickets</h3><p className="stat-number">{currentStats.totalTickets}</p></div>
          <div className="stat-card open"><h3>Open</h3><p className="stat-number">{currentStats.openTickets}</p></div>
          <div className="stat-card in-progress"><h3>In Progress</h3><p className="stat-number">{currentStats.inProgressTickets}</p></div>
          <div className="stat-card resolved"><h3>Resolved</h3><p className="stat-number">{currentStats.resolvedTickets}</p></div>
          <div className="stat-card closed"><h3>Closed</h3><p className="stat-number">{currentStats.closedTickets}</p></div>
          <div className="stat-card avg-time"><h3>Pending</h3><p className="stat-number">{currentStats.openTickets + currentStats.inProgressTickets}</p></div>
        </div>
        
        <div className="charts-section">
          <div className="chart-card"><h3>📈 Ticket Trends</h3><Bar data={getWeeklyData()} options={{ responsive: true }} /></div>
          <div className="chart-card"><h3>🔄 Status Distribution</h3><Doughnut data={getStatusData()} options={{ responsive: true }} /></div>
        </div>
        
        <div className="insight-card"><h3>💡 Technician Insight</h3><p>There are {currentStats.openTickets} open tickets. {currentStats.inProgressTickets} in progress.</p></div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>👑 Admin Dashboard</h2>
        <div className="dashboard-actions">
          <button onClick={() => setShowDateFilter(!showDateFilter)} className="date-filter-btn">📅 Date Range</button>
          {filteredStats && <button onClick={resetDateFilter} className="reset-filter-btn">🔄 Reset Filter</button>}
          <button onClick={() => {
            import('jspdf').then(({ default: jsPDF }) => {
              const doc = new jsPDF()
              doc.setFontSize(18)
              doc.text('System Statistics Report', 14, 20)
              doc.setFontSize(12)
              doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 35)
              doc.text(`Total Tickets: ${currentStats.totalTickets}`, 14, 50)
              doc.text(`Open: ${currentStats.openTickets} | In Progress: ${currentStats.inProgressTickets}`, 14, 60)
              doc.text(`Resolved: ${currentStats.resolvedTickets} | Closed: ${currentStats.closedTickets}`, 14, 70)
              doc.text(`High Priority: ${currentStats.highPriorityTickets} | Medium: ${currentStats.mediumPriorityTickets} | Low: ${currentStats.lowPriorityTickets}`, 14, 80)
              doc.save(`system_report_${new Date().toISOString().slice(0, 19)}.pdf`)
              addToast('System report downloaded!', 'success')
            })
          }} className="download-report-btn">📥 Download Report</button>
          <div className="role-badge admin-badge">👑 Admin View</div>
        </div>
      </div>
      
      {showDateFilter && (
        <div className="date-range-modal">
          <div className="date-range-content">
            <h3>Select Date Range</h3>
            <div className="date-range-inputs">
              <div><label>Start Date</label><input type="date" value={dateRange.startDate} onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})} /></div>
              <div><label>End Date</label><input type="date" value={dateRange.endDate} onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})} /></div>
            </div>
            <div className="quick-filters">
              <button onClick={() => { const today = new Date().toISOString().split('T')[0]; setDateRange({ startDate: today, endDate: today }) }}>Today</button>
              <button onClick={() => { const today = new Date().toISOString().split('T')[0]; const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; setDateRange({ startDate: weekAgo, endDate: today }) }}>Last 7 Days</button>
              <button onClick={() => { const today = new Date().toISOString().split('T')[0]; const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; setDateRange({ startDate: monthAgo, endDate: today }) }}>Last 30 Days</button>
            </div>
            <div className="date-range-actions">
              <button onClick={applyDateFilter} className="apply-btn">Apply Filter</button>
              <button onClick={() => setShowDateFilter(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
      
      {filteredStats && <div className="filter-info">📅 Showing data from {dateRange.startDate || 'start'} to {dateRange.endDate || 'today'}</div>}
      
      <div className="stats-grid">
        <div className="stat-card total"><h3>Total</h3><p className="stat-number">{currentStats.totalTickets}</p></div>
        <div className="stat-card open"><h3>Open</h3><p className="stat-number">{currentStats.openTickets}</p></div>
        <div className="stat-card in-progress"><h3>In Progress</h3><p className="stat-number">{currentStats.inProgressTickets}</p></div>
        <div className="stat-card resolved"><h3>Resolved</h3><p className="stat-number">{currentStats.resolvedTickets}</p></div>
        <div className="stat-card closed"><h3>Closed</h3><p className="stat-number">{currentStats.closedTickets}</p></div>
        <div className="stat-card avg-time"><h3>Completion</h3><p className="stat-number">{currentStats.totalTickets === 0 ? 0 : Math.round(((currentStats.resolvedTickets + currentStats.closedTickets) / currentStats.totalTickets) * 100)}%</p></div>
      </div>
      
      <div className="charts-section">
        <div className="chart-card"><h3>📈 Weekly Trends</h3><Bar data={getWeeklyData()} options={{ responsive: true }} /></div>
        <div className="chart-card"><h3>🥧 Priority</h3><Pie data={getPriorityData()} options={{ responsive: true }} /></div>
      </div>
      
      <div className="insight-card"><h3>💡 Admin Insight</h3><p>System health: {currentStats.openTickets} open tickets. High priority: {currentStats.highPriorityTickets}. Resolution rate: {currentStats.totalTickets === 0 ? 0 : Math.round(((currentStats.resolvedTickets + currentStats.closedTickets) / currentStats.totalTickets) * 100)}%</p></div>
    </div>
  )
}

function TicketDetailModal({ ticket, onClose }) {
  if (!ticket) return null
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header"><h3>📋 Ticket Details</h3><button className="modal-close" onClick={onClose}>×</button></div>
        <div className="modal-body">
          <p><strong>Resource:</strong> {ticket.resourceName}</p>
          <p><strong>Category:</strong> {ticket.category}</p>
          <p><strong>Description:</strong> {ticket.description}</p>
          <p><strong>Priority:</strong> <span className={`priority-badge priority-${(ticket.priority || 'LOW').toLowerCase()}`}>{ticket.priority || 'LOW'}</span></p>
          <p><strong>Status:</strong> <span className={`status-badge status-${(ticket.status || 'OPEN').toLowerCase()}`}>{ticket.status || 'OPEN'}</span></p>
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
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } 
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
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } 
    })
      .then(() => { 
        addToast(`Status updated to ${newStatus}`, 'success')
        fetch('http://localhost:8081/api/tickets', { 
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } 
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
              {(userRole === 'ADMIN' || userRole === 'TECHNICIAN') ? (
                <select 
                  value={ticket.status || 'OPEN'}
                  onChange={(e) => {
                    e.stopPropagation()
                    updateStatus(ticket.id, e.target.value)
                  }}
                  className="status-select"
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="OPEN">🟢 Open</option>
                  <option value="IN_PROGRESS">🟠 In Progress</option>
                  <option value="RESOLVED">✅ Resolved</option>
                  <option value="CLOSED">🔒 Closed</option>
                </select>
              ) : (
                <span className={`status-badge status-${(ticket.status || 'OPEN').toLowerCase()}`}>
                  {ticket.status || 'OPEN'}
                </span>
              )}
            </div>
            <div 
              className="ticket-card-content"
              onClick={() => setSelectedTicket(ticket)}
              style={{ cursor: 'pointer' }}
            >
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

// ==================== TICKET FORM ====================
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
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }, 
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
            <option value="">-- Select --</option>
            <option value="PROJECTOR">📽️ Projector</option>
            <option value="AC">❄️ AC</option>
            <option value="COMPUTER">💻 Computer</option>
            <option value="LAB">🔬 Lab</option>
            <option value="OTHER">📦 Other</option>
          </select>
        </div>
        <div><label>Priority:</label>
          <select name="priority" value={formData.priority} onChange={handleChange}>
            <option value="LOW">🟢 Low</option>
            <option value="MEDIUM">🟡 Medium</option>
            <option value="HIGH">🔴 High</option>
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
        <button type="submit" disabled={submitting}>{submitting ? 'Creating...' : '✅ Create Ticket'}</button>
      </form>
    </div>
  )
}

