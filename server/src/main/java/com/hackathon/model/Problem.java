package com.hackathon.model;

import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Type;
import java.time.LocalDateTime;
import java.util.Map;

@Entity @Table(name = "problems")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Problem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String title;
    @Column(nullable = false) private String description;
    @Builder.Default private String difficulty = "Medium";
    @Column(name = "hackathon_id") private Long hackathonId;
    @Type(JsonBinaryType.class) @Column(columnDefinition = "jsonb")
    private Map<String, Object> constraints;
    @Column(name = "created_at") @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
