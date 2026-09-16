package com.finance.backend.controller;

import com.finance.backend.entity.Account;
import com.finance.backend.entity.User;
import com.finance.backend.service.AccountService;
import com.finance.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountService accountService;
    private final UserService userService;

    public AccountController(AccountService accountService,
                             UserService userService) {
        this.accountService = accountService;
        this.userService = userService;
    }

    // GET all accounts of the currently logged-in user
    @GetMapping
    public List<Account> getAllAccounts() {

        User currentUser = getCurrentUser();

        return accountService.getAllAccounts()
                .stream()
                .filter(account ->
                        account.getUser() != null &&
                        account.getUser().getUserId()
                                .equals(currentUser.getUserId()))
                .toList();
    }

    // GET accounts by user
    @GetMapping("/user/{userId}")
    public List<Account> getAccountsByUser(
            @PathVariable Integer userId) {

        User currentUser = getCurrentUser();

        // Do not allow one user to access another user's accounts
        if (!currentUser.getUserId().equals(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only access your own accounts"
            );
        }

        return accountService.getAccountsByUser(userId);
    }

    // GET account by ID
    @GetMapping("/{id}")
    public Account getAccountById(@PathVariable Integer id) {

        User currentUser = getCurrentUser();

        Account account = accountService.getAccountById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Account not found"
                ));

        // Check account ownership
        if (account.getUser() == null ||
                !account.getUser().getUserId()
                        .equals(currentUser.getUserId())) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only access your own accounts"
            );
        }

        return account;
    }

    // CREATE account
    @PostMapping("/user/{userId}")
    public Account createAccount(
            @PathVariable Integer userId,
            @RequestBody Account account) {

        User currentUser = getCurrentUser();

        // The userId in the URL must match the logged-in user
        if (!currentUser.getUserId().equals(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only create accounts for yourself"
            );
        }

        account.setUser(currentUser);

        return accountService.createAccount(account);
    }

    // UPDATE account
    @PutMapping("/{id}")
    public Account updateAccount(
            @PathVariable Integer id,
            @RequestBody Account account) {

        User currentUser = getCurrentUser();

        Account existingAccount = accountService.getAccountById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Account not found"
                ));

        // Check account ownership
        if (existingAccount.getUser() == null ||
                !existingAccount.getUser().getUserId()
                        .equals(currentUser.getUserId())) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only update your own accounts"
            );
        }

        // Prevent changing ownership through the request body
        account.setUser(currentUser);

        return accountService.updateAccount(id, account);
    }

    // DELETE account
    @DeleteMapping("/{id}")
    public String deleteAccount(@PathVariable Integer id) {

        User currentUser = getCurrentUser();

        Account existingAccount = accountService.getAccountById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Account not found"
                ));

        // Check account ownership
        if (existingAccount.getUser() == null ||
                !existingAccount.getUser().getUserId()
                        .equals(currentUser.getUserId())) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only delete your own accounts"
            );
        }

        accountService.deleteAccount(id);

        return "Account deleted successfully";
    }

    // Get currently logged-in user from JWT
    private User getCurrentUser() {

        return userService.getCurrentUser()
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "User is not authenticated"
                ));
    }
}
