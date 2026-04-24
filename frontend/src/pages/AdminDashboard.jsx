import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    
     
    const handleLogout = () => {
        localStorage.clear();  
        navigate('/');  
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-4 text-blue-600">Admin Dashboard</h1>
            <p className="text-gray-700 mb-6">Welcome to the Safemaga Smart Campus System! Your Google Login was 100% successful.</p>
            
            <button 
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
                Logout
            </button>
        </div>
    );
};

export default AdminDashboard;