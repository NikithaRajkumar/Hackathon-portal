package com.hackathon.controller;

import com.hackathon.model.Team;
import com.hackathon.model.TeamMember;
import com.hackathon.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/teams")
public class TeamController {
    @Autowired private TeamRepository teamRepo;

    @GetMapping
    public List<Team> getAll() { return teamRepo.findAll(); }

    @PostMapping
    public Team create(@RequestBody Map<String, Object> body) {
        Team team = Team.builder()
            .name((String) body.get("name"))
            .hackathonId(Long.valueOf(body.get("hackathon_id").toString()))
            .createdBy((String) body.get("created_by"))
            .metadata(body.containsKey("metadata") ? (Map<String, Object>) body.get("metadata") : Map.of())
            .build();
        TeamMember member = TeamMember.builder().team(team).userName((String) body.get("created_by")).build();
        team.getTeamMembers().add(member);
        return teamRepo.save(team);
    }

    @PutMapping("/{id}")
    public Team update(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Team team = teamRepo.findById(id).orElseThrow();
        team.setName((String) body.get("name"));
        if (body.containsKey("metadata")) team.getMetadata().putAll((Map<String, Object>) body.get("metadata"));
        return teamRepo.save(team);
    }

    @DeleteMapping("/{id}")
    public Map<String, Boolean> delete(@PathVariable Long id) {
        teamRepo.deleteById(id);
        return Map.of("success", true);
    }

    @PostMapping("/{id}/members")
    public ResponseEntity<?> addMember(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Team team = teamRepo.findById(id).orElseThrow();
        String userName = body.get("user_name");
        if (team.getTeamMembers().size() >= team.getMaxMembers())
            return ResponseEntity.badRequest().body(Map.of("error", "Team is full"));
        if (team.getTeamMembers().stream().anyMatch(m -> m.getUserName().equals(userName)))
            return ResponseEntity.badRequest().body(Map.of("error", "Already a member"));
        team.getTeamMembers().add(TeamMember.builder().team(team).userName(userName).build());
        teamRepo.save(team);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @DeleteMapping("/{id}/members/{name}")
    public Map<String, Boolean> removeMember(@PathVariable Long id, @PathVariable String name) {
        Team team = teamRepo.findById(id).orElseThrow();
        team.getTeamMembers().removeIf(m -> m.getUserName().equals(name));
        if (team.getTeamMembers().isEmpty()) teamRepo.delete(team);
        else teamRepo.save(team);
        return Map.of("success", true);
    }
}
