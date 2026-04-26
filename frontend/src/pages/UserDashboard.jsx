import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './UserDashboard.css';

const UserDashboard = () => {
    const { token, user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [resources, setResources] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    
    // Form data
    const [formData, setFormData] = useState({
        resourceId: '',
        bookingDate: '',
        startTime: '',
        endTime: '',
        purpose: '',
        attendees: 1
    });

    const fetchBookings = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get(`http://localhost:8081/api/bookings`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setBookings(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching bookings', error);
            setLoading(false);
        }
    }, [token]);

    const fetchResources = async () => {
        try {
            const res = await axios.get(`http://localhost:8081/api/resources`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setResources(res.data);
        } catch (error) {
            console.error('Error fetching resources', error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchBookings();
        }
    }, [token, fetchBookings]);

    const handleOpenModal = () => {
        fetchResources();
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({
            resourceId: '',
            bookingDate: '',
            startTime: '',
            endTime: '',
            purpose: '',
            attendees: 1
        });
    };

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.resourceId || !formData.bookingDate || !formData.startTime || !formData.endTime || !formData.purpose) {
            alert("Please fill in all required fields.");
            return;
        }

        const formattedStartTime = `${formData.bookingDate}T${formData.startTime}:00`;
        const formattedEndTime = `${formData.bookingDate}T${formData.endTime}:00`;

        if (new Date(formattedStartTime) >= new Date(formattedEndTime)) {
            alert("Start time must be strictly before end time.");
            return;
        }

        const payload = {
            resourceId: formData.resourceId,
            bookingDate: formData.bookingDate,
            startTime: formattedStartTime,
            endTime: formattedEndTime,
            purpose: formData.purpose,
            attendees: parseInt(formData.attendees) || 1
        };

        try {
            setSubmitting(true);
            await axios.post(`http://localhost:8081/api/bookings`, payload, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert("Booking created successfully!");
            handleCloseModal();
            fetchBookings();
        } catch (error) {
            alert("Failed to create booking: " + (error.response?.data?.message || error.response?.data || error.message));
        } finally {
            setSubmitting(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await axios.put(`http://localhost:8081/api/bookings/${id}/status`, null, {
                params: { status: status },
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert(`Booking ${status} successfully!`);
            fetchBookings();
        } catch (error) {
            alert("Error updating status: " + (error.response?.data?.message || error.message));
        }
    };

    if (loading) return <div style={{padding: '2rem'}}>Loading bookings...</div>;

    return (
        <div className="booking-page-wrapper">
            <div className="booking-main-content">
                <div className="booking-header">
                    <h2 className="booking-title">
                        {user?.role === 'ADMIN' ? 'Manage All Bookings' : 'My Bookings'}
                    </h2>
                    <button 
                        className="booking-primary-btn"
                        onClick={handleOpenModal}
                    >
                        + New Booking
                    </button>
                </div>

                <div className="booking-card">
                    <table className="booking-table">
                        <thead>
                            <tr>
                                {user?.role === 'ADMIN' && <th>User ID</th>}
                                <th>Date</th>
                                <th>Time</th>
                                <th>Purpose</th>
                                <th style={{textAlign: 'center'}}>Status</th>
                                {user?.role === 'ADMIN' && <th style={{textAlign: 'center'}}>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.length > 0 ? (
                                bookings.map((b) => {
                                    const st = new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                    const et = new Date(b.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                    return (
                                    <tr key={b.id}>
                                        {user?.role === 'ADMIN' && <td>{b.userId}</td>}
                                        <td>{b.bookingDate}</td>
                                        <td>{st} - {et}</td>
                                        <td>{b.purpose}</td>
                                        <td style={{textAlign: 'center'}}>
                                            <span className={`booking-status ${
                                                b.status === 'APPROVED' ? 'approved' : 
                                                b.status === 'REJECTED' ? 'rejected' : 'pending'
                                            }`}>
                                                {b.status}
                                            </span>
                                        </td>
                                        {user?.role === 'ADMIN' && (
                                            <td style={{textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '0.5rem'}}>
                                                {b.status === 'PENDING' && (
                                                    <>
                                                        <button 
                                                            onClick={() => updateStatus(b.id, 'APPROVED')}
                                                            className="booking-primary-btn"
                                                            style={{backgroundColor: '#28a745', fontSize: '0.8rem', padding: '0.4rem 0.8rem'}}
                                                        >
                                                            Approve
                                                        </button>
                                                        <button 
                                                            onClick={() => updateStatus(b.id, 'REJECTED')}
                                                            className="booking-cancel-btn"
                                                            style={{backgroundColor: '#dc3545', color: 'white', border: 'none', fontSize: '0.8rem', padding: '0.4rem 0.8rem'}}
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                )})
                            ) : (
                                <tr>
                                    <td colSpan={user?.role === 'ADMIN' ? 6 : 4} style={{padding: '3rem', textAlign: 'center', color: '#6c757d'}}>
                                        No bookings found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Create Booking Modal */}
                {showModal && (
                    <div className="booking-modal-overlay">
                        <div className="booking-modal-card">
                            <h3 className="booking-modal-title">Create New Booking</h3>
                            <form onSubmit={handleBookingSubmit}>
                                <div className="booking-form-group">
                                    <label className="booking-form-label">Resource</label>
                                    <select 
                                        name="resourceId" 
                                        value={formData.resourceId} 
                                        onChange={handleFormChange}
                                        className="booking-form-input"
                                        required
                                        disabled={resources.filter(r => r.status === 'ACTIVE').length === 0}
                                    >
                                        {resources.filter(r => r.status === 'ACTIVE').length === 0 ? (
                                            <option value="">No resources available. Please create one first.</option>
                                        ) : (
                                            <>
                                                <option value="">Select a resource</option>
                                                {resources.filter(r => r.status === 'ACTIVE').map(r => (
                                                    <option key={r.id} value={r.id}>{r.name || `Resource #${r.id}`} ({r.type})</option>
                                                ))}
                                            </>
                                        )}
                                    </select>
                                </div>
                                <div className="booking-form-group">
                                    <label className="booking-form-label">Booking Date</label>
                                    <input 
                                        type="date" 
                                        name="bookingDate" 
                                        value={formData.bookingDate} 
                                        onChange={handleFormChange}
                                        className="booking-form-input"
                                        required
                                    />
                                </div>
                                <div className="booking-form-row">
                                    <div className="booking-form-col booking-form-group">
                                        <label className="booking-form-label">Start Time</label>
                                        <input 
                                            type="time" 
                                            name="startTime" 
                                            value={formData.startTime} 
                                            onChange={handleFormChange}
                                            className="booking-form-input"
                                            required
                                        />
                                    </div>
                                    <div className="booking-form-col booking-form-group">
                                        <label className="booking-form-label">End Time</label>
                                        <input 
                                            type="time" 
                                            name="endTime" 
                                            value={formData.endTime} 
                                            onChange={handleFormChange}
                                            className="booking-form-input"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="booking-form-group">
                                    <label className="booking-form-label">Purpose</label>
                                    <input 
                                        type="text" 
                                        name="purpose" 
                                        value={formData.purpose} 
                                        onChange={handleFormChange}
                                        placeholder="e.g. Group meeting, Lab experiment"
                                        className="booking-form-input"
                                        required
                                    />
                                </div>
                                <div className="booking-form-group">
                                    <label className="booking-form-label">Attendees</label>
                                    <input 
                                        type="number" 
                                        name="attendees" 
                                        value={formData.attendees} 
                                        onChange={handleFormChange}
                                        min="1"
                                        className="booking-form-input"
                                        required
                                    />
                                </div>
                                <div className="booking-modal-actions">
                                    <button 
                                        type="button" 
                                        onClick={handleCloseModal}
                                        className="booking-cancel-btn"
                                        disabled={submitting}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="booking-primary-btn"
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Submitting...' : 'Book Now'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;