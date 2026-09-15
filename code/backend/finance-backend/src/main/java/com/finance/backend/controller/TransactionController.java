package com.finance.backend.controller;

import com.finance.backend.entity.Account;
import com.finance.backend.entity.Category;
import com.finance.backend.entity.Transaction;
import com.finance.backend.service.AccountService;
import com.finance.backend.service.CategoryService;
import com.finance.backend.service.TransactionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;
    private final AccountService accountService;
    private final CategoryService categoryService;

    public TransactionController(
            TransactionService transactionService,
            AccountService accountService,
            CategoryService categoryService) {

        this.transactionService = transactionService;
        this.accountService = accountService;
        this.categoryService = categoryService;
    }

    // GET all transactions
    @GetMapping
    public List<Transaction> getAllTransactions() {
        return transactionService.getAllTransactions();
    }

    // GET transaction by ID
    @GetMapping("/{id}")
    public Transaction getTransactionById(@PathVariable Integer id) {

        return transactionService.getTransactionById(id)
                .orElseThrow(() ->
                        new RuntimeException("Transaction not found"));
    }

    // GET transactions by account
    @GetMapping("/account/{accountId}")
    public List<Transaction> getTransactionsByAccount(
            @PathVariable Integer accountId) {

        return transactionService.getTransactionsByAccount(accountId);
    }

    // GET transactions by category
    @GetMapping("/category/{categoryId}")
    public List<Transaction> getTransactionsByCategory(
            @PathVariable Integer categoryId) {

        return transactionService.getTransactionsByCategory(categoryId);
    }

    // CREATE transaction
    @PostMapping("/account/{accountId}/category/{categoryId}")
    public Transaction createTransaction(
            @PathVariable Integer accountId,
            @PathVariable Integer categoryId,
            @RequestBody Transaction transaction) {

        Account account = accountService.getAccountById(accountId)
                .orElseThrow(() ->
                        new RuntimeException("Account not found"));

        Category category = categoryService.getCategoryById(categoryId)
                .orElseThrow(() ->
                        new RuntimeException("Category not found"));

        transaction.setAccount(account);
        transaction.setCategory(category);

        return transactionService.createTransaction(transaction);
    }

    // DELETE transaction
    @DeleteMapping("/{id}")
    public String deleteTransaction(@PathVariable Integer id) {

        transactionService.deleteTransaction(id);

        return "Transaction deleted successfully";
    }
}
