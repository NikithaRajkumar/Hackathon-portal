package com.hackathon.controller;

import com.hackathon.model.User;
import com.hackathon.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired private UserRepository userRepo;

    @GetMapping
    public List<User> getAll() { return userRepo.findAll(); }

    @DeleteMapping("/{id}")
    public Map<String, Boolean> delete(@PathVariable Long id) {
        userRepo.findById(id).filter(u -> !u.getRole().equals("admin")).ifPresent(userRepo::delete);
        return Map.of("success", true);
    }

    @PatchMapping("/{id}/preferences")
    public User updatePreferences(@PathVariable Long id, @RequestBody Map<String, Object> prefs) {
        User user = userRepo.findById(id).orElseThrow();
        user.getPreferences().putAll(prefs);
        return userRepo.save(user);
    }
}
