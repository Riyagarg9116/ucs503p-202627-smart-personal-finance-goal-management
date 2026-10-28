
package com.finance.backend.controller;

import com.finance.backend.entity.Account;
import com.finance.backend.entity.Category;
import com.finance.backend.entity.User;
import com.finance.backend.service.AccountService;
import com.finance.backend.service.CategoryService;
import com.finance.backend.service.JwtService;
import com.finance.backend.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final AccountService accountService;
    private final CategoryService categoryService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(
            UserService userService,
            AccountService accountService,
            CategoryService categoryService,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userService = userService;
        this.accountService = accountService;
        this.categoryService = categoryService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request) {

        if (request.name() == null || request.name().isBlank()
                || request.email() == null || request.email().isBlank()
                || request.password() == null || request.password().isBlank()) {
            return ResponseEntity.badRequest()
                    .body("Name, email and password are required");
        }

        String email = request.email().trim();

        if (userService.getUserByEmail(email).isPresent()) {
            return ResponseEntity.badRequest()
                    .body("Email already registered");
        }

        User user = new User();
        user.setName(request.name().trim());
        user.setEmail(email);
        user.setPasswordHash(request.password());

        // UserService hashes the password and saves the user.
        User savedUser = userService.createUser(user);

        // Create a default financial account for this user.
        Account account = new Account();
        account.setUser(savedUser);
        account.setAccountName("My Account");
        account.setAccountType("bank");
        account.setBalance(BigDecimal.ZERO);
        accountService.createAccount(account);

        // Create starter categories belonging to this user.
        createCategory(savedUser, "Food", "expense");
        createCategory(savedUser, "Shopping", "expense");
        createCategory(savedUser, "Travel", "expense");
        createCategory(savedUser, "Entertainment", "expense");
        createCategory(savedUser, "Salary", "income");

        String token = jwtService.generateToken(savedUser.getEmail());

        return ResponseEntity.ok(
                new AuthResponse(
                        "Registration successful",
                        savedUser.getUserId(),
                        savedUser.getName(),
                        savedUser.getEmail(),
                        token
                )
        );
    }

    private void createCategory(
            User user, String name, String type) {

        Category category = new Category();
        category.setUser(user);
        category.setCategoryName(name);
        category.setCategoryType(type);
        categoryService.createCategory(category);
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {

        if (request.email() == null || request.password() == null) {
            return ResponseEntity.status(401)
                    .body("Invalid email or password");
        }

        User user = userService
                .getUserByEmail(request.email().trim())
                .orElse(null);

        if (user == null
                || !passwordEncoder.matches(
                        request.password(),
                        user.getPasswordHash())) {
            return ResponseEntity.status(401)
                    .body("Invalid email or password");
        }

        String token = jwtService.generateToken(user.getEmail());

        return ResponseEntity.ok(
                new AuthResponse(
                        "Login successful",
                        user.getUserId(),
                        user.getName(),
                        user.getEmail(),
                        token
                )
        );
    }

    public record RegisterRequest(
            String name,
            String email,
            String password) {
    }

    public record LoginRequest(
            String email,
            String password) {
    }

    public record AuthResponse(
            String message,
            Integer userId,
            String name,
            String email,
            String token) {
    }
}
