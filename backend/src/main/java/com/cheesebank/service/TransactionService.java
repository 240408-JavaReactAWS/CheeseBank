package com.cheesebank.service;

import com.cheesebank.exception.UserNotFoundException;
import com.cheesebank.exception.InsufficientBalanceException;
import com.cheesebank.exception.AccountFrozenException;
import com.cheesebank.exception.InvalidTransferRecipientException;
import com.cheesebank.model.Transaction;
import com.cheesebank.model.TransactionType;
import com.cheesebank.model.User;
import com.cheesebank.repository.TransactionRepository;
import com.cheesebank.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;

    private final UserRepository userRepository;

    private final EmailService emailService;

    @Autowired
    public TransactionService(TransactionRepository transactionRepository, UserRepository userRepository, EmailService emailService) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    // Withdrawal, deposit, or transfer
    @Transactional()
    public void createTransaction(Transaction transaction) throws UserNotFoundException, InsufficientBalanceException, AccountFrozenException, InvalidTransferRecipientException {
        int userId = transaction.getUser().getId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        if (user.getFrozen()) {
            emailService.sendFrozenAccountEmail(user);
            throw new AccountFrozenException("Account is frozen");
        }

        // Withdrawal
        if (transaction.getTransactionType() == TransactionType.WITHDRAWAL) {
            if (user.getBalance().compareTo(transaction.getAmount()) < 0) {
                emailService.sendInsufficientBalanceEmail(user, transaction);
                throw new InsufficientBalanceException("Insufficient balance");
            }
            user.setBalance(user.getBalance().subtract(transaction.getAmount()));
            transaction.setResultBalance(user.getBalance());
            // Deposit
        } else if (transaction.getTransactionType() == TransactionType.DEPOSIT) {
            user.setBalance(user.getBalance().add(transaction.getAmount()));
            transaction.setResultBalance(user.getBalance());
            // Transfer
        } else if (transaction.getTransactionType() == TransactionType.TRANSFER) {
            if (user.getBalance().compareTo(transaction.getAmount()) < 0) {
                emailService.sendInsufficientBalanceEmail(user, transaction);
                throw new InsufficientBalanceException("Insufficient balance");
            }
            if (userId == transaction.getTargetAccount()) {
                throw new InvalidTransferRecipientException("Transfers can't be sent to yourself");
            }
            user.setBalance(user.getBalance().subtract(transaction.getAmount()));
            if (user.getBalance().compareTo(BigDecimal.valueOf(100)) < 0) {
                emailService.sendLowBalanceEmail(user);
            }
            transaction.setResultBalance(user.getBalance());

            User targetUser = userRepository.findById(transaction.getTargetAccount())
                    .orElseThrow(() -> new UserNotFoundException("Recipient not found"));
            targetUser.setBalance(targetUser.getBalance().add(transaction.getAmount()));

            // Mirror transfer transaction for recipient
            Transaction targetTransaction = new Transaction();
            targetTransaction.setTransactionType(TransactionType.RECEIVE);
            targetTransaction.setAmount(transaction.getAmount());
            targetTransaction.setDescription(user.getFirstName() + " " + user.getLastName() + ": \"" + transaction.getDescription() + "\"");
            targetTransaction.setTimeStamp(LocalDateTime.now());
            targetTransaction.setTargetAccount(user.getId());
            targetTransaction.setResultBalance(targetUser.getBalance());
            targetTransaction.setUser(targetUser);
            transactionRepository.save(targetTransaction);
            emailService.sendTransferReceivedEmail(user, targetUser, targetTransaction);
        }

        transaction.setUser(user);
        emailService.sendTransactionEmail(user, transaction);
        transactionRepository.save(transaction);
    }

    // View transaction history
    @Transactional(readOnly = true)
    public Page<Transaction> getAllTransactions(User currentUser, Pageable pageable) {
        return transactionRepository.findByUser(currentUser, pageable);
    }

    // View all transactions of a time range
    @Transactional(readOnly = true)
    public Page<Transaction> getTransactionsByTimeRange(User currentUser, LocalDateTime start, LocalDateTime end, Pageable pageable) {
        return transactionRepository.findByUserAndTimeStampBetween(currentUser, start, end, pageable);
    }

    // View all transactions of a type
    @Transactional(readOnly = true)
    public Page<Transaction> getTransactionsByType(User currentUser, TransactionType transactionType, Pageable pageable) {
        return transactionRepository.findByUserAndTransactionType(currentUser, transactionType, pageable);
    }

}