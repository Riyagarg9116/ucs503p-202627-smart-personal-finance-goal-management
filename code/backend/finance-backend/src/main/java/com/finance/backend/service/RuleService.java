package com.finance.backend.service;

import com.finance.backend.entity.Rule;
import com.finance.backend.repository.RuleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RuleService {

    private final RuleRepository ruleRepository;

    public RuleService(RuleRepository ruleRepository) {
        this.ruleRepository = ruleRepository;
    }

    // Get all rules
    public List<Rule> getAllRules() {
        return ruleRepository.findAll();
    }

    // Get rule by ID
    public Optional<Rule> getRuleById(Integer id) {
        return ruleRepository.findById(id);
    }

    // Get rules by user
    public List<Rule> getRulesByUser(Integer userId) {
        return ruleRepository.findByUserUserId(userId);
    }

    // Get active/inactive rules
    public List<Rule> getRulesByActiveStatus(Boolean isActive) {
        return ruleRepository.findByIsActive(isActive);
    }

    // Create rule
    public Rule createRule(Rule rule) {
        return ruleRepository.save(rule);
    }

    // Update rule
    public Rule updateRule(Integer id, Rule ruleDetails) {

        Rule rule = ruleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rule not found"));

        rule.setRuleName(ruleDetails.getRuleName());
        rule.setRuleType(ruleDetails.getRuleType());
        rule.setConditionData(ruleDetails.getConditionData());
        rule.setActionData(ruleDetails.getActionData());
        rule.setIsActive(ruleDetails.getIsActive());

        return ruleRepository.save(rule);
    }

    // Delete rule
    public void deleteRule(Integer id) {
        ruleRepository.deleteById(id);
    }
}
