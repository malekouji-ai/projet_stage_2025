package com.esprit.tn.hkeyitna.repository;

import com.esprit.tn.hkeyitna.domain.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Sort;

import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findAll(Sort sort);
}

