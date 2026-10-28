
package com.finance.backend.service;

import com.finance.backend.entity.Budget;
import com.finance.backend.entity.Transaction;
import com.finance.backend.repository.BudgetRepository;
import com.finance.backend.repository.TransactionRepository;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final TransactionRepository transactionRepository;

    public BudgetService(
            BudgetRepository budgetRepository,
            TransactionRepository transactionRepository) {
        this.budgetRepository = budgetRepository;
        this.transactionRepository = transactionRepository;
    }

    // Get all budgets
    public List<Budget> getAllBudgets() {
        return budgetRepository.findAll();
    }

    // Get budget by ID
    public Optional<Budget> getBudgetById(Integer id) {
        return budgetRepository.findById(id);
    }

    // Get budgets by user
    public List<Budget> getBudgetsByUser(Integer userId) {
        return budgetRepository.findByUserUserId(userId);
    }

    // Get budgets by category
    public List<Budget> getBudgetsByCategory(Integer categoryId) {
        return budgetRepository.findByCategoryCategoryId(categoryId);
    }

    // Create budget
    public Budget createBudget(Budget budget) {
        return budgetRepository.save(budget);
    }

    // Update budget
    public Budget updateBudget(Integer id, Budget budgetDetails) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Budget not found"));

        budget.setBudgetName(budgetDetails.getBudgetName());
        budget.setAmount(budgetDetails.getAmount());
        budget.setStartDate(budgetDetails.getStartDate());
        budget.setEndDate(budgetDetails.getEndDate());

        return budgetRepository.save(budget);
    }

    // Delete budget
    public void deleteBudget(Integer id) {
        budgetRepository.deleteById(id);
    }

    // Calculate total expenses for a budget's category and date range
    public BigDecimal getTotalSpent(Integer budgetId) {
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() ->
                        new RuntimeException("Budget not found"));

        List<Transaction> transactions = transactionRepository
                .findByAccountUserUserIdAndCategoryCategoryIdAndTransactionTypeIgnoreCaseAndTransactionDateBetween(
                        budget.getUser().getUserId(),
                        budget.getCategory().getCategoryId(),
                        "expense",
                        budget.getStartDate(),
                        budget.getEndDate()
                );

        return transactions.stream()
                .map(Transaction::getAmount)
                .filter(amount -> amount != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // Calculate remaining budget
    public BigDecimal getRemainingBudget(Integer budgetId) {
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() ->
                        new RuntimeException("Budget not found"));

        return budget.getAmount().subtract(getTotalSpent(budgetId));
    }

    // Calculate percentage of budget used
    public BigDecimal getBudgetUsagePercentage(Integer budgetId) {
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() ->
                        new RuntimeException("Budget not found"));

        if (budget.getAmount() == null
                || budget.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalStateException(
                    "Budget amount must be greater than zero");
        }

        return getTotalSpent(budgetId)
                .multiply(BigDecimal.valueOf(100))
                .divide(budget.getAmount(), 2, RoundingMode.HALF_UP);
    }
}
