import React from "react";
import { useState } from 'react';

function NotificationPanel() {
  const [show, setShow] = useState(false);

  return (
    <div className="notification-panel">
      <button className="notification-bell" onClick={() => setShow(!show)}>
        🔔
      </button>
      
      {show && (
        <div className="notification-dropdown">
          <h4>Notifications</h4>
          <p>No new notifications</p>
        </div>
      )}
    </div>
  );
}

export default NotificationPanel;