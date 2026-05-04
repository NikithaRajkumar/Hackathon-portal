package com.hackathon.model;

import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Type;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Entity @Table(name = "teams")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Team {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String name;
    @Column(name = "hackathon_id") private Long hackathonId;
    @Column(name = "created_by") private String createdBy;
    @Column(name = "max_members") @Builder.Default private Integer maxMembers = 4;
    @Type(JsonBinaryType.class) @Column(columnDefinition = "jsonb")
    private Map<String, Object> metadata;
    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Builder.Default private List<TeamMember> teamMembers = new ArrayList<>();
    @Column(name = "created_at") @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Transient
    public List<String> getMembers() {
        return teamMembers.stream().map(TeamMember::getUserName).toList();
    }
}
