package com.esprit.tn.hkeyitna.domain;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "audit_log")
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 10)
    private String level; // INFO/WARN/ERROR

    @Column(nullable = false, length = 500)
    private String message;

    @Column(length = 2000)
    private String context;

    @Column(nullable = false)
    private OffsetDateTime createdAt;

    public AuditLog() {}

    public AuditLog(String level, String message, String context, OffsetDateTime createdAt) {
        this.level = level;
        this.message = message;
        this.context = context;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getContext() { return context; }
    public void setContext(String context) { this.context = context; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}

