package com.aswaqbank.dto;

public class ReceiveMoneyResponse {

    private String fullName;

    private String rib;

    private String accountNumber;


    public ReceiveMoneyResponse(
            String fullName,
            String rib,
            String accountNumber
    ) {
        this.fullName = fullName;
        this.rib = rib;
        this.accountNumber = accountNumber;
    }


    public String getFullName() {
        return fullName;
    }


    public String getRib() {
        return rib;
    }


    public String getAccountNumber() {
        return accountNumber;
    }
}