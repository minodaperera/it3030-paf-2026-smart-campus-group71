import React, { useState } from 'react';
import axios from 'axios';

const BookingForm = () => {
    const [formData, setFormData] = useState({
        resourceId: 1, // Assuming a single resource for now (e.g., Lecture Hall 01)
        bookingDate: '',
        startTime: '',
        endTime: '',
        purpose: '',
        attendees: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Retrieve JWT token from Local Storage
            const token = localStorage.getItem('token');
            
            // Format times for Spring Boot (YYYY-MM-DDTHH:mm:ss)
            const startDateTime = `${formData.bookingDate}T${formData.startTime}:00`;
            const endDateTime = `${formData.bookingDate}T${formData.endTime}:00`;

            const bookingPayload = {
                userId: 1, // Added to fix the "User ID is required" error
                resourceId: formData.resourceId,
                bookingDate: formData.bookingDate,
                startTime: startDateTime,
                endTime: endDateTime,
                purpose: formData.purpose,
                attendees: parseInt(formData.attendees),
                status: 'PENDING' 
            };

            // Send data to backend with the token
            await axios.post('http://localhost:8080/api/bookings', bookingPayload, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            alert('Booking created successfully! Waiting for Admin approval.');
            
        } catch (error) {
            console.error('Booking failed', error);
            // Display error details if the request fails
            alert("Error: " + JSON.stringify(error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Create a New Booking</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium">Booking Date</label>
                    <input type="date" name="bookingDate" onChange={handleChange} required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
                <div className="flex space-x-4">
                    <div className="w-1/2">
                        <label className="block text-gray-700 font-medium">Start Time</label>
                        <input type="time" name="startTime" onChange={handleChange} required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    </div>
                    <div className="w-1/2">
                        <label className="block text-gray-700 font-medium">End Time</label>
                        <input type="time" name="endTime" onChange={handleChange} required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    </div>
                </div>
                <div>
                    <label className="block text-gray-700 font-medium">Purpose</label>
                    <input type="text" name="purpose" placeholder="e.g. Group Project Meeting" onChange={handleChange} required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium">Number of Attendees</label>
                    <input type="number" name="attendees" placeholder="e.g. 5" onChange={handleChange} required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200">
                    Submit Booking
                </button>
            </form>
        </div>
    );
};

export default BookingForm;