package com.smartcampus.backend.controller;

import com.smartcampus.backend.model.User;
import com.smartcampus.backend.repository.UserRepository;
import com.smartcampus.backend.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import com.smartcampus.backend.dto.AuthResponse;
import com.smartcampus.backend.dto.LoginRequest;
import com.smartcampus.backend.security.UserDetailsImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import com.smartcampus.backend.dto.RegisterRequest;

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

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
        }

        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setFullName(registerRequest.getName());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(registerRequest.getRole() != null ? registerRequest.getRole() : "USER");
        
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    // A real login endpoint using Spring Security AuthenticationManager
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userDetails.getUser();

        String token = tokenProvider.generateToken(authentication);

        Map<String, Object> userInfo = Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "name", user.getFullName(),
                "role", user.getRole()
        );

        return ResponseEntity.ok(new AuthResponse(token, userInfo));
    }

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

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        User user = userDetails.getUser();
        return ResponseEntity.ok(Map.of(
            "id", user.getId(),
            "email", user.getEmail(),
            "name", user.getFullName(),
            "role", user.getRole()
        ));
    }
}
