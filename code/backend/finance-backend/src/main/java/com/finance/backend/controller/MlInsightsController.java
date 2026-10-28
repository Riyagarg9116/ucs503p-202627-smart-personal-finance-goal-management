
package com.finance.backend.controller;

import com.finance.backend.entity.Transaction;
import com.finance.backend.service.MlInsightsService;
import com.finance.backend.service.TransactionService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ml")
public class MlInsightsController {

    private final MlInsightsService mlInsightsService;
    private final TransactionService transactionService;

    public MlInsightsController(
            MlInsightsService mlInsightsService,
            TransactionService transactionService) {
        this.mlInsightsService = mlInsightsService;
        this.transactionService = transactionService;
    }

    @GetMapping(
        value = "/insights",
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<String> getInsights(
            Authentication authentication) {

        String email = authentication.getName();

        List<Map<String, Object>> transactions =
                transactionService.getTransactionsByUserEmail(email)
                        .stream()
                        .map(this::toMlTransaction)
                        .toList();

        String result = mlInsightsService.getInsights(transactions);

        return ResponseEntity.ok(result);
    }

    private Map<String, Object> toMlTransaction(
            Transaction transaction) {

        Map<String, Object> data = new LinkedHashMap<>();

        data.put(
                "transaction_id",
                String.valueOf(transaction.getTransactionId()));

        data.put(
                "date",
                transaction.getTransactionDate().toString());

        data.put("amount", transaction.getAmount());

        data.put(
                "type",
                transaction.getTransactionType().toLowerCase());

        data.put(
                "category",
                transaction.getCategory() != null
                        ? transaction.getCategory().getCategoryName()
                        : "Uncategorized");

        data.put(
                "merchant",
                transaction.getDescription() != null
                        && !transaction.getDescription().isBlank()
                        ? transaction.getDescription()
                        : "Unknown");

        return data;
    }
}



