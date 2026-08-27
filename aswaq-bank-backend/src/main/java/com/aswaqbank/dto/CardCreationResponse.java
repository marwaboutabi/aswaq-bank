package com.aswaqbank.dto;

import com.aswaqbank.entity.BankCard;

public class CardCreationResponse {

    private BankCard card;
    private String generatedPin;

    public CardCreationResponse(BankCard card, String generatedPin) {
        this.card = card;
        this.generatedPin = generatedPin;
    }

    public BankCard getCard() {
        return card;
    }

    public void setCard(BankCard card) {
        this.card = card;
    }

    public String getGeneratedPin() {
        return generatedPin;
    }

    public void setGeneratedPin(String generatedPin) {
        this.generatedPin = generatedPin;
    }
}