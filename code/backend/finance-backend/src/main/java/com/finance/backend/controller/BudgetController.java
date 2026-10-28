
package com.finance.backend.controller;

import com.finance.backend.entity.Budget;
import com.finance.backend.entity.Category;
import com.finance.backend.entity.User;
import com.finance.backend.service.BudgetService;
import com.finance.backend.service.CategoryService;
import com.finance.backend.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
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

    // Get all budgets belonging to the logged-in user
    @GetMapping
    public List<Budget> getAllBudgets() {
        User currentUser = getCurrentUser();
        return budgetService.getBudgetsByUser(
                currentUser.getUserId());
    }

    // Get budgets by user
    @GetMapping("/user/{userId}")
    public List<Budget> getBudgetsByUser(
            @PathVariable Integer userId) {
        User currentUser = getCurrentUser();

        if (!currentUser.getUserId().equals(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only access your own budgets");
        }

        return budgetService.getBudgetsByUser(userId);
    }

    // Get budgets by category
    @GetMapping("/category/{categoryId}")
    public List<Budget> getBudgetsByCategory(
            @PathVariable Integer categoryId) {
        User currentUser = getCurrentUser();

        Category category = categoryService
                .getCategoryById(categoryId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Category not found"));

        checkCategoryOwnership(category, currentUser);

        return budgetService.getBudgetsByCategory(categoryId)
                .stream()
                .filter(budget -> budget.getUser() != null
                        && budget.getUser().getUserId()
                        .equals(currentUser.getUserId()))
                .toList();
    }

    // Get budget by ID
    @GetMapping("/{id}")
    public Budget getBudgetById(@PathVariable Integer id) {
        return getOwnedBudget(id, getCurrentUser());
    }

    // Get total spending for a budget
    @GetMapping("/{id}/spent")
    public BigDecimal getTotalSpent(@PathVariable Integer id) {
        User currentUser = getCurrentUser();
        getOwnedBudget(id, currentUser);
        return budgetService.getTotalSpent(id);
    }

    // Get remaining budget
    @GetMapping("/{id}/remaining")
    public BigDecimal getRemainingBudget(@PathVariable Integer id) {
        User currentUser = getCurrentUser();
        getOwnedBudget(id, currentUser);
        return budgetService.getRemainingBudget(id);
    }

    // Get percentage of budget used
    @GetMapping("/{id}/usage")
    public BigDecimal getBudgetUsagePercentage(
            @PathVariable Integer id) {
        User currentUser = getCurrentUser();
        getOwnedBudget(id, currentUser);
        return budgetService.getBudgetUsagePercentage(id);
    }

    // Create budget
    @PostMapping("/user/{userId}/category/{categoryId}")
    public Budget createBudget(
            @PathVariable Integer userId,
            @PathVariable Integer categoryId,
            @RequestBody Budget budget) {
        User currentUser = getCurrentUser();

        if (!currentUser.getUserId().equals(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only create budgets for yourself");
        }

        Category category = categoryService
                .getCategoryById(categoryId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Category not found"));

        checkCategoryOwnership(category, currentUser);

        if (budget.getAmount() == null
                || budget.getAmount()
                .compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Budget amount must be greater than zero");
        }

        if (budget.getStartDate() == null
                || budget.getEndDate() == null
                || budget.getEndDate()
                .isBefore(budget.getStartDate())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Valid budget start and end dates are required");
        }

        budget.setUser(currentUser);
        budget.setCategory(category);

        return budgetService.createBudget(budget);
    }

    // Update budget
    @PutMapping("/{id}")
    public Budget updateBudget(
            @PathVariable Integer id,
            @RequestBody Budget budgetDetails) {
        User currentUser = getCurrentUser();
        Budget existingBudget = getOwnedBudget(id, currentUser);

        if (budgetDetails.getCategory() != null
                && budgetDetails.getCategory().getCategoryId() != null) {
            Category category = categoryService
                    .getCategoryById(
                            budgetDetails.getCategory().getCategoryId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Category not found"));

            checkCategoryOwnership(category, currentUser);
            budgetDetails.setCategory(category);
        } else {
            budgetDetails.setCategory(existingBudget.getCategory());
        }

        if (budgetDetails.getAmount() != null
                && budgetDetails.getAmount()
                .compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Budget amount must be greater than zero");
        }

        if (budgetDetails.getStartDate() != null
                && budgetDetails.getEndDate() != null
                && budgetDetails.getEndDate()
                .isBefore(budgetDetails.getStartDate())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "End date cannot be before start date");
        }

        budgetDetails.setUser(currentUser);
        return budgetService.updateBudget(id, budgetDetails);
    }

    // Delete budget
    @DeleteMapping("/{id}")
    public String deleteBudget(@PathVariable Integer id) {
        User currentUser = getCurrentUser();
        getOwnedBudget(id, currentUser);
        budgetService.deleteBudget(id);
        return "Budget deleted successfully";
    }

    private Budget getOwnedBudget(
            Integer id, User currentUser) {
        Budget budget = budgetService.getBudgetById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Budget not found"));

        checkBudgetOwnership(budget, currentUser);
        return budget;
    }

    private void checkBudgetOwnership(
            Budget budget, User currentUser) {
        if (budget.getUser() == null
                || !budget.getUser().getUserId()
                .equals(currentUser.getUserId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only access your own budgets");
        }
    }

    private void checkCategoryOwnership(
            Category category, User currentUser) {
        if (category.getUser() != null
                && !category.getUser().getUserId()
                .equals(currentUser.getUserId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only use your own categories");
        }
    }

    private User getCurrentUser() {
        return userService.getCurrentUser()
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "User is not authenticated"));
    }
}
