package com.aswaqbank.service;

import com.aswaqbank.entity.BankAccount;
import com.aswaqbank.entity.User;

public interface BankAccountService {

	BankAccount createAccount(User user, String pin);
}