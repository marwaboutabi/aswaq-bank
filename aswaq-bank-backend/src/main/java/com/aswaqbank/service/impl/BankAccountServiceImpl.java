package com.aswaqbank.service.impl;

import com.aswaqbank.entity.BankAccount;
import com.aswaqbank.entity.User;
import com.aswaqbank.repository.BankAccountRepository;
import com.aswaqbank.service.BankAccountService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Random;
import com.aswaqbank.entity.AccountStatus;

@Service
public class BankAccountServiceImpl implements BankAccountService {

    private final BankAccountRepository repository;

    public BankAccountServiceImpl(BankAccountRepository repository) {
        this.repository = repository;
    }

    @Override
    public BankAccount createAccount(User user, String pin) {
        BankAccount account = new BankAccount();

        account.setUser(user);

        account.setAccountNumber(generateAccountNumber());

        account.setRib(generateRib());          // <-- AJOUT

        account.setBalance(BigDecimal.ZERO);

        account.setCurrency("MAD");

        account.setStatus(AccountStatus.ACTIVE);
        
        account.setCreatedAt(LocalDateTime.now());

        return repository.save(account);
    }

    private String generateAccountNumber() {

        Random random = new Random();

        return "MA"
                + (100000000 + random.nextInt(900000000))
                + (100000000 + random.nextInt(900000000));
    }

    private String generateRib() {

        Random random = new Random();

        String rib;

        do {
            StringBuilder builder = new StringBuilder();

            for (int i = 0; i < 24; i++) {
                builder.append(random.nextInt(10));
            }

            rib = builder.toString();

        } while (repository.existsByRib(rib));

        return rib;
    }
}