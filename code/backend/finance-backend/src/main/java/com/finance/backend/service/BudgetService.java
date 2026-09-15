package com.finance.backend.service;

import com.finance.backend.entity.Budget;
import com.finance.backend.repository.BudgetRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;

    public BudgetService(BudgetRepository budgetRepository) {
        this.budgetRepository = budgetRepository;
    }

    public List<Budget> getAllBudgets() {
        return budgetRepository.findAll();
    }

    public Optional<Budget> getBudgetById(Integer id) {
        return budgetRepository.findById(id);
    }

    public List<Budget> getBudgetsByUser(Integer userId) {
        return budgetRepository.findByUserUserId(userId);
    }

    public List<Budget> getBudgetsByCategory(Integer categoryId) {
        return budgetRepository.findByCategoryCategoryId(categoryId);
    }

    public Budget createBudget(Budget budget) {
        return budgetRepository.save(budget);
    }

    public Budget updateBudget(Integer id, Budget budgetDetails) {

        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        budget.setBudgetName(budgetDetails.getBudgetName());
        budget.setAmount(budgetDetails.getAmount());
        budget.setStartDate(budgetDetails.getStartDate());
        budget.setEndDate(budgetDetails.getEndDate());

        return budgetRepository.save(budget);
    }

    public void deleteBudget(Integer id) {
        budgetRepository.deleteById(id);
    }
}
