import React from 'react';
import { useNavigate } from 'react-router-dom';
import BookingForm from '../components/BookingForm';

const UserDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-green-600">Student Dashboard</h1>
                <button 
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                >
                    Logout
                </button>
            </div>
            
            <p className="text-gray-700 mb-6">Welcome! You can place your hall bookings below.</p>
            
            {/* Render the Booking Form here */}
            <BookingForm />
            
        </div>
    );
};

export default UserDashboard;