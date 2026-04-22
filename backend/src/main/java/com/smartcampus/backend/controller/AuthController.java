package com.smartcampus.backend.controller;

import com.smartcampus.backend.model.User;
import com.smartcampus.backend.repository.UserRepository;
import com.smartcampus.backend.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider tokenProvider;

    // A mock login endpoint to bypass real OAuth during local testing
    @PostMapping("/mock-login")
    public ResponseEntity<?> mockLogin(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String role = payload.getOrDefault("role", "USER");
        String name = payload.getOrDefault("name", "Test User");

        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }

        // Find or create user
        Optional<User> userOpt = userRepository.findByEmail(email);
        User user;
        if (userOpt.isPresent()) {
            user = userOpt.get();
            // Optional: update role for testing purposes if requested
            if (!user.getRole().equals(role)) {
                user.setRole(role);
                userRepository.save(user);
            }
        } else {
            user = new User();
            user.setEmail(email);
            user.setFullName(name);
            user.setRole(role);
            user.setOauthProvider("mock");
            user = userRepository.save(user);
        }

        String token = tokenProvider.generateTokenFromEmail(user.getEmail());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", Map.of(
            "id", user.getId(),
            "email", user.getEmail(),
            "name", user.getFullName(),
            "role", user.getRole()
        ));

        return ResponseEntity.ok(response);
    }

    // Placeholder for future real OAuth flow endpoint (e.g., getting user info after redirect)
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        
        String token = authHeader.substring(7);
        if (tokenProvider.validateToken(token)) {
            String email = tokenProvider.getUserEmailFromJWT(token);
            User user = userRepository.findByEmail(email).orElse(null);
            if (user != null) {
                return ResponseEntity.ok(Map.of(
                    "id", user.getId(),
                    "email", user.getEmail(),
                    "name", user.getFullName(),
                    "role", user.getRole()
                ));
            }
        }
        
        return ResponseEntity.status(401).body(Map.of("error", "Invalid token"));
    }
}
