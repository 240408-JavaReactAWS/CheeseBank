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

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

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

    // Withdrawal, deposit
    @Transactional(rollbackFor = {UserNotFoundException.class, InsufficientBalanceException.class, AccountFrozenException.class})
    public void createTransaction(Transaction transaction) throws UserNotFoundException, InsufficientBalanceException, AccountFrozenException {
        int userId = transaction.getUser().getId();

        // Retrieve user from the database
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        // Check if user account is frozen
        if (user.getFrozen()) {
            throw new AccountFrozenException("Account is frozen");
        }
        BigDecimal amount = transaction.getAmount();
        BigDecimal currentBalance;

        // Process transaction based on type
        if (transaction.getTransactionType() == TransactionType.WITHDRAWAL) {
            // Check if user has sufficient balance
            if (user.getBalance().compareTo(amount) < 0) {
                emailService.sendInsufficientBalanceEmail(user, amount);
                throw new InsufficientBalanceException("Insufficient balance");
            }
            user.setBalance(user.getBalance().subtract(amount));
            currentBalance = user.getBalance();
            emailService.sendWithdrawEmail(user, amount);
        } else if (transaction.getTransactionType() == TransactionType.DEPOSIT) {
            user.setBalance(user.getBalance().add(amount));
            currentBalance = user.getBalance();
            emailService.sendDepositEmail(user, amount);
        } else {
            throw new IllegalArgumentException("Invalid transaction type");
        }

        // Update user's balance and save transaction
        transaction.setCurentBalance(currentBalance);
        transaction.setUser(user);
        userRepository.save(user);
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

    public List<Transaction> findAllByUserUsername(User searchedUser) {
        List<Transaction> list = transactionRepository.findAllByUserUsername(searchedUser.getUsername());
        Collections.sort(list, new Comparator<Transaction>() {
            @Override
            public int compare(Transaction t1, Transaction t2) {
                return t2.getTimeStamp().compareTo(t1.getTimeStamp());
            }
        });
        return list;
    }

    @Transactional()
    public Transaction CreateTransfer(String senderEmail, String ReceiverEmail, Transaction transaction) {

        User sender = userRepository.findByEmail(senderEmail).orElseThrow();
        User receiver = userRepository.findByEmail(ReceiverEmail).orElseThrow();

        if(sender.getEmail().equals(receiver.getEmail())) {
            throw new IllegalArgumentException("Cannot transfer to yourself");
        } else if(sender.getBalance().compareTo(transaction.getAmount()) < 0) {
            emailService.sendInsufficientBalanceEmail(sender, transaction.getAmount());
            throw new IllegalArgumentException("Insufficient balance");
        }

        BigDecimal amount = transaction.getAmount();
        sender.setBalance(sender.getBalance().subtract( amount ));
        receiver.setBalance(receiver.getBalance().add( amount ));
        userRepository.save(sender);
        userRepository.save(receiver);

        Transaction transaction1 = new Transaction();
        transaction1.setTransactionType(TransactionType.TRANSFER);
        transaction1.setCurentBalance(sender.getBalance());
        transaction1.setDescription(transaction.getDescription());
        transaction1.setAmount(amount);
        transaction1.setUser(sender);
        transaction1.setTimeStamp(LocalDateTime.now());
        transaction1.setTargetAccount(sender.getId());
        transactionRepository.save(transaction1);
        emailService.sendTransferEmailToSender(sender, amount, receiver.getEmail());

        Transaction transaction2 = new Transaction();
        transaction2.setTransactionType(TransactionType.TRANSFER);
        transaction2.setUser(receiver);
        transaction2.setDescription(transaction.getDescription());
        transaction2.setCurentBalance(receiver.getBalance());
        transaction2.setAmount(amount);
        transaction2.setTimeStamp(LocalDateTime.now());
        transaction2.setTargetAccount(receiver.getId());
        transactionRepository.save(transaction2);
        emailService.sendTransferEmailToReceiver(receiver, amount, sender.getEmail());

//        if(sender.getBalance().compareTo(BigDecimal.ZERO) < 100){
//            emailService.sendLowBalanceEmail(sender);
//        }
        return transaction;
    }

}