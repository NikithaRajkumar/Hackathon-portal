package com.hackathon.model;

import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Type;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

@Entity @Table(name = "hackathons")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Hackathon {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String title;
    private String description;
    @Builder.Default private String status = "Active";
    @Column(name = "start_date") private LocalDate startDate;
    @Column(name = "end_date") private LocalDate endDate;
    @Builder.Default private Integer participants = 0;
    @Type(JsonBinaryType.class) @Column(columnDefinition = "jsonb")
    private Map<String, Object> rules;
    @Column(name = "created_at") @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
