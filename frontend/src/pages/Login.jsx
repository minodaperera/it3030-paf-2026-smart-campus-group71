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
        <div className="login-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
            <h2>Welcome to Smart Campus</h2>
            <p>This is a local development mock login to bypass real OAuth</p>
            
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '300px' }}>
                <div>
                    <label>Email:</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div>
                    <label>Name:</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div>
                    <label>Role:</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%', padding: '8px' }}>
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="TECHNICIAN">TECHNICIAN</option>
                    </select>
                </div>
                
                <button type="submit" style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Login (Mock OAuth)
                </button>
            </form>
            
            <div style={{ marginTop: '20px', fontSize: '12px', color: 'gray' }}>
                Note: In production, this form will be replaced with standard Google OAuth Redirects.
            </div>
        </div>
    );
};

export default Login;
