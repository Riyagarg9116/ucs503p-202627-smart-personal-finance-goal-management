package com.finance.backend.controller;

import com.finance.backend.entity.Goal;
import com.finance.backend.entity.User;
import com.finance.backend.service.GoalService;
import com.finance.backend.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
public class GoalController {

    private final GoalService goalService;
    private final UserService userService;

    public GoalController(
            GoalService goalService,
            UserService userService) {

        this.goalService = goalService;
        this.userService = userService;
    }

    // Get all goals
    @GetMapping
    public List<Goal> getAllGoals() {
        return goalService.getAllGoals();
    }

    // Get goals by user
    @GetMapping("/user/{userId}")
    public List<Goal> getGoalsByUser(@PathVariable Integer userId) {
        return goalService.getGoalsByUser(userId);
    }

    // Get goals by status
    @GetMapping("/status/{status}")
    public List<Goal> getGoalsByStatus(@PathVariable String status) {
        return goalService.getGoalsByStatus(status);
    }

    // Get goals by priority
    @GetMapping("/priority/{priority}")
    public List<Goal> getGoalsByPriority(@PathVariable String priority) {
        return goalService.getGoalsByPriority(priority);
    }

    // Get goal by ID
    @GetMapping("/{id}")
    public Goal getGoalById(@PathVariable Integer id) {
        return goalService.getGoalById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found"));
    }

    // Create goal
    @PostMapping("/user/{userId}")
    public Goal createGoal(
            @PathVariable Integer userId,
            @RequestBody Goal goal) {

        User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        goal.setUser(user);

        return goalService.createGoal(goal);
    }

    // Update goal
    @PutMapping("/{id}")
    public Goal updateGoal(
            @PathVariable Integer id,
            @RequestBody Goal goal) {

        return goalService.updateGoal(id, goal);
    }

    // Delete goal
    @DeleteMapping("/{id}")
    public String deleteGoal(@PathVariable Integer id) {

        goalService.deleteGoal(id);

        return "Goal deleted successfully";
    }
}
