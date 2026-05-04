package com.hackathon.controller;

import com.hackathon.model.Problem;
import com.hackathon.repository.ProblemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/problems")
public class ProblemController {
    @Autowired private ProblemRepository problemRepo;

    @GetMapping
    public List<Problem> getAll() { return problemRepo.findAll(); }

    @PostMapping
    public Problem create(@RequestBody Problem p) { return problemRepo.save(p); }

    @PutMapping("/{id}")
    public Problem update(@PathVariable Long id, @RequestBody Problem p) {
        p.setId(id);
        return problemRepo.save(p);
    }

    @DeleteMapping("/{id}")
    public Map<String, Boolean> delete(@PathVariable Long id) {
        problemRepo.deleteById(id);
        return Map.of("success", true);
    }
}
