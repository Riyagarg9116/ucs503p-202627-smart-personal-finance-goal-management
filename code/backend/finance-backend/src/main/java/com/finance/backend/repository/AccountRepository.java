package com.finance.backend.repository;

import com.finance.backend.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AccountRepository extends JpaRepository<Account, Integer> {

    List<Account> findByUserUserId(Integer userId);
}
