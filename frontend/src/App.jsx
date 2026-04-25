import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import NotificationBell from './components/NotificationBell';
import Login from './pages/Login';
import { User as UserIcon } from 'lucide-react';
import axios from 'axios';
import './App.css';

const Dashboard = () => {
  const { user, token, logout } = useAuth();

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${token}` }
  });

  const handleMarkAllRead = async () => {
    if (!token) return;
    try {
      await axios.patch('http://localhost:8081/api/notifications/read-all', {}, getAuthHeaders());
      window.dispatchEvent(new Event('refreshNotifications'));
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  const handleCreateTestNotification = async () => {
    if (!token) return;
    try {
      await axios.post('http://localhost:8081/api/notifications/test-create', {
        type: 'SYSTEM_UPDATE',
        message: 'Test notification from Dashboard Quick Actions'
      }, getAuthHeaders());
      window.dispatchEvent(new Event('refreshNotifications'));
    } catch (err) {
      console.error("Failed to create test notification", err);
    }
  };

  const handleRefresh = () => {
    window.dispatchEvent(new Event('refreshNotifications'));
  };
  
  return (
    <div className="app-container">
      {/* Top Navbar */}
      <header className="top-navbar">
        <div className="navbar-brand-container">
          <h2 className="navbar-brand">Smart Campus Operations Hub</h2>
          <span className="navbar-subtitle">Auth & Notifications Module</span>
        </div>
        <div className="navbar-actions">
          <NotificationBell />
          <div className="user-profile-display">
            <span className="user-name">{user.name}</span>
            <span className={`badge ${user.role === 'ADMIN' ? 'badge-admin' : 'badge-role'}`}>
              {user.role}
            </span>
          </div>
          <button onClick={logout} className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
            Logout
          </button>
        </div>
      </header>
      
      {/* Tab Menu */}
      <nav className="tab-bar">
        <div className="tab-item active">
          Dashboard
        </div>
        <div className="tab-item">
          Notifications
        </div>
        <div className="tab-item">
          Profile
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-header">
          <h3 className="content-title">Dashboard Overview</h3>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          
          <div className="inner-card">
            <h4 className="inner-card-title">User Overview</h4>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Welcome back to the secure dashboard.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <div><strong>Name:</strong> {user.name}</div>
              <div><strong>Email:</strong> {user.email || 'N/A'}</div>
              <div><strong>Role:</strong> <span className={`badge ${user.role === 'ADMIN' ? 'badge-admin' : 'badge-role'}`}>{user.role}</span></div>
            </div>
            
            {user.role === 'ADMIN' && (
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 'var(--radius)' }}>
                <strong style={{ color: '#92400e', display: 'block', marginBottom: '0.25rem' }}>Admin Notice</strong>
                <p style={{ color: '#b45309', margin: 0, fontSize: '0.875rem' }}>
                  You have administrative privileges over this module.
                </p>
              </div>
            )}
          </div>

          <div className="inner-card">
            <h4 className="inner-card-title">Notifications Preview</h4>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Check the bell icon in the navigation bar to see your latest unread alerts.
            </p>
            <button className="btn btn-primary" onClick={handleMarkAllRead}>Mark all read</button>
          </div>

          <div className="inner-card">
            <h4 className="inner-card-title">Quick Actions</h4>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Trigger events to verify the real-time notification system is working.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-primary" onClick={handleCreateTestNotification}>Create Test Notification</button>
              <button className="btn btn-icon" onClick={handleRefresh} title="Refresh Dashboard">Refresh</button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

const Unauthorized = () => {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h2>403 - Unauthorized</h2>
      <p>You do not have permission to view this page.</p>
      <button onClick={() => navigate('/')}>Go Home</button>
    </div>
  );
}

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      {/* Example of Role-Based Route */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <Dashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;
