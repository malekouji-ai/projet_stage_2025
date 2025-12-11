package com.esprit.tn.hkeyitna.service;

import com.esprit.tn.hkeyitna.domain.AuditLog;
import com.esprit.tn.hkeyitna.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;

@Service
public class AuditService {
    private final AuditLogRepository repository;

    public AuditService(AuditLogRepository repository) {
        this.repository = repository;
    }

    public void info(String message) {
        info(message, null);
    }

    public void info(String message, String context) {
        save("INFO", message, context);
    }

    public void warn(String message) {
        warn(message, null);
    }

    public void warn(String message, String context) {
        save("WARN", message, context);
    }

    public void error(String message) {
        error(message, null);
    }

    public void error(String message, String context) {
        save("ERROR", message, context);
    }

    private void save(String level, String message, String context) {
        AuditLog log = new AuditLog(level, message, context, OffsetDateTime.now());
        repository.save(log);
    }
}

