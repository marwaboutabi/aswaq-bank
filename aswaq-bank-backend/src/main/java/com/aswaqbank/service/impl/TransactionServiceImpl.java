package com.aswaqbank.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aswaqbank.dto.ReceivedTransactionResponse;
import com.aswaqbank.dto.TransactionResponse;
import com.aswaqbank.entity.BankAccount;
import com.aswaqbank.entity.Beneficiary;
import com.aswaqbank.entity.LoyaltyReward;
import com.aswaqbank.entity.Merchant;
import com.aswaqbank.entity.NotificationType;
import com.aswaqbank.entity.Product;
import com.aswaqbank.entity.Sale;
import com.aswaqbank.entity.SaleStatus;
import com.aswaqbank.entity.Transaction;
import com.aswaqbank.entity.TransactionStatus;
import com.aswaqbank.entity.TransactionType;
import com.aswaqbank.entity.User;
import com.aswaqbank.repository.BankAccountRepository;
import com.aswaqbank.repository.BeneficiaryRepository;
import com.aswaqbank.repository.MerchantRepository;
import com.aswaqbank.repository.ProductRepository;
import com.aswaqbank.repository.SaleRepository;
import com.aswaqbank.repository.TransactionRepository;
import com.aswaqbank.service.LoyaltyRewardService;
import com.aswaqbank.service.LoyaltyService;
import com.aswaqbank.service.NotificationService;
import com.aswaqbank.service.TransactionService;

@Service
public class TransactionServiceImpl implements TransactionService {

    private static final int LOW_STOCK_THRESHOLD = 5;

    private final TransactionRepository transactionRepository;
    private final BankAccountRepository bankAccountRepository;
    private final BeneficiaryRepository beneficiaryRepository;
    private final MerchantRepository merchantRepository;
    private final LoyaltyService loyaltyService;
    private final LoyaltyRewardService loyaltyRewardService;
    private final SaleRepository saleRepository;
    private final ProductRepository productRepository;
    private final NotificationService notificationService;

    public TransactionServiceImpl(
            TransactionRepository transactionRepository,
            BankAccountRepository bankAccountRepository,
            BeneficiaryRepository beneficiaryRepository,
            MerchantRepository merchantRepository,
            LoyaltyService loyaltyService,
            LoyaltyRewardService loyaltyRewardService,
            SaleRepository saleRepository,
            ProductRepository productRepository,
            NotificationService notificationService
    ) {
        this.transactionRepository = transactionRepository;
        this.bankAccountRepository = bankAccountRepository;
        this.beneficiaryRepository = beneficiaryRepository;
        this.merchantRepository = merchantRepository;
        this.loyaltyService = loyaltyService;
        this.loyaltyRewardService = loyaltyRewardService;
        this.saleRepository = saleRepository;
        this.productRepository = productRepository;
        this.notificationService = notificationService;
    }

    @Override
    public List<ReceivedTransactionResponse> getReceivedTransactions(Long userId) {
        List<Transaction> transactions = transactionRepository
                .findBySenderAccount_User_IdOrReceiverAccount_User_IdOrderByTransactionDateDesc(userId, userId);

        return transactions.stream()
                .filter(transaction -> transaction.getReceiverAccount() != null
                        && transaction.getReceiverAccount().getUser() != null
                        && transaction.getReceiverAccount().getUser().getId().equals(userId))
                .map(transaction -> new ReceivedTransactionResponse(
                        transaction.getId(),
                        transaction.getSenderAccount().getUser().getNom() + " " + transaction.getSenderAccount().getUser().getPrenom(),
                        transaction.getTransactionReference(),
                        transaction.getAmount(),
                        transaction.getTransactionDate(),
                        transaction.getStatus().name(),
                        transaction.getDescription()))
                .toList();
    }

    @Override
    @Transactional
    public Transaction deposit(String accountNumber, BigDecimal amount, String description) {
        validateAmount(amount);
        BankAccount account = bankAccountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Compte introuvable"));

        account.setBalance(account.getBalance().add(amount));
        bankAccountRepository.save(account);

        Transaction transaction = new Transaction();
        transaction.setTransactionReference(generateReference());
        transaction.setType(TransactionType.DEPOSIT);
        transaction.setAmount(amount);
        transaction.setDescription(description);
        transaction.setStatus(TransactionStatus.SUCCESS);
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setReceiverAccount(account);

        return transactionRepository.save(transaction);
    }

