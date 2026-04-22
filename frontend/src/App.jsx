import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import NotificationBell from './components/NotificationBell';
import Login from './pages/Login';
import './App.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  
  return (
    <div style={{ padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>Smart Campus Operations Hub</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <NotificationBell />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontWeight: 'bold' }}>{user.name}</span>
            <span style={{ fontSize: '12px', background: '#eee', padding: '2px 6px', borderRadius: '4px' }}>{user.role}</span>
          </div>
          <button onClick={logout} style={{ padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </header>
      
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', minHeight: '300px' }}>
        <h3>Dashboard Overview</h3>
        <p>Welcome to the protected dashboard! You can only see this if you are logged in.</p>
        {user.role === 'ADMIN' && (
          <div style={{ marginTop: '20px', padding: '15px', background: '#fff3cd', border: '1px solid #ffeeba', borderRadius: '4px' }}>
            <strong>Admin Panel</strong>
            <p>You have ADMIN privileges. Here you can manage users, roles, and campus operations.</p>
          </div>
        )}
      </div>
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
