package com.hackathon.controller;

import com.hackathon.model.User;
import com.hackathon.repository.UserRepository;
import com.hackathon.service.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthController {
    @Autowired private UserRepository userRepo;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private MailService mailService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> body) {
        String email = body.get("email"), name = body.get("name"), password = body.get("password");
        if (userRepo.existsByEmail(email))
            return ResponseEntity.badRequest().body(Map.of("error", "Email already registered"));
        User user = userRepo.save(User.builder()
            .name(name).email(email)
            .password(passwordEncoder.encode(password))
            .role("user")
            .preferences(Map.of("theme", "light", "notifications", true))
            .build());
        mailService.sendWelcome(email, name);
        return ResponseEntity.ok(Map.of("id", user.getId(), "name", user.getName(), "email", user.getEmail(), "role", user.getRole(), "preferences", user.getPreferences()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        return userRepo.findByEmail(body.get("email"))
            .filter(u -> passwordEncoder.matches(body.get("password"), u.getPassword()))
            .map(u -> ResponseEntity.ok(Map.of("id", u.getId(), "name", u.getName(), "email", u.getEmail(), "role", u.getRole(), "preferences", u.getPreferences())))
            .orElse(ResponseEntity.status(401).body(Map.of("error", "Invalid credentials")));
    }
}
