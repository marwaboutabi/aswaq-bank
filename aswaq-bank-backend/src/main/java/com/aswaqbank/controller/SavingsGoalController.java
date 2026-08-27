package com.aswaqbank.controller;

import com.aswaqbank.dto.AddMoneyRequest;
import com.aswaqbank.dto.SavingsGoalRequest;
import com.aswaqbank.dto.SavingsGoalResponse;
import com.aswaqbank.dto.SavingsTransactionResponse;
import com.aswaqbank.service.SavingsGoalService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/savings-goals")
public class SavingsGoalController {

    private final SavingsGoalService savingsGoalService;

    @Autowired
    public SavingsGoalController(SavingsGoalService savingsGoalService) {
        this.savingsGoalService = savingsGoalService;
    }

    @GetMapping
    public ResponseEntity<List<SavingsGoalResponse>> getGoals() {
        return ResponseEntity.ok(savingsGoalService.getGoalsForCurrentUser());
    }

    @PostMapping
    public ResponseEntity<SavingsGoalResponse> createGoal(@Valid @RequestBody SavingsGoalRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(savingsGoalService.createGoal(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SavingsGoalResponse> updateGoal(
            @PathVariable Long id,
            @Valid @RequestBody SavingsGoalRequest request) {
        return ResponseEntity.ok(savingsGoalService.updateGoal(id, request));
    }

    @PostMapping("/{id}/add-money")
    public ResponseEntity<SavingsGoalResponse> addMoney(
            @PathVariable Long id,
            @Valid @RequestBody AddMoneyRequest request) {
        return ResponseEntity.ok(savingsGoalService.addMoney(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(@PathVariable Long id) {
        savingsGoalService.deleteGoal(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/history")
    public ResponseEntity<List<SavingsTransactionResponse>> getHistory() {
        return ResponseEntity.ok(savingsGoalService.getHistoryForCurrentUser());
    }
}