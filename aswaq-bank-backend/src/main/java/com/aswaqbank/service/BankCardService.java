package com.aswaqbank.service;

import com.aswaqbank.dto.CardCreationResponse;
import com.aswaqbank.entity.BankAccount;

public interface BankCardService {

    CardCreationResponse createCard(BankAccount account);

}