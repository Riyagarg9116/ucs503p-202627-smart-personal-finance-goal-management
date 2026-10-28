
package com.finance.backend.service;

import com.finance.backend.entity.Transaction;
import com.finance.backend.entity.User;
import com.finance.backend.repository.TransactionRepository;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class DashboardService {

    private final TransactionRepository transactionRepository;

    public DashboardService(
            TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public BigDecimal getTotalIncome(User user) {
        return getTransactionsForUser(user).stream()
                .filter(t -> t.getTransactionType() != null
                        && t.getTransactionType()
                        .equalsIgnoreCase("income"))
                .map(Transaction::getAmount)
                .filter(amount -> amount != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public BigDecimal getTotalExpenses(User user) {
        return getTransactionsForUser(user).stream()
                .filter(t -> t.getTransactionType() != null
                        && t.getTransactionType()
                        .equalsIgnoreCase("expense"))
                .map(Transaction::getAmount)
                .filter(amount -> amount != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public BigDecimal getNetBalance(User user) {
        return getTotalIncome(user)
                .subtract(getTotalExpenses(user));
    }

    private List<Transaction> getTransactionsForUser(User user) {
        return transactionRepository.findAll().stream()
                .filter(t -> t.getAccount() != null
                        && t.getAccount().getUser() != null
                        && t.getAccount().getUser().getUserId()
                        .equals(user.getUserId()))
                .toList();
    }
}

