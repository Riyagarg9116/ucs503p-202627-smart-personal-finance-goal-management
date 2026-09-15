package com.finance.backend.controller;

import com.finance.backend.entity.AuditLog;
import com.finance.backend.entity.User;
import com.finance.backend.service.AuditLogService;
import com.finance.backend.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
public class AuditLogController {

    private final AuditLogService auditLogService;
    private final UserService userService;

    public AuditLogController(
            AuditLogService auditLogService,
            UserService userService) {

        this.auditLogService = auditLogService;
        this.userService = userService;
    }

    // Get all audit logs
    @GetMapping
    public List<AuditLog> getAllAuditLogs() {
        return auditLogService.getAllAuditLogs();
    }

    // Get audit logs by user
    @GetMapping("/user/{userId}")
    public List<AuditLog> getAuditLogsByUser(
            @PathVariable Integer userId) {

        return auditLogService.getAuditLogsByUser(userId);
    }

    // Get audit logs by action
    @GetMapping("/action/{action}")
    public List<AuditLog> getAuditLogsByAction(
            @PathVariable String action) {

        return auditLogService.getAuditLogsByAction(action);
    }

    // Get audit logs by entity type
    @GetMapping("/entity/{entityType}")
    public List<AuditLog> getAuditLogsByEntityType(
            @PathVariable String entityType) {

        return auditLogService.getAuditLogsByEntityType(entityType);
    }

    // Get audit log by ID
    @GetMapping("/{id}")
    public AuditLog getAuditLogById(@PathVariable Integer id) {

        return auditLogService.getAuditLogById(id)
                .orElseThrow(() -> new RuntimeException("Audit log not found"));
    }

    // Create audit log
    @PostMapping("/user/{userId}")
    public AuditLog createAuditLog(
            @PathVariable Integer userId,
            @RequestBody AuditLog auditLog) {

        User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        auditLog.setUser(user);

        return auditLogService.createAuditLog(auditLog);
    }

    // Delete audit log
    @DeleteMapping("/{id}")
    public String deleteAuditLog(@PathVariable Integer id) {

        auditLogService.deleteAuditLog(id);

        return "Audit log deleted successfully";
    }
}
