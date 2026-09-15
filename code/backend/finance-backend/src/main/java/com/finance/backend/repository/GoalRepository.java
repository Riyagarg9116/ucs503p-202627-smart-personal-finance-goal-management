package com.finance.backend.repository;

import com.finance.backend.entity.Goal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GoalRepository extends JpaRepository<Goal, Integer> {

    List<Goal> findByUserUserId(Integer userId);

    List<Goal> findByStatus(String status);

    List<Goal> findByPriority(String priority);
}
