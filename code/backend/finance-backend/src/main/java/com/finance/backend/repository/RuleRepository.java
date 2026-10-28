
package com.finance.backend.repository;

import com.finance.backend.entity.Rule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RuleRepository extends JpaRepository<Rule, Integer> {

    // Get all rules belonging to a user
    List<Rule> findByUserUserId(Integer userId);

    // Get active or inactive rules
    List<Rule> findByIsActive(Boolean isActive);

    // Get active or inactive rules belonging to a specific user
    List<Rule> findByUserUserIdAndIsActive(Integer userId, Boolean isActive);
}