    @Override
    @Transactional
    public Transaction withdraw(String accountNumber, BigDecimal amount, String description) {
        validateAmount(amount);
        BankAccount account = bankAccountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Compte introuvable"));

        if (account.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Solde insuffisant");
        }

        account.setBalance(account.getBalance().subtract(amount));
        bankAccountRepository.save(account);

        Transaction transaction = new Transaction();
        transaction.setTransactionReference(generateReference());
        transaction.setType(TransactionType.WITHDRAWAL);
        transaction.setAmount(amount);
        transaction.setDescription(description);
        transaction.setStatus(TransactionStatus.SUCCESS);
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setSenderAccount(account);

        return transactionRepository.save(transaction);
    }

    @Override
    @Transactional
    public Transaction transfer(String senderAccountNumber, Long beneficiaryId, BigDecimal amount, String description, String pin) {
        validateAmount(amount);
        BankAccount sender = bankAccountRepository.findByAccountNumber(senderAccountNumber)
                .orElseThrow(() -> new RuntimeException("Compte émetteur introuvable"));

        Beneficiary beneficiary = beneficiaryRepository.findByIdAndUser_Id(beneficiaryId, sender.getUser().getId())
                .orElseThrow(() -> new RuntimeException("Bénéficiaire introuvable"));

        BankAccount receiver = bankAccountRepository.findByRib(beneficiary.getRib())
                .orElseThrow(() -> new RuntimeException("Compte bénéficiaire introuvable"));

        if (sender.getId().equals(receiver.getId())) {
            throw new RuntimeException("Impossible de faire un virement vers le même compte");
        }

        if (sender.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Solde insuffisant");
        }

        sender.setBalance(sender.getBalance().subtract(amount));
        receiver.setBalance(receiver.getBalance().add(amount));
        bankAccountRepository.save(sender);
        bankAccountRepository.save(receiver);

        Transaction transaction = new Transaction();
        transaction.setTransactionReference(generateReference());
        transaction.setType(TransactionType.TRANSFER);
        transaction.setAmount(amount);
        transaction.setDescription(description);
        transaction.setStatus(TransactionStatus.SUCCESS);
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setSenderAccount(sender);
        transaction.setReceiverAccount(receiver);

        Transaction savedTransaction = transactionRepository.save(transaction);
        notifyTransferSent(sender, receiver, amount);
        notifyTransferReceived(sender, receiver, amount);
        addLoyaltyPointsIfMerchant(sender, receiver, amount, description);

        return savedTransaction;
    }

    @Override
    public List<Transaction> getAccountTransactions(String accountNumber) {
        BankAccount account = bankAccountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Compte introuvable"));

        return transactionRepository.findBySenderAccountOrReceiverAccount(account, account)
                .stream()
                .sorted(Comparator.comparing(Transaction::getTransactionDate).reversed())
                .collect(Collectors.toList());
    }

