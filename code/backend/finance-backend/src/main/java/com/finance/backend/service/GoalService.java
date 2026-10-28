
package com.finance.backend.service;

import com.finance.backend.entity.Goal;
import com.finance.backend.repository.GoalRepository;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;

@Service
public class GoalService {

    private final GoalRepository goalRepository;

    public GoalService(GoalRepository goalRepository) {
        this.goalRepository = goalRepository;
    }

    // Get all goals
    public List<Goal> getAllGoals() {
        return goalRepository.findAll();
    }

    // Get goal by ID
    public Optional<Goal> getGoalById(Integer id) {
        return goalRepository.findById(id);
    }

    // Get goals by user
    public List<Goal> getGoalsByUser(Integer userId) {
        return goalRepository.findByUserUserId(userId);
    }

    // Get goals by status
    public List<Goal> getGoalsByStatus(String status) {
        return goalRepository.findByStatus(status);
    }

    // Get goals by priority
    public List<Goal> getGoalsByPriority(String priority) {
        return goalRepository.findByPriority(priority);
    }

    // Create goal
    public Goal createGoal(Goal goal) {
        validateGoalAmounts(
                goal.getTargetAmount(),
                goal.getCurrentAmount()
        );
        return goalRepository.save(goal);
    }

    // Update goal
    public Goal updateGoal(Integer id, Goal goalDetails) {
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Goal not found"));

        validateGoalAmounts(
                goalDetails.getTargetAmount(),
                goalDetails.getCurrentAmount()
        );

        goal.setGoalName(goalDetails.getGoalName());
        goal.setTargetAmount(goalDetails.getTargetAmount());
        goal.setCurrentAmount(goalDetails.getCurrentAmount());
        goal.setTargetDate(goalDetails.getTargetDate());
        goal.setPriority(goalDetails.getPriority());
        goal.setStatus(goalDetails.getStatus());

        return goalRepository.save(goal);
    }

    // Delete goal
    public void deleteGoal(Integer id) {
        goalRepository.deleteById(id);
    }

    // Calculate goal progress percentage
    public BigDecimal getGoalProgressPercentage(Integer id) {
        Goal goal = getRequiredGoal(id);

        if (goal.getTargetAmount() == null
                || goal.getTargetAmount()
                .compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalStateException(
                    "Goal target amount must be greater than zero");
        }

        BigDecimal currentAmount = goal.getCurrentAmount() == null
                ? BigDecimal.ZERO
                : goal.getCurrentAmount();

        // Cap displayed progress at 100%
        if (currentAmount.compareTo(goal.getTargetAmount()) >= 0) {
            return BigDecimal.valueOf(100);
        }

        return currentAmount
                .multiply(BigDecimal.valueOf(100))
                .divide(
                        goal.getTargetAmount(),
                        2,
                        RoundingMode.HALF_UP
                );
    }

    // Calculate amount remaining to reach the goal
    public BigDecimal getGoalAmountRemaining(Integer id) {
        Goal goal = getRequiredGoal(id);

        BigDecimal currentAmount = goal.getCurrentAmount() == null
                ? BigDecimal.ZERO
                : goal.getCurrentAmount();

        BigDecimal remaining = goal.getTargetAmount()
                .subtract(currentAmount);

        return remaining.max(BigDecimal.ZERO);
    }

    private Goal getRequiredGoal(Integer id) {
        return goalRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Goal not found"));
    }

    private void validateGoalAmounts(
            BigDecimal targetAmount,
            BigDecimal currentAmount) {

        if (targetAmount == null
                || targetAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(
                    "Target amount must be greater than zero");
        }

        if (currentAmount != null
                && currentAmount.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException(
                    "Current amount cannot be negative");
        }
    }
}
