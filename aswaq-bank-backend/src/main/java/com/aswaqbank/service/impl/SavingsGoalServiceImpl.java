package com.aswaqbank.service.impl;

import com.aswaqbank.dto.AddMoneyRequest;
import com.aswaqbank.dto.SavingsGoalRequest;
import com.aswaqbank.dto.SavingsGoalResponse;
import com.aswaqbank.dto.SavingsTransactionResponse;
import com.aswaqbank.entity.BankAccount;
import com.aswaqbank.entity.SavingsGoal;
import com.aswaqbank.entity.SavingsTransaction;
import com.aswaqbank.entity.User;
import com.aswaqbank.exception.InsufficientFundsException;
import com.aswaqbank.repository.BankAccountRepository;
import com.aswaqbank.repository.SavingsGoalRepository;
import com.aswaqbank.repository.SavingsTransactionRepository;
import com.aswaqbank.repository.UserRepository;
import com.aswaqbank.service.SavingsGoalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
public class SavingsGoalServiceImpl implements SavingsGoalService {

    private final SavingsGoalRepository savingsGoalRepository;
    private final SavingsTransactionRepository savingsTransactionRepository;
    private final BankAccountRepository bankAccountRepository;
    private final UserRepository userRepository;

    @Autowired
    public SavingsGoalServiceImpl(SavingsGoalRepository savingsGoalRepository,
                                   SavingsTransactionRepository savingsTransactionRepository,
                                   BankAccountRepository bankAccountRepository,
                                   UserRepository userRepository) {
        this.savingsGoalRepository = savingsGoalRepository;
        this.savingsTransactionRepository = savingsTransactionRepository;
        this.bankAccountRepository = bankAccountRepository;
        this.userRepository = userRepository;
    }

    // ---- Utilisateur courant (JWT) -------------------------------------------------
    // Reprend le même principe que AuthController/JwtAuthenticationFilter : le nom du
    // principal Spring Security correspond à l'email de l'utilisateur.
    private String getCurrentUserEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    private User getCurrentUser() {
        String email = getCurrentUserEmail();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
    }

    private BankAccount getCurrentUserAccount() {
        return bankAccountRepository.findByUserEmail(getCurrentUserEmail())
                .orElseThrow(() -> new RuntimeException("Compte bancaire introuvable"));
    }

    @Override
    public List<SavingsGoalResponse> getGoalsForCurrentUser() {
        User user = getCurrentUser();
        List<SavingsGoalResponse> responses = new ArrayList<>();
        for (SavingsGoal goal : savingsGoalRepository.findByUserOrderByCreatedAtDesc(user)) {
            responses.add(toResponse(goal));
        }
        return responses;
    }

