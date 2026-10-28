package com.finance.backend.service;

import com.finance.backend.entity.User;
import com.finance.backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Integer id) {
        return userRepository.findById(id);
    }

    
public User createUser(User user) {

    if (user == null
            || user.getPasswordHash() == null
            || user.getPasswordHash().isBlank()) {
        throw new IllegalArgumentException(
                "Password cannot be blank");
    }

    if (user.getEmail() == null
            || user.getEmail().isBlank()) {
        throw new IllegalArgumentException(
                "Email cannot be blank");
    }

    user.setPasswordHash(
            passwordEncoder.encode(user.getPasswordHash())
    );

    return userRepository.save(user);
}


    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public void deleteUser(Integer id) {
        userRepository.deleteById(id);
    }

    // Get the user associated with the currently logged-in JWT
   
public Optional<User> getCurrentUser() {

    Authentication authentication =
            SecurityContextHolder.getContext().getAuthentication();

    if (authentication == null
            || !authentication.isAuthenticated()
            || authentication instanceof
                    org.springframework.security.authentication.AnonymousAuthenticationToken) {
        return Optional.empty();
    }

    String email = authentication.getName();

    if (email == null || email.isBlank()) {
        return Optional.empty();
    }

    return userRepository.findByEmail(email);
}

}