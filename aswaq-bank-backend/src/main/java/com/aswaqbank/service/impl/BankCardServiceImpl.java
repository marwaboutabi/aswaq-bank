package com.aswaqbank.service.impl;

import com.aswaqbank.dto.CardCreationResponse;
import com.aswaqbank.entity.BankAccount;
import com.aswaqbank.entity.BankCard;
import com.aswaqbank.entity.CardStatus;
import com.aswaqbank.repository.BankCardRepository;
import com.aswaqbank.service.BankCardService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Random;

@Service
public class BankCardServiceImpl implements BankCardService {

    private final BankCardRepository repository;
    private final PasswordEncoder passwordEncoder;

    public BankCardServiceImpl(BankCardRepository repository,
                               PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public CardCreationResponse createCard(BankAccount account) {

        BankCard card = new BankCard();

        card.setBankAccount(account);

        card.setCardNumber(generateCardNumber());

        card.setCvv(generateCVV());

        card.setExpiryDate(LocalDate.now().plusYears(5));

        card.setStatus(CardStatus.ACTIVE);

        String generatedPin = generatePin();

        card.setPinHash(passwordEncoder.encode(generatedPin));

        BankCard savedCard = repository.save(card);

        return new CardCreationResponse(savedCard, generatedPin);
    }

    private String generateCardNumber() {

        Random random = new Random();

        String number;

        do {

            StringBuilder builder = new StringBuilder();

            for (int i = 0; i < 16; i++) {
                builder.append(random.nextInt(10));
            }

            number = builder.toString();

        } while (repository.existsByCardNumber(number));

        return number;
    }

    private String generateCVV() {

        Random random = new Random();

        return String.format("%03d", random.nextInt(1000));
    }

    private String generatePin() {

        Random random = new Random();

        return String.format("%04d", random.nextInt(10000));
    }
}