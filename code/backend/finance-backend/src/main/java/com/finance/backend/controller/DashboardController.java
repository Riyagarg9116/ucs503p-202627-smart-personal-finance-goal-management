
package com.finance.backend.controller;

import com.finance.backend.entity.User;
import com.finance.backend.service.DashboardService;
import com.finance.backend.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;
    private final UserService userService;

    public DashboardController(
            DashboardService dashboardService,
            UserService userService) {
        this.dashboardService = dashboardService;
        this.userService = userService;
    }

    // Get financial summary for the logged-in user
    @GetMapping("/summary")
    public Map<String, BigDecimal> getSummary() {
        User currentUser = userService.getCurrentUser()
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "User is not authenticated"));

        BigDecimal income =
                dashboardService.getTotalIncome(currentUser);

        BigDecimal expenses =
                dashboardService.getTotalExpenses(currentUser);

        BigDecimal netBalance =
                dashboardService.getNetBalance(currentUser);

        Map<String, BigDecimal> summary = new LinkedHashMap<>();
        summary.put("totalIncome", income);
        summary.put("totalExpenses", expenses);
        summary.put("netBalance", netBalance);

        return summary;
    }
}

