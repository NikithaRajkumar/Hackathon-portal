package com.hackathon.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "team_members")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class TeamMember {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id") @JsonIgnore
    private Team team;
    @Column(name = "user_name", nullable = false) private String userName;
}
