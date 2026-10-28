
package com.finance.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class MlInsightsService {

    private final RestClient restClient;

    public MlInsightsService(
            @Value("${ml.api.base-url:http://127.0.0.1:8000}")
            String baseUrl) {

        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .build();
    }

    public String getInsights(List<Map<String, Object>> transactions) {
        try {
            Map<String, Object> request = new LinkedHashMap<>();
            request.put("transactions", transactions);

            return restClient.post()
                    .uri("/insights")
                    .body(request)
                    .retrieve()
                    .body(String.class);

        } catch (Exception ex) {
            throw new RuntimeException(
                    "Failed to retrieve ML insights: " + ex.getMessage(), ex);
        }
    }
}
