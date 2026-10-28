package com.finance.backend.service;

import com.finance.backend.entity.Scenario;
import com.finance.backend.repository.ScenarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ScenarioService {

    private final ScenarioRepository scenarioRepository;

    public ScenarioService(ScenarioRepository scenarioRepository) {
        this.scenarioRepository = scenarioRepository;
    }

    // Get all scenarios
    public List<Scenario> getAllScenarios() {
        return scenarioRepository.findAll();
    }

    // Get scenario by ID
    public Optional<Scenario> getScenarioById(Integer id) {
        return scenarioRepository.findById(id);
    }

    // Get scenarios by user
    public List<Scenario> getScenariosByUser(Integer userId) {
        return scenarioRepository.findByUserUserId(userId);
    }

    // Create scenario
    
public Scenario createScenario(Scenario scenario) {
    validateScenario(scenario);
    scenario.setScenarioName(scenario.getScenarioName().trim());
    return scenarioRepository.save(scenario);
}


    // Update scenario
    
public Scenario updateScenario(Integer id, Scenario scenarioDetails) {

    validateScenario(scenarioDetails);

    Scenario scenario = scenarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Scenario not found"));

    scenario.setScenarioName(scenarioDetails.getScenarioName().trim());
    scenario.setDescription(scenarioDetails.getDescription());
    scenario.setInputData(scenarioDetails.getInputData());
    scenario.setResultData(scenarioDetails.getResultData());

    return scenarioRepository.save(scenario);
}


    // Delete scenario
    public void deleteScenario(Integer id) {
        scenarioRepository.deleteById(id);
    }
 
private void validateScenario(Scenario scenario) {
    if (scenario == null) {
        throw new IllegalArgumentException(
                "Scenario cannot be empty");
    }

    if (scenario.getScenarioName() == null
            || scenario.getScenarioName().isBlank()) {
        throw new IllegalArgumentException(
                "Scenario name cannot be blank");
    }
}

}
