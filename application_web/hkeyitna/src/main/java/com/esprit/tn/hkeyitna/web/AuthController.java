package com.esprit.tn.hkeyitna.web;

import com.esprit.tn.hkeyitna.domain.UserAccount;
import com.esprit.tn.hkeyitna.repository.UserAccountRepository;
import com.esprit.tn.hkeyitna.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class AuthController {
    private final UserAccountRepository users;
    private final JwtUtil jwt;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthController(UserAccountRepository users, JwtUtil jwt) {
        this.users = users; this.jwt = jwt;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> body){
        String username = body.getOrDefault("username", "");
        String email = body.getOrDefault("email", "");
        String password = body.getOrDefault("password", "");
        String role = body.getOrDefault("role", "USER");
        if (username.isBlank() || email.isBlank() || password.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "username/email/password required"));
        }
        if (users.findByUsername(username).isPresent()) {
            return ResponseEntity.status(409).body(Map.of("error", "username already exists"));
        }
        UserAccount ua = new UserAccount();
        ua.setUsername(username);
        ua.setEmail(email);
        ua.setPasswordHash(encoder.encode(password));
        ua.setRole(role);
        users.save(ua);
        String token = jwt.createToken(username, Map.of("role", role, "uid", ua.getId()));
        return ResponseEntity.ok(Map.of("token", token, "username", username, "role", role));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body){
        String username = body.getOrDefault("username", "");
        String password = body.getOrDefault("password", "");
        return users.findByUsername(username)
            .filter(u -> encoder.matches(password, u.getPasswordHash()))
            .<ResponseEntity<?>>map(u -> {
                String token = jwt.createToken(u.getUsername(), Map.of("role", u.getRole(), "uid", u.getId()));
                return ResponseEntity.ok(Map.of("token", token, "username", u.getUsername(), "role", u.getRole()));
            })
            .orElse(ResponseEntity.status(401).body(Map.of("error", "invalid credentials")));
    }
}

