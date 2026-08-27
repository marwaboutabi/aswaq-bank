package com.aswaqbank.service;

import com.aswaqbank.dto.AddMoneyRequest;
import com.aswaqbank.dto.SavingsGoalRequest;
import com.aswaqbank.dto.SavingsGoalResponse;
import com.aswaqbank.dto.SavingsTransactionResponse;

import java.util.List;

public interface SavingsGoalService {

    List<SavingsGoalResponse> getGoalsForCurrentUser();

    SavingsGoalResponse createGoal(SavingsGoalRequest request);

    SavingsGoalResponse addMoney(Long goalId, AddMoneyRequest request);

    SavingsGoalResponse updateGoal(Long goalId, SavingsGoalRequest request);

    void deleteGoal(Long goalId);

    List<SavingsTransactionResponse> getHistoryForCurrentUser();
}