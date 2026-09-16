package com.finance.backend.controller;

import com.finance.backend.entity.User;
import com.finance.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.finance.backend.service.JwtService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(
        UserService userService,
        PasswordEncoder passwordEncoder,
        JwtService jwtService) {

    this.userService = userService;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
}

    // REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        // Check if email already exists
        if (userService.getUserByEmail(request.email()).isPresent()) {
            return ResponseEntity.badRequest()
                    .body("Email already registered");
        }

        User user = new User();
        user.setName(request.name());
        user.setEmail(request.email());

        // UserService will convert this password into BCrypt hash
        user.setPasswordHash(request.password());

        User savedUser = userService.createUser(user);

        String token = jwtService.generateToken(user.getEmail());

return ResponseEntity.ok(
        new AuthResponse(
                "Registration successful",
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                token
        )
);
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        User user = userService.getUserByEmail(request.email())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(401)
                    .body("Invalid email or password");
        }

        // Compare entered password with BCrypt hash stored in database
        if (!passwordEncoder.matches(
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

    // Request for registration
    public record RegisterRequest(
            String name,
            String email,
            String password
    ) {}

    // Request for login
    public record LoginRequest(
            String email,
            String password
    ) {}

    // Response sent after successful login/register
   public record AuthResponse(
        String message,
        Integer userId,
        String name,
        String email,
        String token
) {}
}
