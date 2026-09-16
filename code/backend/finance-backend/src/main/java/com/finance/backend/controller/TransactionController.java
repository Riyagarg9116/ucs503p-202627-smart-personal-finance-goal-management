package com.finance.backend.controller;

import com.finance.backend.entity.Account;
import com.finance.backend.entity.Category;
import com.finance.backend.entity.Transaction;
import com.finance.backend.entity.User;
import com.finance.backend.service.AccountService;
import com.finance.backend.service.CategoryService;
import com.finance.backend.service.TransactionService;
import com.finance.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;
    private final AccountService accountService;
    private final CategoryService categoryService;
    private final UserService userService;

    public TransactionController(
            TransactionService transactionService,
            AccountService accountService,
            CategoryService categoryService,
            UserService userService) {

        this.transactionService = transactionService;
        this.accountService = accountService;
        this.categoryService = categoryService;
        this.userService = userService;
    }

    // GET all transactions of the currently logged-in user
    @GetMapping
    public List<Transaction> getAllTransactions() {

        User currentUser = getCurrentUser();

        return transactionService.getAllTransactions()
                .stream()
                .filter(transaction ->
                        transaction.getAccount() != null &&
                        transaction.getAccount().getUser() != null &&
                        transaction.getAccount().getUser().getUserId()
                                .equals(currentUser.getUserId()))
                .toList();
    }

    // GET transaction by ID
    @GetMapping("/{id}")
    public Transaction getTransactionById(@PathVariable Integer id) {

        User currentUser = getCurrentUser();

        Transaction transaction = transactionService
                .getTransactionById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Transaction not found"
                ));

        checkTransactionOwnership(transaction, currentUser);

        return transaction;
    }

    // GET transactions by account
    @GetMapping("/account/{accountId}")
    public List<Transaction> getTransactionsByAccount(
            @PathVariable Integer accountId) {

        User currentUser = getCurrentUser();

        Account account = accountService.getAccountById(accountId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Account not found"
                ));

        checkAccountOwnership(account, currentUser);

        return transactionService.getTransactionsByAccount(accountId);
    }

    // GET transactions by category
    @GetMapping("/category/{categoryId}")
    public List<Transaction> getTransactionsByCategory(
            @PathVariable Integer categoryId) {

        User currentUser = getCurrentUser();

        Category category = categoryService.getCategoryById(categoryId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Category not found"
                ));

        // Category must either be global or belong to current user
        if (category.getUser() != null &&
                !category.getUser().getUserId()
                        .equals(currentUser.getUserId())) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only access your own categories"
            );
        }

        // Filter transactions so only this user's transactions are returned
        return transactionService.getTransactionsByCategory(categoryId)
                .stream()
                .filter(transaction ->
                        transaction.getAccount() != null &&
                        transaction.getAccount().getUser() != null &&
                        transaction.getAccount().getUser().getUserId()
                                .equals(currentUser.getUserId()))
                .toList();
    }

    // CREATE transaction
    @PostMapping("/account/{accountId}/category/{categoryId}")
    public Transaction createTransaction(
            @PathVariable Integer accountId,
            @PathVariable Integer categoryId,
            @RequestBody Transaction transaction) {

        User currentUser = getCurrentUser();

        Account account = accountService.getAccountById(accountId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Account not found"
                ));

        Category category = categoryService.getCategoryById(categoryId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Category not found"
                ));

        // Account must belong to logged-in user
        checkAccountOwnership(account, currentUser);

        // Category must belong to logged-in user or be global
        if (category.getUser() != null &&
                !category.getUser().getUserId()
                        .equals(currentUser.getUserId())) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only use your own categories"
            );
        }

        // Always use the account and category from the URL
        // instead of trusting objects supplied in the request body.
        transaction.setAccount(account);
        transaction.setCategory(category);

        return transactionService.createTransaction(transaction);
    }

    // DELETE transaction
    @DeleteMapping("/{id}")
    public String deleteTransaction(@PathVariable Integer id) {

        User currentUser = getCurrentUser();

        Transaction transaction = transactionService
                .getTransactionById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Transaction not found"
                ));

        checkTransactionOwnership(transaction, currentUser);

        transactionService.deleteTransaction(id);

        return "Transaction deleted successfully";
    }

    // Check whether account belongs to current user
    private void checkAccountOwnership(
            Account account,
            User currentUser) {

        if (account.getUser() == null ||
                !account.getUser().getUserId()
                        .equals(currentUser.getUserId())) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only access your own accounts"
            );
        }
    }

    // Check whether transaction belongs to current user
    private void checkTransactionOwnership(
            Transaction transaction,
            User currentUser) {

        if (transaction.getAccount() == null ||
                transaction.getAccount().getUser() == null ||
                !transaction.getAccount().getUser().getUserId()
                        .equals(currentUser.getUserId())) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only access your own transactions"
            );
        }
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