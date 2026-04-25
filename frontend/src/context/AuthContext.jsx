import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // fetch user profile
            axios.get('http://localhost:8081/api/auth/me')
                .then(res => {
                    setUser(res.data);
                })
                .catch(() => {
                    logout();
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
            setLoading(false);
        }
    }, [token]);

    const login = async (email, password) => {
        try {
            const res = await axios.post('http://localhost:8081/api/auth/login', { email, password });
            setToken(res.data.token);
            setUser(res.data.user);
            return true;
        } catch (error) {
            console.error("Login failed", error);
            return false;
        }
    };

    const mockLogin = async (email, name, role = 'USER') => {
        try {
            const res = await axios.post('http://localhost:8081/api/auth/mock-login', { email, name, role });
            setToken(res.data.token);
            setUser(res.data.user);
            return true;
        } catch (error) {
            console.error("Mock Login failed", error);
            return false;
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        login,
        mockLogin,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
