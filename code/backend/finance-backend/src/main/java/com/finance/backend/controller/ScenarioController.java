package com.finance.backend.controller;

import com.finance.backend.entity.Scenario;
import com.finance.backend.entity.User;
import com.finance.backend.service.ScenarioService;
import com.finance.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/scenarios")
public class ScenarioController {

    private final ScenarioService scenarioService;
    private final UserService userService;

    public ScenarioController(
            ScenarioService scenarioService,
            UserService userService) {

        this.scenarioService = scenarioService;
        this.userService = userService;
    }

    // Get all scenarios of the currently logged-in user
    @GetMapping
    public List<Scenario> getAllScenarios() {

        User currentUser = getCurrentUser();

        return scenarioService.getAllScenarios()
                .stream()
                .filter(scenario ->
                        scenario.getUser() != null &&
                        scenario.getUser().getUserId()
                                .equals(currentUser.getUserId()))
                .toList();
    }

    // Get scenarios by user
    @GetMapping("/user/{userId}")
    public List<Scenario> getScenariosByUser(
            @PathVariable Integer userId) {

        User currentUser = getCurrentUser();

        if (!currentUser.getUserId().equals(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only access your own scenarios"
            );
        }

        return scenarioService.getScenariosByUser(userId);
    }

    // Get scenario by ID
    @GetMapping("/{id}")
    public Scenario getScenarioById(@PathVariable Integer id) {

        User currentUser = getCurrentUser();

        Scenario scenario = scenarioService.getScenarioById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Scenario not found"
                ));

        checkScenarioOwnership(scenario, currentUser);

        return scenario;
    }

    // Create scenario
    @PostMapping("/user/{userId}")
    public Scenario createScenario(
            @PathVariable Integer userId,
            @RequestBody Scenario scenario) {

        User currentUser = getCurrentUser();

        // URL userId must match the logged-in user
        if (!currentUser.getUserId().equals(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only create scenarios for yourself"
            );
        }

        // Always assign the authenticated user
        scenario.setUser(currentUser);

        return scenarioService.createScenario(scenario);
    }

    // Update scenario
    @PutMapping("/{id}")
    public Scenario updateScenario(
            @PathVariable Integer id,
            @RequestBody Scenario scenario) {

        User currentUser = getCurrentUser();

        Scenario existingScenario = scenarioService
                .getScenarioById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Scenario not found"
                ));

        checkScenarioOwnership(existingScenario, currentUser);

        // Prevent changing ownership
        scenario.setUser(currentUser);

        return scenarioService.updateScenario(id, scenario);
    }

    // Delete scenario
    @DeleteMapping("/{id}")
    public String deleteScenario(@PathVariable Integer id) {

        User currentUser = getCurrentUser();

        Scenario existingScenario = scenarioService
                .getScenarioById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Scenario not found"
                ));

        checkScenarioOwnership(existingScenario, currentUser);

        scenarioService.deleteScenario(id);

        return "Scenario deleted successfully";
    }

    // Check scenario ownership
    private void checkScenarioOwnership(
            Scenario scenario,
            User currentUser) {

        if (scenario.getUser() == null ||
                !scenario.getUser().getUserId()
                        .equals(currentUser.getUserId())) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only access your own scenarios"
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
