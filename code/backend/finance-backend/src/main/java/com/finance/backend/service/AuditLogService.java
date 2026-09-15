package com.finance.backend.service;

import com.finance.backend.entity.AuditLog;
import com.finance.backend.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    // Get all audit logs
    public List<AuditLog> getAllAuditLogs() {
        return auditLogRepository.findAll();
    }

    // Get audit log by ID
    public Optional<AuditLog> getAuditLogById(Integer id) {
        return auditLogRepository.findById(id);
    }

    // Get audit logs by user
    public List<AuditLog> getAuditLogsByUser(Integer userId) {
        return auditLogRepository.findByUserUserId(userId);
    }

    // Get audit logs by action
    public List<AuditLog> getAuditLogsByAction(String action) {
        return auditLogRepository.findByAction(action);
    }

    // Get audit logs by entity type
    public List<AuditLog> getAuditLogsByEntityType(String entityType) {
        return auditLogRepository.findByEntityType(entityType);
    }

    // Create audit log
    public AuditLog createAuditLog(AuditLog auditLog) {
        return auditLogRepository.save(auditLog);
    }

    // Delete audit log
    public void deleteAuditLog(Integer id) {
        auditLogRepository.deleteById(id);
    }
}
