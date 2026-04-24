package smartcampus.auth;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    
    @Value("${jwt.secret}")
    private String secret;

     
    private final long EXPIRATION_TIME = 86400000; 

    private Key getSigningKey() {
        byte[] keyBytes = secret.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }

     
    public String generateToken(String email, String role) {
        return Jwts.builder()
                .setSubject(email)                
                .claim("role", role)              
                .setIssuedAt(new Date())          
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))  
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)  
                .compact();
    }
}