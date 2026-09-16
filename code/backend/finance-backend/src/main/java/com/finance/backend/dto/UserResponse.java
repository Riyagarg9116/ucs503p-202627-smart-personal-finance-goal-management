package com.finance.backend.dto;

public record UserResponse(
        Integer userId,
        String name,
        String email
) {
}