    @Override
    public List<TransactionResponse> getAccountTransactionsForUser(String accountNumber) {
        BankAccount account = bankAccountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Compte introuvable"));

        return transactionRepository.findBySenderAccountOrReceiverAccount(account, account)
                .stream()
                .sorted(Comparator.comparing(Transaction::getTransactionDate).reversed())
                .map(transaction -> {
                    TransactionResponse response = new TransactionResponse();
                    response.setId(transaction.getId());
                    response.setTransactionReference(transaction.getTransactionReference());
                    response.setType(transaction.getType().name());
                    response.setAmount(transaction.getAmount());
                    response.setDescription(transaction.getDescription());
                    response.setStatus(transaction.getStatus().name());
                    response.setTransactionDate(transaction.getTransactionDate());

                    boolean incoming = transaction.getReceiverAccount() != null
                            && transaction.getReceiverAccount().getId().equals(account.getId());
                    response.setIncoming(incoming);

                    if (incoming) {
                        if (transaction.getSenderAccount() != null && transaction.getSenderAccount().getUser() != null) {
                            response.setOtherAccountNumber(transaction.getSenderAccount().getAccountNumber());
                            response.setOtherUserName(transaction.getSenderAccount().getUser().getPrenom() + " " + transaction.getSenderAccount().getUser().getNom());
                        }
                    } else {
                        if (transaction.getReceiverAccount() != null && transaction.getReceiverAccount().getUser() != null) {
                            response.setOtherAccountNumber(transaction.getReceiverAccount().getAccountNumber());
                            response.setOtherUserName(transaction.getReceiverAccount().getUser().getPrenom() + " " + transaction.getReceiverAccount().getUser().getNom());
                        }
                    }
                    return response;
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public Transaction qrPayment(String senderAccountNumber, String receiverRib, BigDecimal amount, String description) {
        validateAmount(amount);
        BankAccount sender = bankAccountRepository.findByAccountNumber(senderAccountNumber)
                .orElseThrow(() -> new RuntimeException("Compte émetteur introuvable"));

        BankAccount receiver = bankAccountRepository.findByRib(receiverRib)
                .orElseThrow(() -> new RuntimeException("Compte destinataire introuvable"));

        if (sender.getId().equals(receiver.getId())) {
            throw new RuntimeException("Impossible de payer le même compte");
        }

        if (sender.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Solde insuffisant");
        }

        sender.setBalance(sender.getBalance().subtract(amount));
        receiver.setBalance(receiver.getBalance().add(amount));
        bankAccountRepository.save(sender);
        bankAccountRepository.save(receiver);

        Transaction transaction = new Transaction();
        transaction.setTransactionReference(generateReference());
        transaction.setType(TransactionType.QR_PAYMENT);
        transaction.setAmount(amount);
        transaction.setDescription(description);
        transaction.setStatus(TransactionStatus.SUCCESS);
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setSenderAccount(sender);
        transaction.setReceiverAccount(receiver);

        Transaction savedTransaction = transactionRepository.save(transaction);
        notifyQrPaymentReceived(sender, receiver, amount);

        return savedTransaction;
    }

    @Override
    @Transactional
    public Transaction qrPayment(String senderAccountNumber, String receiverRib, BigDecimal amount, String description, Long saleId) {
        return qrPayment(senderAccountNumber, receiverRib, amount, description, saleId, null);
    }

    @Override
    @Transactional
    public Transaction qrPayment(
            String senderAccountNumber,
            String receiverRib,
            BigDecimal amount,
            String description,
            Long saleId,
            String voucherCode
    ) {
        // Autoriser amount = 0 pour les ventes payées intégralement par bon
        if (amount == null || amount.compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Le montant du paiement ne peut pas être négatif");
        }

        if (saleId == null) {
            throw new RuntimeException("Identifiant de vente obligatoire");
        }

        Sale sale = saleRepository.findById(saleId)
                .orElseThrow(() -> new RuntimeException("Vente introuvable"));

        if (sale.getStatus() != SaleStatus.PENDING) {
            throw new RuntimeException("Cette vente n'est plus en attente de paiement");
        }

        if (sale.getTotalAmount() == null) {
            throw new RuntimeException("Montant de vente invalide");
        }

        BankAccount sender = bankAccountRepository.findByAccountNumber(senderAccountNumber)
                .orElseThrow(() -> new RuntimeException("Compte émetteur introuvable"));

        if (sender.getUser() == null) {
            throw new RuntimeException("Client du compte introuvable");
        }

        // Vérification cohérence client (si déjà rattaché)
        if (sale.getClient() != null && sale.getClient().getId() != null
                && !sale.getClient().getId().equals(sender.getUser().getId())) {
            throw new RuntimeException("Cette vente n'appartient pas à ce client");
        }

        LoyaltyReward reward = null;
        BigDecimal voucherAmount = BigDecimal.ZERO;

        if (voucherCode != null && !voucherCode.isBlank()) {
            reward = loyaltyRewardService.validateReward(voucherCode, sender.getUser());

            if (reward.getRewardAmount() == null || reward.getRewardAmount().compareTo(BigDecimal.ZERO) <= 0) {
                throw new RuntimeException("Montant du bon invalide");
            }
            voucherAmount = reward.getRewardAmount().min(sale.getTotalAmount());
        }

        BigDecimal expectedAmount = sale.getTotalAmount().subtract(voucherAmount);
        if (expectedAmount.compareTo(BigDecimal.ZERO) < 0) expectedAmount = BigDecimal.ZERO;

        if (amount.compareTo(expectedAmount) != 0) {
            throw new RuntimeException("Le montant du paiement doit être de " + expectedAmount + " MAD après utilisation du bon");
        }

        BankAccount receiver = bankAccountRepository.findByRib(receiverRib)
                .orElseThrow(() -> new RuntimeException("Compte destinataire introuvable"));

        if (sale.getMerchant() == null || sale.getMerchant().getUser() == null) {
            throw new RuntimeException("Commerçant de la vente introuvable");
        }

        Long merchantUserId = sale.getMerchant().getUser().getId();
        if (receiver.getUser() == null || !receiver.getUser().getId().equals(merchantUserId)) {
            throw new RuntimeException("Le compte destinataire ne correspond pas au commerçant de la vente");
        }

        if (sender.getId().equals(receiver.getId())) {
            throw new RuntimeException("Impossible de payer le même compte");
        }

        if (sender.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Solde insuffisant");
        }

        // VÉRIFICATION ET DÉCRÉMENTATION DU STOCK (Unique endroit)
        sale.getItems().forEach(item -> {
            if (item.getProduct() == null) throw new RuntimeException("Produit invalide dans la vente");
            if (item.getQuantity() == null || item.getQuantity() <= 0) throw new RuntimeException("Quantité invalide");
            
            Integer stock = item.getProduct().getStock();
            if (stock == null || stock < item.getQuantity()) {
                throw new RuntimeException("Stock insuffisant pour le produit : " + item.getProduct().getName());
            }
        });

        // Mouvements bancaires
        sender.setBalance(sender.getBalance().subtract(amount));
        
        // Le commerçant reçoit le TOTAL (Cash + Bon)
        BigDecimal merchantCredit = amount.add(voucherAmount);
        receiver.setBalance(receiver.getBalance().add(merchantCredit));

        bankAccountRepository.save(sender);
        bankAccountRepository.save(receiver);

        // Mise à jour Stock
        sale.getItems().forEach(item -> {
            Product product = item.getProduct();
            int newStock = product.getStock() - item.getQuantity();
            product.setStock(newStock);
            productRepository.save(product);
            notifyIfLowStock(sale.getMerchant(), product, newStock);
        });

        // Utilisation du bon
        if (reward != null) {
            reward = loyaltyRewardService.useRewardForSale(
                    reward.getCode(),
                    sender.getUser(),
                    sale.getMerchant(),
                    sale
            );
            loyaltyService.createMerchantCompensations(
                    reward,
                    sale.getMerchant(),
                    voucherAmount
            );        }

        // Création Transaction
        Transaction transaction = new Transaction();
        transaction.setTransactionReference(generateReference());
        transaction.setType(TransactionType.QR_PAYMENT);
        transaction.setAmount(amount);

        String finalDescription = description != null ? description : "Paiement vente #" + saleId;
        if (reward != null) {
            finalDescription += " | Bon " + reward.getCode() + " (-" + voucherAmount + " MAD)";
        }

        transaction.setDescription(finalDescription);
        transaction.setStatus(TransactionStatus.SUCCESS);
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setSenderAccount(sender);
        transaction.setReceiverAccount(receiver);

        Transaction savedTransaction = transactionRepository.save(transaction);

        // FINALISATION VENTE & RATTACHEMENT CLIENT
        sale.setClient(sender.getUser());
        sale.setVoucherAmount(voucherAmount);
        sale.setVoucherCode(reward != null ? reward.getCode() : null);
        sale.setPaidAmount(amount);
        sale.setStatus(SaleStatus.PAID);

        Sale finalizedSale = saleRepository.saveAndFlush(sale);

        // Notifications & Points
        notifyPaymentConfirmed(finalizedSale, amount);
        notifyOrderConfirmed(finalizedSale);
        notifyClientPaymentSent(finalizedSale, amount);

        if (amount.compareTo(BigDecimal.ZERO) > 0) {
            loyaltyService.earnPoints(
                    sender.getUser(),
                    sale.getMerchant(),
                    amount,
                    "Points gagnés après paiement de la vente #" + saleId
            );
        }

        return savedTransaction;
    }

    private void validateAmount(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Le montant doit être supérieur à zéro");
        }
    }

    private String generateReference() {
        return "TRX-" + LocalDateTime.now().getYear() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private void addLoyaltyPointsIfMerchant(BankAccount sender, BankAccount receiver, BigDecimal amount, String description) {
        if (receiver.getUser() == null) return;
        Long receiverUserId = receiver.getUser().getId();
        Merchant merchant = merchantRepository.findByUserId(receiverUserId).orElse(null);
        if (merchant == null) return;
        loyaltyService.earnPoints(sender.getUser(), merchant, amount, description);
    }

    private void notifyTransferSent(BankAccount sender, BankAccount receiver, BigDecimal amount) {
        User recipient = sender.getUser();
        if (recipient == null) return;
        String toName = receiver.getUser() != null ? receiver.getUser().getPrenom() + " " + receiver.getUser().getNom() : "destinataire";
        Map<String, Object> details = new LinkedHashMap<>();
        details.put("recipient", toName);
        details.put("amount", amount + " MAD");
        notificationService.notify(recipient, NotificationType.PAYMENT, "Argent envoyé", 
                "Virement de " + amount + " MAD envoyé vers " + toName + ".", details, null, null);
    }

    private void notifyTransferReceived(BankAccount sender, BankAccount receiver, BigDecimal amount) {
        User recipient = receiver.getUser();
        if (recipient == null) return;
        String fromName = sender.getUser() != null ? sender.getUser().getPrenom() + " " + sender.getUser().getNom() : "expéditeur";
        Map<String, Object> details = new LinkedHashMap<>();
        details.put("sender", fromName);
        details.put("amount", amount + " MAD");
        notificationService.notify(recipient, NotificationType.PAYMENT, "Argent reçu", 
                "Vous avez reçu " + amount + " MAD de " + fromName + ".", details, null, null);
    }

    private void notifyQrPaymentReceived(BankAccount sender, BankAccount receiver, BigDecimal amount) {
        User recipient = receiver.getUser();
        if (recipient == null) return;
        String fromName = sender.getUser() != null ? sender.getUser().getPrenom() + " " + sender.getUser().getNom() : "client";
        Map<String, Object> details = new LinkedHashMap<>();
        details.put("customer", fromName);
        details.put("amount", amount + " MAD");
        notificationService.notify(recipient, NotificationType.PAYMENT, "Paiement reçu", 
                "Paiement QR de " + amount + " MAD reçu de " + fromName + ".", details, null, null);
    }

    private void notifyPaymentConfirmed(Sale sale, BigDecimal amountPaid) {
        Merchant merchant = sale.getMerchant();
        if (merchant == null || merchant.getUser() == null) return;
        String clientName = sale.getClient() != null ? sale.getClient().getPrenom() + " " + sale.getClient().getNom() : "Client";
        Map<String, Object> details = new LinkedHashMap<>();
        details.put("customer", clientName);
        details.put("amount", amountPaid + " MAD");
        details.put("paymentMethod", "Paiement QR");
        notificationService.notify(merchant.getUser(), NotificationType.PAYMENT, "Paiement client confirmé", 
                "Paiement de " + amountPaid + " MAD reçu de " + clientName + ".", details, null, null);
    }

    private void notifyOrderConfirmed(Sale sale) {
        Merchant merchant = sale.getMerchant();
        if (merchant == null || merchant.getUser() == null) return;
        String clientName = sale.getClient() != null ? sale.getClient().getPrenom() + " " + sale.getClient().getNom() : "Client";
        Map<String, Object> details = new LinkedHashMap<>();
        details.put("customer", clientName);
        details.put("items", sale.getItems().size() + " article(s)");
        details.put("total", sale.getTotalAmount() + " MAD");
        notificationService.notify(merchant.getUser(), NotificationType.ORDERS, "Nouvelle commande reçue", 
                "Commande #" + sale.getId() + " de " + clientName + " - " + sale.getTotalAmount() + " MAD.", 
                details, "Voir la commande", "/produits/" + sale.getId());
    }

    private void notifyClientPaymentSent(Sale sale, BigDecimal amountPaid) {
        User client = sale.getClient();
        if (client == null) return;
        Merchant merchant = sale.getMerchant();
        String merchantName = "commerçant";
        if (merchant != null) {
            if (merchant.getCompanyName() != null && !merchant.getCompanyName().isBlank()) {
                merchantName = merchant.getCompanyName();
            } else if (merchant.getUser() != null) {
                merchantName = merchant.getUser().getPrenom() + " " + merchant.getUser().getNom();
            }
        }
        Map<String, Object> details = new LinkedHashMap<>();
        details.put("merchant", merchantName);
        details.put("amount", amountPaid + " MAD");
        details.put("saleId", sale.getId());
        details.put("paymentMethod", "Paiement QR");
        notificationService.notify(client, NotificationType.PAYMENT, "Paiement envoyé", 
                "Votre paiement de " + amountPaid + " MAD à " + merchantName + " a été effectué avec succès.", 
                details, "Voir le ticket", "/tickets");
    }

    private void notifyIfLowStock(Merchant merchant, Product product, int newStock) {
        if (merchant == null || merchant.getUser() == null) return;
        if (newStock > LOW_STOCK_THRESHOLD) return;
        Map<String, Object> details = new LinkedHashMap<>();
        details.put("productName", product.getName());
        details.put("currentStock", newStock + " unités");
        if (newStock <= 0) {
            notificationService.notify(merchant.getUser(), NotificationType.STOCK, "Produit en rupture de stock", 
                    "Le produit \"" + product.getName() + "\" est maintenant en rupture de stock.", 
                    details, "Réapprovisionner", "/produits/" + product.getId());
        } else {
            notificationService.notify(merchant.getUser(), NotificationType.STOCK, "Stock faible", 
                    "Le produit \"" + product.getName() + "\" a un stock critique (" + newStock + " unités).", 
                    details, "Voir le produit", "/produits/" + product.getId());
        }
    }
}