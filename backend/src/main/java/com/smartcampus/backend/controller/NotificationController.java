package com.smartcampus.backend.controller;

import com.smartcampus.backend.model.Notification;
import com.smartcampus.backend.model.User;
import com.smartcampus.backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    // 1. GET /api/notifications/me
    @GetMapping("/me")
    public ResponseEntity<List<Notification>> getMyNotifications(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        List<Notification> notifications = notificationService.getUserNotifications(user.getId());
        return ResponseEntity.ok(notifications);
    }

    // 2. PATCH /api/notifications/{id}/read
    @PatchMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id, @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            notificationService.markAsRead(id, user.getId());
            return ResponseEntity.ok(Map.of("message", "Notification marked as read"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 3. PATCH /api/notifications/read-all
    @PatchMapping("/read-all")
    public ResponseEntity<?> markAllAsRead(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        notificationService.markAllAsRead(user.getId());
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }

    // 4. DELETE /api/notifications/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable Long id, @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            notificationService.deleteNotification(id, user.getId());
            return ResponseEntity.ok(Map.of("message", "Notification deleted"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // Internal Endpoint just for Demo purposes (to test the system without waiting for external triggers)
    @PostMapping("/test-create")
    public ResponseEntity<?> testCreateNotification(@AuthenticationPrincipal User user, @RequestBody Map<String, String> payload) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        String type = payload.getOrDefault("type", "SYSTEM_UPDATE");
        String message = payload.getOrDefault("message", "Test notification message");
        Notification notif = notificationService.createNotification(user.getId(), type, message);
        return ResponseEntity.ok(notif);
    }
}
