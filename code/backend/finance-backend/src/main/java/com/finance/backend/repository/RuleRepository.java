package com.finance.backend.repository;

import com.finance.backend.entity.Rule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RuleRepository extends JpaRepository<Rule, Integer> {

    List<Rule> findByUserUserId(Integer userId);

    List<Rule> findByIsActive(Boolean isActive);
}
