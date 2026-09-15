package com.finance.backend.controller;

import com.finance.backend.entity.Budget;
import com.finance.backend.entity.Category;
import com.finance.backend.entity.User;
import com.finance.backend.service.BudgetService;
import com.finance.backend.service.CategoryService;
import com.finance.backend.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetService budgetService;
    private final UserService userService;
    private final CategoryService categoryService;

    public BudgetController(
            BudgetService budgetService,
            UserService userService,
            CategoryService categoryService) {

        this.budgetService = budgetService;
        this.userService = userService;
        this.categoryService = categoryService;
    }

    // Get all budgets
    @GetMapping
    public List<Budget> getAllBudgets() {
        return budgetService.getAllBudgets();
    }

    // Get budgets by user
    @GetMapping("/user/{userId}")
    public List<Budget> getBudgetsByUser(@PathVariable Integer userId) {
        return budgetService.getBudgetsByUser(userId);
    }

    // Get budgets by category
    @GetMapping("/category/{categoryId}")
    public List<Budget> getBudgetsByCategory(@PathVariable Integer categoryId) {
        return budgetService.getBudgetsByCategory(categoryId);
    }

    // Get budget by ID
    @GetMapping("/{id}")
    public Budget getBudgetById(@PathVariable Integer id) {
        return budgetService.getBudgetById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
    }

    // Create budget
    @PostMapping("/user/{userId}/category/{categoryId}")
    public Budget createBudget(
            @PathVariable Integer userId,
            @PathVariable Integer categoryId,
            @RequestBody Budget budget) {

        User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Category category = categoryService.getCategoryById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        budget.setUser(user);
        budget.setCategory(category);

        return budgetService.createBudget(budget);
    }

    // Update budget
    @PutMapping("/{id}")
    public Budget updateBudget(
            @PathVariable Integer id,
            @RequestBody Budget budget) {

        return budgetService.updateBudget(id, budget);
    }

    // Delete budget
    @DeleteMapping("/{id}")
    public String deleteBudget(@PathVariable Integer id) {

        budgetService.deleteBudget(id);

        return "Budget deleted successfully";
    }
}
