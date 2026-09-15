package com.finance.backend.service;

import com.finance.backend.entity.Goal;
import com.finance.backend.repository.GoalRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GoalService {

    private final GoalRepository goalRepository;

    public GoalService(GoalRepository goalRepository) {
        this.goalRepository = goalRepository;
    }

    public List<Goal> getAllGoals() {
        return goalRepository.findAll();
    }

    public Optional<Goal> getGoalById(Integer id) {
        return goalRepository.findById(id);
    }

    public List<Goal> getGoalsByUser(Integer userId) {
        return goalRepository.findByUserUserId(userId);
    }

    public List<Goal> getGoalsByStatus(String status) {
        return goalRepository.findByStatus(status);
    }

    public List<Goal> getGoalsByPriority(String priority) {
        return goalRepository.findByPriority(priority);
    }

    public Goal createGoal(Goal goal) {
        return goalRepository.save(goal);
    }

    public Goal updateGoal(Integer id, Goal goalDetails) {

        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        goal.setGoalName(goalDetails.getGoalName());
        goal.setTargetAmount(goalDetails.getTargetAmount());
        goal.setCurrentAmount(goalDetails.getCurrentAmount());
        goal.setTargetDate(goalDetails.getTargetDate());
        goal.setPriority(goalDetails.getPriority());
        goal.setStatus(goalDetails.getStatus());

        return goalRepository.save(goal);
    }

    public void deleteGoal(Integer id) {
        goalRepository.deleteById(id);
    }
}
