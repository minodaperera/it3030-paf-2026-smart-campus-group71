import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Just using some base styles if available

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('Test User');
    const [role, setRole] = useState('USER');
    const [isMockMode, setIsMockMode] = useState(false);
    const { login, mockLogin } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        let success;
        if (isMockMode) {
            success = await mockLogin(email, name, role);
        } else {
            success = await login(email, password);
        }
        
        if (success) {
            navigate('/');
        } else {
            alert('Login failed. Please check your credentials.');
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
                    
                    {!isMockMode ? (
                        <>
                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <input 
                                    type="password" 
                                    className="form-control"
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required 
                                    placeholder="Enter your password"
                                />
                            </div>
                        </>
                    ) : (
                        <>
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
                        </>
                    )}
                    
                    <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '1rem' }}>
                        {isMockMode ? 'Sign In (Development Mode)' : 'Sign In'}
                    </button>
                </form>
                
                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <button 
                        type="button" 
                        onClick={() => setIsMockMode(!isMockMode)}
                        style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.875rem' }}
                    >
                        {isMockMode ? 'Switch to Real Login' : 'Use Development Login (Mock)'}
                    </button>
                </div>
                
                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <p>Smart Campus Operations Hub Authentication</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
