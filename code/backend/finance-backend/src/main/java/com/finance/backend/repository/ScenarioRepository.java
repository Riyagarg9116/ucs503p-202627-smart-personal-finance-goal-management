package com.finance.backend.repository;

import com.finance.backend.entity.Scenario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScenarioRepository extends JpaRepository<Scenario, Integer> {

    List<Scenario> findByUserUserId(Integer userId);
}
