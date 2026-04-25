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
            
            // Allow external components to trigger a refresh
            const handleRefresh = () => fetchNotifications();
            window.addEventListener('refreshNotifications', handleRefresh);
            
            return () => {
                clearInterval(interval);
                window.removeEventListener('refreshNotifications', handleRefresh);
            };
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
        if (!token) return;
        try {
            await axios.patch(`http://localhost:8081/api/notifications/${id}/read`, {}, getAuthHeaders());
            setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (error) {
            console.error("Failed to mark notification as read", error);
        }
    };

    const markAllAsRead = async () => {
        if (!token) return;
        try {
            await axios.patch('http://localhost:8081/api/notifications/read-all', {}, getAuthHeaders());
            setNotifications(notifications.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error("Failed to mark all as read", error);
        }
    };

    const deleteNotification = async (id) => {
        if (!token) return;
        try {
            await axios.delete(`http://localhost:8081/api/notifications/${id}`, getAuthHeaders());
            setNotifications(notifications.filter(n => n.id !== id));
        } catch (error) {
            console.error("Failed to delete notification", error);
        }
    };

    // Helper just for Demo to simulate receiving a notification
    const simulateNotification = async () => {
        if (!token) return;
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
                className="notification-trigger"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="notification-badge">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </div>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="dropdown-header">
                        <h4>Notifications</h4>
                        <div className="dropdown-actions">
                            <button onClick={simulateNotification} title="Simulate a new notification">+ Test</button>
                            {unreadCount > 0 && (
                                <button onClick={markAllAsRead} title="Mark all as read">
                                    <CheckCircle2 size={14} /> Mark all read
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="dropdown-body">
                        {notifications.length === 0 ? (
                            <div className="empty-state">
                                No notifications yet
                            </div>
                        ) : (
                            <div>
                                {notifications.map(notif => (
                                    <div key={notif.id} className={`notification-item ${!notif.read ? 'unread' : ''}`}>
                                        <div className="notification-header">
                                            <div className="notification-type">
                                                {notif.type.replace(/_/g, ' ')}
                                            </div>
                                            <div className="notification-actions">
                                                {!notif.read && (
                                                    <button className="btn-icon text-primary" onClick={() => markAsRead(notif.id)} title="Mark as read">
                                                        <Check size={14} />
                                                    </button>
                                                )}
                                                <button className="btn-icon text-danger" onClick={() => deleteNotification(notif.id)} title="Delete">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="notification-message">
                                            {notif.message}
                                        </div>
                                        <div className="notification-time">
                                            {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
