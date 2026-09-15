package com.finance.backend.controller;

import com.finance.backend.entity.Account;
import com.finance.backend.entity.User;
import com.finance.backend.service.AccountService;
import com.finance.backend.service.UserService;
import org.springframework.web.bind.annotation.*;

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

    // GET all accounts
    @GetMapping
    public List<Account> getAllAccounts() {
        return accountService.getAllAccounts();
    }

    // GET accounts by user
    @GetMapping("/user/{userId}")
    public List<Account> getAccountsByUser(@PathVariable Integer userId) {
        return accountService.getAccountsByUser(userId);
    }

    // GET account by ID
    @GetMapping("/{id}")
    public Account getAccountById(@PathVariable Integer id) {
        return accountService.getAccountById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));
    }

    // CREATE account
    @PostMapping("/user/{userId}")
    public Account createAccount(
            @PathVariable Integer userId,
            @RequestBody Account account) {

        User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        account.setUser(user);

        return accountService.createAccount(account);
    }

    // UPDATE account
    @PutMapping("/{id}")
    public Account updateAccount(
            @PathVariable Integer id,
            @RequestBody Account account) {

        return accountService.updateAccount(id, account);
    }

    // DELETE account
    @DeleteMapping("/{id}")
    public String deleteAccount(@PathVariable Integer id) {

        accountService.deleteAccount(id);

        return "Account deleted successfully";
    }
}
