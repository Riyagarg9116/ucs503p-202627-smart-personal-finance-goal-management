package com.finance.backend.controller;

import com.finance.backend.entity.Rule;
import com.finance.backend.entity.User;
import com.finance.backend.service.RuleService;
import com.finance.backend.service.UserService;
import org.springframework.web.bind.annotation.*;

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

    // Get all rules
    @GetMapping
    public List<Rule> getAllRules() {
        return ruleService.getAllRules();
    }

    // Get rules by user
    @GetMapping("/user/{userId}")
    public List<Rule> getRulesByUser(@PathVariable Integer userId) {
        return ruleService.getRulesByUser(userId);
    }

    // Get active/inactive rules
    @GetMapping("/active/{isActive}")
    public List<Rule> getRulesByActiveStatus(
            @PathVariable Boolean isActive) {

        return ruleService.getRulesByActiveStatus(isActive);
    }

    // Get rule by ID
    @GetMapping("/{id}")
    public Rule getRuleById(@PathVariable Integer id) {

        return ruleService.getRuleById(id)
                .orElseThrow(() -> new RuntimeException("Rule not found"));
    }

    // Create rule
    @PostMapping("/user/{userId}")
    public Rule createRule(
            @PathVariable Integer userId,
            @RequestBody Rule rule) {

        User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        rule.setUser(user);

        return ruleService.createRule(rule);
    }

    // Update rule
    @PutMapping("/{id}")
    public Rule updateRule(
            @PathVariable Integer id,
            @RequestBody Rule rule) {

        return ruleService.updateRule(id, rule);
    }

    // Delete rule
    @DeleteMapping("/{id}")
    public String deleteRule(@PathVariable Integer id) {

        ruleService.deleteRule(id);

        return "Rule deleted successfully";
    }
}
