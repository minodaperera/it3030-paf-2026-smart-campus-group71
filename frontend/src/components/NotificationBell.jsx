import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Trash2, Check, CheckCircle2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext';

const NotificationBell = () => {
    const { token } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (token) {
            fetchNotifications();
            // Optional: Polling could be set up here if WebSockets are not used
            const interval = setInterval(fetchNotifications, 30000); // every 30s
            return () => clearInterval(interval);
        }
    }, [token]);

    const getAuthHeaders = () => ({
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const fetchNotifications = async () => {
        if (!token) return;
        try {
            const res = await axios.get('http://localhost:8081/api/notifications/me', getAuthHeaders());
            setNotifications(res.data);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    const markAsRead = async (id) => {
        try {
            await axios.patch(`http://localhost:8081/api/notifications/${id}/read`, {}, getAuthHeaders());
            setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (error) {
            console.error("Failed to mark notification as read", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.patch('http://localhost:8081/api/notifications/read-all', {}, getAuthHeaders());
            setNotifications(notifications.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error("Failed to mark all as read", error);
        }
    };

    const deleteNotification = async (id) => {
        try {
            await axios.delete(`http://localhost:8081/api/notifications/${id}`, getAuthHeaders());
            setNotifications(notifications.filter(n => n.id !== id));
        } catch (error) {
            console.error("Failed to delete notification", error);
        }
    };

    // Helper just for Demo to simulate receiving a notification
    const simulateNotification = async () => {
        try {
            await axios.post('http://localhost:8081/api/notifications/test-create', {
                type: 'SYSTEM_UPDATE',
                message: 'This is a simulated notification message'
            }, getAuthHeaders());
            fetchNotifications();
        } catch (error) {
            console.error("Simulate notification failed", error);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div style={{ position: 'relative' }}>
            <div 
                style={{ cursor: 'pointer', position: 'relative', display: 'inline-block' }}
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell size={24} />
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-5px',
                        background: 'red',
                        color: 'white',
                        borderRadius: '50%',
                        padding: '2px 6px',
                        fontSize: '10px',
                        fontWeight: 'bold'
                    }}>
                        {unreadCount}
                    </span>
                )}
            </div>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '30px',
                    right: '0',
                    width: '320px',
                    background: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    zIndex: 1000,
                    maxHeight: '400px',
                    overflowY: 'auto',
                    padding: '10px',
                    color: 'black'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
                        <h4 style={{ margin: 0 }}>Notifications</h4>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={simulateNotification} style={{ fontSize: '12px', padding: '2px 6px', cursor: 'pointer' }}>+ Test</button>
                            {unreadCount > 0 && (
                                <button 
                                    onClick={markAllAsRead}
                                    style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                                >
                                    <CheckCircle2 size={14} /> Mark all read
                                </button>
                            )}
                        </div>
                    </div>

                    {notifications.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                            No notifications yet
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {notifications.map(notif => (
                                <div key={notif.id} style={{
                                    padding: '10px',
                                    borderRadius: '6px',
                                    background: notif.read ? '#f9f9f9' : '#eff6ff',
                                    border: notif.read ? '1px solid #eee' : '1px solid #bfdbfe',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '5px'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>
                                            {notif.type.replace(/_/g, ' ')}
                                        </div>
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            {!notif.read && (
                                                <button onClick={() => markAsRead(notif.id)} title="Mark as read" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#007bff' }}>
                                                    <Check size={14} />
                                                </button>
                                            )}
                                            <button onClick={() => deleteNotification(notif.id)} title="Delete" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '14px' }}>
                                        {notif.message}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#888' }}>
                                        {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