    @Override
    @Transactional
    public SavingsGoalResponse createGoal(SavingsGoalRequest request) {
        User user = getCurrentUser();

        SavingsGoal goal = new SavingsGoal();
        goal.setUser(user);
        goal.setName(request.getName());
        goal.setTargetAmount(request.getTargetAmount());
        goal.setCurrentAmount(BigDecimal.ZERO);
        goal.setDeadline(request.getDeadline());

        SavingsGoal saved = savingsGoalRepository.save(goal);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public SavingsGoalResponse addMoney(Long goalId, AddMoneyRequest request) {
        User user = getCurrentUser();
        SavingsGoal goal = savingsGoalRepository.findByIdAndUser(goalId, user)
                .orElseThrow(() -> new RuntimeException("Objectif introuvable"));

        BigDecimal amount = request.getAmount();

        BankAccount account = getCurrentUserAccount();
        if (account.getBalance().compareTo(amount) < 0) {
            throw new InsufficientFundsException("Solde insuffisant sur le compte principal");
        }

        // On ne dépasse jamais le montant cible : le surplus reste sur le compte
        BigDecimal newTotal = goal.getCurrentAmount().add(amount);
        BigDecimal amountApplied = amount;
        if (newTotal.compareTo(goal.getTargetAmount()) > 0) {
            amountApplied = goal.getTargetAmount().subtract(goal.getCurrentAmount());
            newTotal = goal.getTargetAmount();
        }

        account.setBalance(account.getBalance().subtract(amountApplied));
        bankAccountRepository.save(account);

        goal.setCurrentAmount(newTotal);
        savingsGoalRepository.save(goal);

        SavingsTransaction transaction = new SavingsTransaction();
        transaction.setSavingsGoal(goal);
        transaction.setAmount(amountApplied);
        savingsTransactionRepository.save(transaction);

        return toResponse(goal);
    }

    @Override
    @Transactional
    public SavingsGoalResponse updateGoal(Long goalId, SavingsGoalRequest request) {
        User user = getCurrentUser();
        SavingsGoal goal = savingsGoalRepository.findByIdAndUser(goalId, user)
                .orElseThrow(() -> new RuntimeException("Objectif introuvable"));

        goal.setName(request.getName());
        goal.setTargetAmount(request.getTargetAmount());
        goal.setDeadline(request.getDeadline());

        return toResponse(savingsGoalRepository.save(goal));
    }

    @Override
    @Transactional
    public void deleteGoal(Long goalId) {
        User user = getCurrentUser();
        SavingsGoal goal = savingsGoalRepository.findByIdAndUser(goalId, user)
                .orElseThrow(() -> new RuntimeException("Objectif introuvable"));
        savingsGoalRepository.delete(goal);
    }

    @Override
    public List<SavingsTransactionResponse> getHistoryForCurrentUser() {
        User user = getCurrentUser();
        List<SavingsTransactionResponse> responses = new ArrayList<>();
        for (SavingsTransaction t : savingsTransactionRepository.findAllByUser(user)) {
            responses.add(new SavingsTransactionResponse(
                    t.getId(), t.getTransactionDate(), t.getAmount(), t.getSavingsGoal().getName()));
        }
        return responses;
    }

    // ---- Mapping + calculs ----------------------------------------------------------

    private SavingsGoalResponse toResponse(SavingsGoal goal) {
        BigDecimal current = goal.getCurrentAmount();
        BigDecimal target = goal.getTargetAmount();
        boolean completed = current.compareTo(target) >= 0;

        int percent = target.compareTo(BigDecimal.ZERO) > 0
                ? Math.min(100, current.multiply(BigDecimal.valueOf(100))
                        .divide(target, 0, RoundingMode.HALF_UP).intValue())
                : 0;

        BigDecimal remaining = target.subtract(current).max(BigDecimal.ZERO);

        BigDecimal monthlyAdvice = BigDecimal.ZERO;
        boolean onTrack = true;

        if (!completed && goal.getDeadline() != null) {
            long monthsRemaining = ChronoUnit.MONTHS.between(
                    LocalDate.now().withDayOfMonth(1),
                    goal.getDeadline().withDayOfMonth(1));
            monthsRemaining = Math.max(monthsRemaining, 1); // évite la division par 0 / valeurs négatives

            monthlyAdvice = remaining.divide(BigDecimal.valueOf(monthsRemaining), 0, RoundingMode.CEILING);

            // "on track" : on compare l'avancement réel au délai déjà écoulé depuis la création
            long totalMonths = ChronoUnit.MONTHS.between(
                    goal.getCreatedAt().toLocalDate().withDayOfMonth(1),
                    goal.getDeadline().withDayOfMonth(1));
            long elapsedMonths = ChronoUnit.MONTHS.between(
                    goal.getCreatedAt().toLocalDate().withDayOfMonth(1),
                    LocalDate.now().withDayOfMonth(1));

            if (totalMonths > 0) {
                BigDecimal expectedProgress = target.multiply(BigDecimal.valueOf(elapsedMonths))
                        .divide(BigDecimal.valueOf(totalMonths), 2, RoundingMode.HALF_UP);
                onTrack = current.compareTo(expectedProgress) >= 0;
            }
        }

        return new SavingsGoalResponse(
                goal.getId(), goal.getName(), current, target, goal.getDeadline(),
                percent, remaining, monthlyAdvice, completed || onTrack, completed);
    }
}