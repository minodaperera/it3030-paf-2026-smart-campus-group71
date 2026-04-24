package smartcampus.auth;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// Ensure these imports match your project structure
import smartcampus.model.User; 
import smartcampus.repository.UserRepository;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") 
public class GoogleAuthController {

    @Value("${google.client.id}")
    private String googleClientId;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/google")
    public ResponseEntity<?> authenticateWithGoogle(@RequestBody Map<String, String> body) {
        String idTokenString = body.get("token"); 
        
        try {
            // Configure the Google ID Token Verifier
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            // Verify the token received from the Frontend
            GoogleIdToken idToken = verifier.verify(idTokenString);
            
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                String email = payload.getEmail();
                String fullName = (String) payload.get("name");

                // 1. Assign Role based on email
                String role = email.equals("bashithadilhara89@gmail.com") ? "ADMIN" : "USER";

                // 2. Check if user exists in database; if not, create and save a new user
                // This ensures we always have a valid Database ID to return
                User user = userRepository.findByEmail(email).orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setName(fullName);
                    newUser.setRole(role);
                    return userRepository.save(newUser);
                });

                // 3. Generate a JWT Token for the authenticated session
                String jwt = jwtUtil.generateToken(email, role);

                // 4. Construct the response payload
                Map<String, Object> response = new HashMap<>(); 
                response.put("token", jwt);
                response.put("email", email);
                response.put("role", role);
                response.put("userId", user.getId()); // Return the auto-generated Database User ID

                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Google Token");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Authentication Failed: " + e.getMessage());
        }
    }
}