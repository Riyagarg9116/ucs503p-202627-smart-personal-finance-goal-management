package com.finance.backend.controller;

import com.finance.backend.entity.Scenario;
import com.finance.backend.entity.User;
import com.finance.backend.service.ScenarioService;
import com.finance.backend.service.UserService;
import org.springframework.web.bind.annotation.*;

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

    // Get all scenarios
    @GetMapping
    public List<Scenario> getAllScenarios() {
        return scenarioService.getAllScenarios();
    }

    // Get scenarios by user
    @GetMapping("/user/{userId}")
    public List<Scenario> getScenariosByUser(@PathVariable Integer userId) {
        return scenarioService.getScenariosByUser(userId);
    }

    // Get scenario by ID
    @GetMapping("/{id}")
    public Scenario getScenarioById(@PathVariable Integer id) {

        return scenarioService.getScenarioById(id)
                .orElseThrow(() -> new RuntimeException("Scenario not found"));
    }

    // Create scenario
    @PostMapping("/user/{userId}")
    public Scenario createScenario(
            @PathVariable Integer userId,
            @RequestBody Scenario scenario) {

        User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        scenario.setUser(user);

        return scenarioService.createScenario(scenario);
    }

    // Update scenario
    @PutMapping("/{id}")
    public Scenario updateScenario(
            @PathVariable Integer id,
            @RequestBody Scenario scenario) {

        return scenarioService.updateScenario(id, scenario);
    }

    // Delete scenario
    @DeleteMapping("/{id}")
    public String deleteScenario(@PathVariable Integer id) {

        scenarioService.deleteScenario(id);

        return "Scenario deleted successfully";
    }
}
