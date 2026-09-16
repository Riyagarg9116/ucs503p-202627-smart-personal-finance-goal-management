package com.finance.backend.controller;

import com.finance.backend.entity.Rule;
import com.finance.backend.entity.User;
import com.finance.backend.service.RuleService;
import com.finance.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/rules")
public class RuleController {

    private final RuleService ruleService;
    private final UserService userService;

    public RuleController(
            RuleService ruleService,
            UserService userService) {

        this.ruleService = ruleService;
        this.userService = userService;
    }

    // Get all rules of the currently logged-in user
    @GetMapping
    public List<Rule> getAllRules() {

        User currentUser = getCurrentUser();

        return ruleService.getAllRules()
                .stream()
                .filter(rule ->
                        rule.getUser() != null &&
                        rule.getUser().getUserId()
                                .equals(currentUser.getUserId()))
                .toList();
    }

    // Get rules by user
    @GetMapping("/user/{userId}")
    public List<Rule> getRulesByUser(
            @PathVariable Integer userId) {

        User currentUser = getCurrentUser();

        if (!currentUser.getUserId().equals(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only access your own rules"
            );
        }

        return ruleService.getRulesByUser(userId);
    }

    // Get active/inactive rules
    @GetMapping("/active/{isActive}")
    public List<Rule> getRulesByActiveStatus(
            @PathVariable Boolean isActive) {

        User currentUser = getCurrentUser();

        return ruleService.getRulesByActiveStatus(isActive)
                .stream()
                .filter(rule ->
                        rule.getUser() != null &&
                        rule.getUser().getUserId()
                                .equals(currentUser.getUserId()))
                .toList();
    }

    // Get rule by ID
    @GetMapping("/{id}")
    public Rule getRuleById(@PathVariable Integer id) {

        User currentUser = getCurrentUser();

        Rule rule = ruleService.getRuleById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Rule not found"
                ));

        checkRuleOwnership(rule, currentUser);

        return rule;
    }

    // Create rule
    @PostMapping("/user/{userId}")
    public Rule createRule(
            @PathVariable Integer userId,
            @RequestBody Rule rule) {

        User currentUser = getCurrentUser();

        // URL userId must match logged-in user
        if (!currentUser.getUserId().equals(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only create rules for yourself"
            );
        }

        // Always use the authenticated user
        rule.setUser(currentUser);

        return ruleService.createRule(rule);
    }

    // Update rule
    @PutMapping("/{id}")
    public Rule updateRule(
            @PathVariable Integer id,
            @RequestBody Rule rule) {

        User currentUser = getCurrentUser();

        Rule existingRule = ruleService.getRuleById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Rule not found"
                ));

        checkRuleOwnership(existingRule, currentUser);

        // Prevent changing the rule owner
        rule.setUser(currentUser);

        return ruleService.updateRule(id, rule);
    }

    // Delete rule
    @DeleteMapping("/{id}")
    public String deleteRule(@PathVariable Integer id) {

        User currentUser = getCurrentUser();

        Rule existingRule = ruleService.getRuleById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Rule not found"
                ));

        checkRuleOwnership(existingRule, currentUser);

        ruleService.deleteRule(id);

        return "Rule deleted successfully";
    }

    // Check rule ownership
    private void checkRuleOwnership(
            Rule rule,
            User currentUser) {

        if (rule.getUser() == null ||
                !rule.getUser().getUserId()
                        .equals(currentUser.getUserId())) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only access your own rules"
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
