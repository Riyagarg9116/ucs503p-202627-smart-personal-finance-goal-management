package com.finance.backend.repository;

import com.finance.backend.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BudgetRepository extends JpaRepository<Budget, Integer> {

    List<Budget> findByUserUserId(Integer userId);

    List<Budget> findByCategoryCategoryId(Integer categoryId);
}
