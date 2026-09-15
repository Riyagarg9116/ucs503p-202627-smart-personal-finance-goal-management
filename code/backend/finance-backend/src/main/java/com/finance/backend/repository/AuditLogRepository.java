package com.finance.backend.repository;

import com.finance.backend.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Integer> {

    List<AuditLog> findByUserUserId(Integer userId);

    List<AuditLog> findByAction(String action);

    List<AuditLog> findByEntityType(String entityType);
}
