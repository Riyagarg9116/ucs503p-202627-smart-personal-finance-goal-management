package com.finance.backend.service;

import com.finance.backend.entity.Transaction;
import com.finance.backend.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    // Get all transactions
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    // Get transaction by ID
    public Optional<Transaction> getTransactionById(Integer id) {
        return transactionRepository.findById(id);
    }

    // Get transactions by account
    public List<Transaction> getTransactionsByAccount(Integer accountId) {
        return transactionRepository.findByAccountAccountId(accountId);
    }

    // Get transactions by category
    public List<Transaction> getTransactionsByCategory(Integer categoryId) {
        return transactionRepository.findByCategoryCategoryId(categoryId);
    }

    // Create transaction
    public Transaction createTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    // Delete transaction
    public void deleteTransaction(Integer id) {
        transactionRepository.deleteById(id);
    }
}
