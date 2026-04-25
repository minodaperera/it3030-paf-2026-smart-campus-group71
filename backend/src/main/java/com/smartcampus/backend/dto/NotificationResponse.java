package com.smartcampus.backend.dto;

import com.smartcampus.backend.model.Notification;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificationResponse {
    private Long id;
    private String type;
    private String message;
    private boolean read;
    private LocalDateTime createdAt;
    private Long userId; // Minimal user info

    public static NotificationResponse fromEntity(Notification notification) {
        NotificationResponse response = new NotificationResponse();
        response.setId(notification.getId());
        response.setType(notification.getType());
        response.setMessage(notification.getMessage());
        response.setRead(notification.isRead());
        response.setCreatedAt(notification.getCreatedAt());
        if (notification.getUser() != null) {
            response.setUserId(notification.getUser().getId());
        }
        return response;
    }
}
