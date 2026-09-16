package com.finance.backend.controller;

import com.finance.backend.dto.UserResponse;
import com.finance.backend.entity.User;
import com.finance.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Get all users
    @GetMapping
    public List<UserResponse> getAllUsers() {

        return userService.getAllUsers()
                .stream()
                .map(this::toUserResponse)
                .collect(Collectors.toList());
    }

    // Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Integer id) {

        return userService.getUserById(id)
                .map(user -> ResponseEntity.ok(toUserResponse(user)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {

        userService.deleteUser(id);

        return ResponseEntity.noContent().build();
    }

    // Convert User entity to UserResponse DTO
    private UserResponse toUserResponse(User user) {

        return new UserResponse(
                user.getUserId(),
                user.getName(),
                user.getEmail()
        );
    }
}