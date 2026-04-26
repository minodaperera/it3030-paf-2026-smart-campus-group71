import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

     
    const fetchBookings = useCallback(async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/bookings', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setBookings(res.data);
        } catch (error) {
            console.error('Failed to fetch bookings', error);
        }
    }, [token]);

    useEffect(() => {
        if (!token || role !== 'ADMIN') {
            navigate('/');
        } else {
            fetchBookings();
        }
    }, [token, role, navigate, fetchBookings]);

     
    const updateStatus = async (id, status) => {
        try {
             
            await axios.put(`http://localhost:8080/api/bookings/${id}/status`, null, {
                params: { status: status },
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert(`Booking ${status} successfully!`);
            fetchBookings();  
        } catch (error) {
            alert("Error updating status: " + (error.response?.data?.message || error.message));
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    if (!token || role !== 'ADMIN') return null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <nav className="bg-blue-800 text-white p-4 flex justify-between items-center shadow-md">
                <h1 className="text-xl font-bold">Admin Panel - Smart Campus</h1>
                <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded transition">Logout</button>
            </nav>

            <div className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Manage Booking Requests</h2>
                
                <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr className="bg-gray-100 text-gray-600 uppercase text-xs font-bold">
                                <th className="py-3 px-6 text-left">User ID</th>
                                <th className="py-3 px-6 text-left">Date</th>
                                <th className="py-3 px-6 text-left">Purpose</th>
                                <th className="py-3 px-6 text-center">Status</th>
                                <th className="py-3 px-6 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm">
                            {bookings.length > 0 ? (
                                bookings.map((booking) => (
                                    <tr key={booking.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                                        <td className="py-4 px-6">{booking.userId}</td>
                                        <td className="py-4 px-6">{booking.bookingDate}</td>
                                        <td className="py-4 px-6">{booking.purpose}</td>
                                        <td className="py-4 px-6 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                booking.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                                                booking.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-center flex justify-center space-x-2">
                                            {booking.status === 'PENDING' && (
                                                <>
                                                    <button 
                                                        onClick={() => updateStatus(booking.id, 'APPROVED')}
                                                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button 
                                                        onClick={() => updateStatus(booking.id, 'REJECTED')}
                                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-10 text-center text-gray-500">No booking requests found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;