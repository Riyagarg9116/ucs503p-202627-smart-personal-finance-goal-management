package com.finance.backend.controller;

import com.finance.backend.entity.Goal;
import com.finance.backend.entity.User;
import com.finance.backend.service.GoalService;
import com.finance.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

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

    // Get all goals of the currently logged-in user
    @GetMapping
    public List<Goal> getAllGoals() {

        User currentUser = getCurrentUser();

        return goalService.getAllGoals()
                .stream()
                .filter(goal ->
                        goal.getUser() != null &&
                        goal.getUser().getUserId()
                                .equals(currentUser.getUserId()))
                .toList();
    }

    // Get goals by user
    @GetMapping("/user/{userId}")
    public List<Goal> getGoalsByUser(
            @PathVariable Integer userId) {

        User currentUser = getCurrentUser();

        if (!currentUser.getUserId().equals(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only access your own goals"
            );
        }

        return goalService.getGoalsByUser(userId);
    }

    // Get goals by status
    @GetMapping("/status/{status}")
    public List<Goal> getGoalsByStatus(
            @PathVariable String status) {

        User currentUser = getCurrentUser();

        return goalService.getGoalsByStatus(status)
                .stream()
                .filter(goal ->
                        goal.getUser() != null &&
                        goal.getUser().getUserId()
                                .equals(currentUser.getUserId()))
                .toList();
    }

    // Get goals by priority
    @GetMapping("/priority/{priority}")
    public List<Goal> getGoalsByPriority(
            @PathVariable String priority) {

        User currentUser = getCurrentUser();

        return goalService.getGoalsByPriority(priority)
                .stream()
                .filter(goal ->
                        goal.getUser() != null &&
                        goal.getUser().getUserId()
                                .equals(currentUser.getUserId()))
                .toList();
    }
    
    // Get goal progress percentage
    @GetMapping("/{id}/progress")
    public java.math.BigDecimal getGoalProgressPercentage(
            @PathVariable Integer id) {

        User currentUser = getCurrentUser();

        Goal goal = goalService.getGoalById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Goal not found"
                ));

        checkGoalOwnership(goal, currentUser);

        return goalService.getGoalProgressPercentage(id);
    }

    // Get amount remaining to reach the goal
    @GetMapping("/{id}/remaining")
    public java.math.BigDecimal getGoalAmountRemaining(
            @PathVariable Integer id) {

        User currentUser = getCurrentUser();

        Goal goal = goalService.getGoalById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Goal not found"
                ));

        checkGoalOwnership(goal, currentUser);

        return goalService.getGoalAmountRemaining(id);
    }


    // Get goal by ID
    @GetMapping("/{id}")
    public Goal getGoalById(@PathVariable Integer id) {

        User currentUser = getCurrentUser();

        Goal goal = goalService.getGoalById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Goal not found"
                ));

        checkGoalOwnership(goal, currentUser);

        return goal;
    }

    // Create goal
    @PostMapping("/user/{userId}")
    public Goal createGoal(
            @PathVariable Integer userId,
            @RequestBody Goal goal) {

        User currentUser = getCurrentUser();

        // URL userId must match the logged-in user
        if (!currentUser.getUserId().equals(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only create goals for yourself"
            );
        }

        // Always assign the authenticated user
        goal.setUser(currentUser);

        return goalService.createGoal(goal);
    }

    // Update goal
    @PutMapping("/{id}")
    public Goal updateGoal(
            @PathVariable Integer id,
            @RequestBody Goal goal) {

        User currentUser = getCurrentUser();

        Goal existingGoal = goalService.getGoalById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Goal not found"
                ));

        checkGoalOwnership(existingGoal, currentUser);

        // Prevent changing ownership through request body
        goal.setUser(currentUser);

        return goalService.updateGoal(id, goal);
    }

    // Delete goal
    @DeleteMapping("/{id}")
    public String deleteGoal(@PathVariable Integer id) {

        User currentUser = getCurrentUser();

        Goal existingGoal = goalService.getGoalById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Goal not found"
                ));

        checkGoalOwnership(existingGoal, currentUser);

        goalService.deleteGoal(id);

        return "Goal deleted successfully";
    }

    // Check whether goal belongs to current user
    private void checkGoalOwnership(
            Goal goal,
            User currentUser) {

        if (goal.getUser() == null ||
                !goal.getUser().getUserId()
                        .equals(currentUser.getUserId())) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only access your own goals"
            );
        }
    }

    // Get currently logged-in user from JWT
    private User getCurrentUser() {

        return userService.getCurrentUser()
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "User is not authenticated"
                ));
    }
}
