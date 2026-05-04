package com.hackathon.model;

import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Type;
import java.time.LocalDateTime;
import java.util.Map;

@Entity @Table(name = "users")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String name;
    @Column(unique = true, nullable = false) private String email;
    @Column(nullable = false) private String password;
    @Builder.Default private String role = "user";
    @Type(JsonBinaryType.class) @Column(columnDefinition = "jsonb")
    private Map<String, Object> preferences;
    @Column(name = "created_at") @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
