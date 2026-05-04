package com.hackathon.controller;

import com.hackathon.model.Hackathon;
import com.hackathon.repository.HackathonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hackathons")
public class HackathonController {
    @Autowired private HackathonRepository hackRepo;

    @GetMapping
    public List<Hackathon> getAll() { return hackRepo.findAll(); }

    @GetMapping("/tag/{tag}")
    public List<Hackathon> getByTag(@PathVariable String tag) { return hackRepo.findByTag(tag); }

    @PostMapping
    public Hackathon create(@RequestBody Hackathon h) { return hackRepo.save(h); }

    @PutMapping("/{id}")
    public Hackathon update(@PathVariable Long id, @RequestBody Hackathon h) {
        h.setId(id);
        return hackRepo.save(h);
    }

    @DeleteMapping("/{id}")
    public Map<String, Boolean> delete(@PathVariable Long id) {
        hackRepo.deleteById(id);
        return Map.of("success", true);
    }
}
