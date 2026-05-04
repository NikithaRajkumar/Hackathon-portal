package com.hackathon.model;

import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Type;
import java.time.LocalDateTime;
import java.util.Map;

@Entity @Table(name = "submissions")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Submission {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String title;
    @Column(nullable = false) private String description;
    @Type(JsonBinaryType.class) @Column(columnDefinition = "jsonb")
    private Map<String, Object> links;
    @Column(name = "file_path") private String filePath;
    @Column(name = "hackathon_id") private Long hackathonId;
    @Column(name = "submitted_by", nullable = false) private String submittedBy;
    @Type(JsonBinaryType.class) @Column(columnDefinition = "jsonb")
    private Map<String, Object> evaluation;
    @Column(name = "submitted_at") @Builder.Default
    private LocalDateTime submittedAt = LocalDateTime.now();
}
