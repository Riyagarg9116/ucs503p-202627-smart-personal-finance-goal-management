package com.finance.backend.repository;

import com.finance.backend.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository
        extends JpaRepository<Transaction, Integer> {

    List<Transaction> findByAccountAccountId(Integer accountId);

    List<Transaction> findByCategoryCategoryId(Integer categoryId);
}
