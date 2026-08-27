package com.aswaqbank.service;

import com.aswaqbank.entity.Merchant;
import com.aswaqbank.entity.User;

import java.util.List;

public interface MerchantService {

    Merchant createMerchant(User user, Merchant merchant);

    Merchant getMerchantByUser(User user);

    List<Merchant> getAllMerchants();
}