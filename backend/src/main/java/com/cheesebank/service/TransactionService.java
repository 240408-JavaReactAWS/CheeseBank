package com.cheesebank.service;

import com.cheesebank.exception.UserNotFoundException;
import com.cheesebank.exception.InsufficientBalanceException;
import com.cheesebank.exception.AccountFrozenException;
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

import java.time.LocalDateTime;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;

    private final UserRepository userRepository;

    private EmailService emailService;

    @Autowired
    public TransactionService(TransactionRepository transactionRepository, UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    // Withdrawal, deposit, or transfer
    @Transactional
    public Transaction createTransaction(Transaction transaction) throws UserNotFoundException, InsufficientBalanceException, AccountFrozenException {
        User user = transaction.getUser();

        if (user.getFrozen()) {
            throw new AccountFrozenException("Account is frozen");
        }

        if (transaction.getTransactionType() == TransactionType.WITHDRAWAL || transaction.getTransactionType() == TransactionType.TRANSFER) {
            if (user.getBalance().compareTo(transaction.getAmount()) < 0) {
                throw new InsufficientBalanceException("Insufficient funds");
            }
        }

        // Transfer to another account
        if (transaction.getTransactionType() == TransactionType.TRANSFER) {
            User targetUser = userRepository.findById(transaction.getTargetAccount())
                    .orElseThrow(() -> new UserNotFoundException("User not found"));

            targetUser.setBalance(targetUser.getBalance().add(transaction.getAmount()));
            userRepository.save(targetUser);
        }

        transaction.setTimeStamp(LocalDateTime.now());
        Transaction savedTransaction = transactionRepository.save(transaction);

        user.setBalance(transaction.getTransactionType() == TransactionType.DEPOSIT
                ? user.getBalance().add(transaction.getAmount())
                : user.getBalance().subtract(transaction.getAmount()));
        userRepository.save(user);
        emailService.sendTransactionEmail(user, savedTransaction);
        return savedTransaction;
    }

    // Find all transactions by user
    @Transactional(readOnly = true)
    public Page<Transaction> getAllTransactions(User currentUser, Pageable pageable) {
        return transactionRepository.findByUser(currentUser, pageable);
    }

    // Find all transactions by user and time range
    @Transactional(readOnly = true)
    public Page<Transaction> getTransactionsByTimeRange(User currentUser, LocalDateTime start, LocalDateTime end, Pageable pageable) {
        return transactionRepository.findByUserAndTimeStampBetween(currentUser, start, end, pageable);
    }

    // Find all transactions by user and transaction type
    @Transactional(readOnly = true)
    public Page<Transaction> getTransactionsByType(User currentUser, TransactionType transactionType, Pageable pageable) {
        return transactionRepository.findByUserAndTransactionType(currentUser, transactionType, pageable);
    }
}