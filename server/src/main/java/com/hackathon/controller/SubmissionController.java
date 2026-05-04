package com.hackathon.controller;

import com.hackathon.model.Submission;
import com.hackathon.model.User;
import com.hackathon.repository.SubmissionRepository;
import com.hackathon.repository.UserRepository;
import com.hackathon.service.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {
    @Autowired private SubmissionRepository submissionRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private MailService mailService;

    @Value("${file.upload-dir}") private String uploadDir;

    @GetMapping
    public List<Submission> getAll() { return submissionRepo.findAll(); }

    @PostMapping
    public ResponseEntity<?> create(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String github,
            @RequestParam(required = false) String demo,
            @RequestParam String hackathon_id,
            @RequestParam String submitted_by,
            @RequestParam(required = false) String user_email,
            @RequestParam(required = false) MultipartFile file) {
        try {
            String filePath = null;
            if (file != null && !file.isEmpty()) {
                Files.createDirectories(Paths.get(uploadDir));
                filePath = System.currentTimeMillis() + "-" + file.getOriginalFilename();
                file.transferTo(new File(uploadDir + "/" + filePath));
            }
            Submission sub = submissionRepo.save(Submission.builder()
                .title(title).description(description)
                .links(Map.of("github", github, "demo", demo != null ? demo : "", "extra", List.of()))
                .filePath(filePath)
                .hackathonId(Long.valueOf(hackathon_id))
                .submittedBy(submitted_by)
                .evaluation(new HashMap<>(Map.of("score", null != null ? null : "", "feedback", "", "criteria", Map.of())))
                .build());
            if (user_email != null) mailService.sendSubmissionConfirm(user_email, title);
            return ResponseEntity.ok(sub);
        } catch (Exception e) { return ResponseEntity.status(500).body(Map.of("error", e.getMessage())); }
    }

    @PutMapping("/{id}/evaluate")
    public ResponseEntity<?> evaluate(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Submission sub = submissionRepo.findById(id).orElseThrow();
        Map<String, Object> evaluation = new HashMap<>(sub.getEvaluation() != null ? sub.getEvaluation() : Map.of());
        evaluation.put("score", body.get("score"));
        evaluation.put("feedback", body.getOrDefault("feedback", ""));
        evaluation.put("criteria", body.getOrDefault("criteria", Map.of()));
        sub.setEvaluation(evaluation);
        submissionRepo.save(sub);
        String userEmail = (String) body.get("user_email");
        String title = (String) body.get("title");
        if (userEmail != null && title != null)
            mailService.sendEvaluationResult(userEmail, title, Integer.parseInt(body.get("score").toString()));
        return ResponseEntity.ok(sub);
    }
}
