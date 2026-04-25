import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import NotificationBell from './components/NotificationBell';
import Login from './pages/Login';
import './App.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  
  return (
    <div className="app-container">
      <header className="top-navbar">
        <h2 className="navbar-brand">Smart Campus Operations Hub</h2>
        <div className="navbar-actions">
          <NotificationBell />
          <div className="user-profile-display">
            <span className="user-name">{user.name}</span>
            <span className={`badge ${user.role === 'ADMIN' ? 'badge-admin' : 'badge-role'}`}>
              {user.role}
            </span>
          </div>
          <button onClick={logout} className="btn btn-danger">
            Logout
          </button>
        </div>
      </header>
      
      <main className="main-content">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Dashboard Overview</h3>
          </div>
          <p style={{ color: 'var(--text-muted)' }}>
            Welcome to the protected dashboard! You can only see this if you are logged in.
          </p>
          
          {user.role === 'ADMIN' && (
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 'var(--radius)' }}>
              <strong style={{ color: '#92400e', display: 'block', marginBottom: '0.5rem' }}>Admin Panel</strong>
              <p style={{ color: '#b45309', margin: 0, fontSize: '0.875rem' }}>
                You have ADMIN privileges. Here you can manage users, roles, and campus operations.
              </p>
            </div>
          )}
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
