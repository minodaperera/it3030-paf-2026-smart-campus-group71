import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Just using some base styles if available

const Login = () => {
    const [email, setEmail] = useState('test@smartcampus.com');
    const [name, setName] = useState('Test User');
    const [role, setRole] = useState('USER');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const success = await login(email, name, role);
        if (success) {
            navigate('/');
        } else {
            alert('Login failed');
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-card">
                <div className="login-header">
                    <h2>Smart Campus Hub</h2>
                    <p>Sign in to access your operations dashboard</p>
                </div>
                
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input 
                            type="email" 
                            className="form-control"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            placeholder="Enter your email"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input 
                            type="text" 
                            className="form-control"
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                            placeholder="Enter your name"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">System Role</label>
                        <select 
                            className="form-control"
                            value={role} 
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="USER">Standard User</option>
                            <option value="ADMIN">System Administrator</option>
                            <option value="TECHNICIAN">Campus Technician</option>
                        </select>
                    </div>
                    
                    <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '1rem' }}>
                        Sign In (Development Mode)
                    </button>
                </form>
                
                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <p>Note: This is a mock authentication interface.</p>
                    <p>In production, this will redirect to Google OAuth.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
