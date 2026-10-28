package com.finance.backend.service;

import com.finance.backend.entity.Account;
import com.finance.backend.repository.AccountRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AccountService {

    private final AccountRepository accountRepository;

    public AccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    // Get all accounts
    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    // Get account by ID
    public Optional<Account> getAccountById(Integer id) {
        return accountRepository.findById(id);
    }

    // Get accounts of a particular user
    public List<Account> getAccountsByUser(Integer userId) {
        return accountRepository.findByUserUserId(userId);
    }

    // Create account
    
public Account createAccount(Account account) {
    validateAccount(account);

    account.setAccountName(account.getAccountName().trim());

    return accountRepository.save(account);
}


    // Update account
    
public Account updateAccount(Integer id, Account accountDetails) {

    validateAccount(accountDetails);

    Account account = accountRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Account not found"));

    account.setAccountName(accountDetails.getAccountName().trim());
    account.setAccountType(accountDetails.getAccountType());
    account.setBalance(accountDetails.getBalance());

    return accountRepository.save(account);
}


    // Delete account
    public void deleteAccount(Integer id) {
        accountRepository.deleteById(id);
    }

    
private void validateAccount(Account account) {
    if (account == null) {
        throw new IllegalArgumentException(
                "Account cannot be empty");
    }

    if (account.getAccountName() == null
            || account.getAccountName().isBlank()) {
        throw new IllegalArgumentException(
                "Account name cannot be blank");
    }

    if (account.getAccountType() == null
            || account.getAccountType().isBlank()) {
        throw new IllegalArgumentException(
                "Account type cannot be blank");
    }

    if (account.getBalance() != null
            && account.getBalance().signum() < 0) {
        throw new IllegalArgumentException(
                "Account balance cannot be negative");
    }
}

}
