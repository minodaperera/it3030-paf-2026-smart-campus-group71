import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const res = await axios.post('http://localhost:8080/api/auth/google', {
                token: credentialResponse.credential
            });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role);
            localStorage.setItem('email', res.data.email);

            // Navigate based on the user's role
            if (res.data.role === 'ADMIN') {
                navigate('/admin-dashboard');
            } else {
                navigate('/user-dashboard');
            }
            
        } catch (error) {
            console.error('Authentication Failed', error);
            alert('Login Failed! Please check your backend connection.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-md text-center border border-gray-200">
                <h2 className="text-2xl font-bold mb-2 text-blue-600">Smart Campus Booking</h2>
                <p className="text-gray-600 mb-8">Please sign in with your Google account</p>
                
                <div className="flex justify-center">
                    <GoogleLogin 
                        onSuccess={handleGoogleSuccess} 
                        onError={() => console.log('Login Failed')} 
                        prompt="select_account" // This forces the account selection popup!
                    />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;