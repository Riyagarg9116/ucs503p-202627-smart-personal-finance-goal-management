package com.finance.backend.controller;

import com.finance.backend.entity.AuditLog;
import com.finance.backend.entity.User;
import com.finance.backend.service.AuditLogService;
import com.finance.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

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

    // Get all audit logs of the currently logged-in user
    @GetMapping
    public List<AuditLog> getAllAuditLogs() {

        User currentUser = getCurrentUser();

        return auditLogService.getAllAuditLogs()
                .stream()
                .filter(log ->
                        log.getUser() != null &&
                        log.getUser().getUserId()
                                .equals(currentUser.getUserId()))
                .toList();
    }

    // Get audit logs by user
    @GetMapping("/user/{userId}")
    public List<AuditLog> getAuditLogsByUser(
            @PathVariable Integer userId) {

        User currentUser = getCurrentUser();

        if (!currentUser.getUserId().equals(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only access your own audit logs"
            );
        }

        return auditLogService.getAuditLogsByUser(userId);
    }

    // Get audit logs by action
    @GetMapping("/action/{action}")
    public List<AuditLog> getAuditLogsByAction(
            @PathVariable String action) {

        User currentUser = getCurrentUser();

        return auditLogService.getAuditLogsByAction(action)
                .stream()
                .filter(log ->
                        log.getUser() != null &&
                        log.getUser().getUserId()
                                .equals(currentUser.getUserId()))
                .toList();
    }

    // Get audit logs by entity type
    @GetMapping("/entity/{entityType}")
    public List<AuditLog> getAuditLogsByEntityType(
            @PathVariable String entityType) {

        User currentUser = getCurrentUser();

        return auditLogService.getAuditLogsByEntityType(entityType)
                .stream()
                .filter(log ->
                        log.getUser() != null &&
                        log.getUser().getUserId()
                                .equals(currentUser.getUserId()))
                .toList();
    }

    // Get audit log by ID
    @GetMapping("/{id}")
    public AuditLog getAuditLogById(@PathVariable Integer id) {

        User currentUser = getCurrentUser();

        AuditLog auditLog = auditLogService.getAuditLogById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Audit log not found"
                ));

        checkAuditLogOwnership(auditLog, currentUser);

        return auditLog;
    }

    // Create audit log
    @PostMapping("/user/{userId}")
    public AuditLog createAuditLog(
            @PathVariable Integer userId,
            @RequestBody AuditLog auditLog) {

        User currentUser = getCurrentUser();

        // URL userId must match the logged-in user
        if (!currentUser.getUserId().equals(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only create audit logs for yourself"
            );
        }

        // Always use the authenticated user
        auditLog.setUser(currentUser);

        return auditLogService.createAuditLog(auditLog);
    }

    // Delete audit log
    @DeleteMapping("/{id}")
    public String deleteAuditLog(@PathVariable Integer id) {

        User currentUser = getCurrentUser();

        AuditLog auditLog = auditLogService.getAuditLogById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Audit log not found"
                ));

        checkAuditLogOwnership(auditLog, currentUser);

        auditLogService.deleteAuditLog(id);

        return "Audit log deleted successfully";
    }

    // Check audit log ownership
    private void checkAuditLogOwnership(
            AuditLog auditLog,
            User currentUser) {

        if (auditLog.getUser() == null ||
                !auditLog.getUser().getUserId()
                        .equals(currentUser.getUserId())) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only access your own audit logs"
            );
        }
    }

    // Get currently logged-in user from JWT
    private User getCurrentUser() {

        return userService.getCurrentUser()
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "User is not authenticated"
                ));
    }
}
