package com.cheesebank.controller;

import com.cheesebank.exception.*;
import com.cheesebank.model.Transaction;
import com.cheesebank.model.TransactionType;
import com.cheesebank.model.User;
import com.cheesebank.model.UserType;
import com.cheesebank.service.TransactionService;
import com.cheesebank.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(
        origins = "${frontend.url}",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE},
        allowCredentials = "true"
)
public class TransactionController {

    private final TransactionService transactionService;

    private final UserService userService;

    @Autowired
    public TransactionController(TransactionService transactionService, UserService userService) {
        this.transactionService = transactionService;
        this.userService = userService;
    }

    // Withdrawal
    @PostMapping("/withdrawal")
    public ResponseEntity<Transaction> withdrawal(@RequestBody Transaction transaction, HttpSession session) throws UserNotFoundException, InsufficientBalanceException, AccountFrozenException {
        User sessionUser = (User) session.getAttribute("user");
        if (sessionUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        transaction.setTransactionType(TransactionType.WITHDRAWAL);
        transaction.setUser(sessionUser);
        transaction.setAmount(transaction.getAmount());
        transaction.setTargetAccount(sessionUser.getId());
        transaction.setCurentBalance(sessionUser.getBalance().subtract(transaction.getAmount()));
        transaction.setTimeStamp(LocalDateTime.now());
        transactionService.createTransaction(transaction);
        System.out.println("Successfully withdrew " + transaction.getAmount() + " from your account");
        return ResponseEntity.status(HttpStatus.CREATED).body(transaction);
    }

    // Deposit
    @PostMapping("/deposit")
    public ResponseEntity<Transaction> deposit(@RequestBody Transaction transaction, HttpSession session) throws UserNotFoundException, AccountFrozenException, InsufficientBalanceException {
        User sessionUser = (User) session.getAttribute("user");
        if (sessionUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        transaction.setTransactionType(TransactionType.DEPOSIT);
        transaction.setUser(sessionUser);
        transaction.setAmount(transaction.getAmount());
        transaction.setTargetAccount(sessionUser.getId());
        transaction.setTimeStamp(LocalDateTime.now());
        transaction.setCurentBalance(sessionUser.getBalance().add(transaction.getAmount()));
        transactionService.createTransaction(transaction);
        System.out.println("Successfully deposited " + transaction.getAmount() + " into your account");
        return ResponseEntity.status(HttpStatus.CREATED).body(transaction);
    }

    // Transfer
//    @PostMapping("/transfer")
//    public ResponseEntity<Transaction> transfer(@RequestBody Transaction transaction, HttpSession session) throws UserNotFoundException, InsufficientBalanceException, AccountFrozenException {
//        User sessionUser = (User) session.getAttribute("user");
//        if (sessionUser == null) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//        }
//
//        if (sessionUser.getBalance().compareTo(transaction.getAmount()) < 0) {
//            System.out.println("Insufficient funds");
//            throw new InsufficientBalanceException("Insufficient balance");
//        }
//
//        User targetUser = userService.findById(transaction.getTargetAccount());
//        if (targetUser == null) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(transaction);
//        }
//
//        transaction.setTransactionType(TransactionType.TRANSFER);
//        transaction.setUser(sessionUser);
//        transaction.setTimeStamp(LocalDateTime.now());
//        transactionService.createTransaction(transaction);
//        System.out.println("Successfully transferred " + transaction.getAmount() + " to " + targetUser.getFirstName() + " " + targetUser.getLastName() + "'s account");
//        return ResponseEntity.status(HttpStatus.CREATED).body(transaction);
//    }

    @PostMapping("/transfer/{emailTo}")
    public ResponseEntity<Transaction> transfer(@PathVariable String emailTo, @RequestBody Transaction transaction, HttpSession session) throws UserNotFoundException, InsufficientBalanceException, AccountFrozenException{

        User sender = (User) session.getAttribute("user");
        if (sender == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        Transaction th = transactionService.CreateTransfer(sender.getEmail(),emailTo, transaction);
        return ResponseEntity.status(HttpStatus.OK).body(th);
    }




    // View transaction history
    @GetMapping("/history")
    public ResponseEntity<Page<Transaction>> viewTransactionHistory(HttpSession session, Pageable pageable) {
        User sessionUser = (User) session.getAttribute("user");
        if (sessionUser == null) {
            System.out.println("Unauthorized access");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Page<Transaction> transactionHistory = transactionService.getAllTransactions(sessionUser, pageable);
        if (transactionHistory.isEmpty()) {
            System.out.println("No transactions found");
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }

        System.out.println("Successfully retrieved past transactions");
        return ResponseEntity.ok(transactionHistory);
    }

    // View transaction history of any user (ADMIN ONLY)
//    @GetMapping("/history/{username}")
//    public ResponseEntity<Page<Transaction>> viewTransactionHistoryByUsername(@PathVariable String username, HttpSession session, Pageable pageable) throws UserNotFoundException {
//        User sessionUser = (User) session.getAttribute("user");
//        if (sessionUser == null) {
//            System.out.println("Unauthorized access");
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//        }
//
//        Optional<User> user = userService.findByUsername(username);
//        if (user.isEmpty()) {
//            System.out.println("User not found");
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
//        }
//
//        User searchedUser = user.get();
//        System.out.println("Successfully retrieved " + searchedUser.getFirstName() + " " + searchedUser.getLastName() + "'s past transactions");
//        return ResponseEntity.ok(transactionService.getAllTransactions(searchedUser, pageable));
//    }

    @GetMapping("/history/{username}")
    public ResponseEntity<List<Transaction>> viewTransactionHistoryByUsername(@PathVariable String username, HttpSession session, Pageable pageable) throws UserNotFoundException {

        Optional<User> user = userService.findByUsername(username);
        if (user.isEmpty()) {
            System.out.println("User not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        User sessionUser = (User) session.getAttribute("user");
        if (sessionUser == null) {
            System.out.println("Unauthorized access");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        User searchedUser = user.get();
        System.out.println("Successfully retrieved " + searchedUser.getFirstName() + " " + searchedUser.getLastName() + "'s past transactions");
        return ResponseEntity.ok((List<Transaction>) transactionService.findAllByUserUsername(searchedUser));
    }

    // View all transactions of a time range
    @GetMapping("/history/range/{startDate}/{endDate}")
    public ResponseEntity<Page<Transaction>> filterByTimeRange(@PathVariable LocalDateTime startDate, @PathVariable LocalDateTime endDate, HttpSession session, Pageable pageable) {
        User sessionUser = (User) session.getAttribute("user");
        if (sessionUser == null) {
            System.out.println("Unauthorized access");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        System.out.println("Successfully retrieved past transactions from " + startDate + " to " + endDate);
        return ResponseEntity.ok(transactionService.getTransactionsByTimeRange(sessionUser, startDate, endDate, pageable));
    }

    // View all transactions of a type
    @GetMapping("/history/type/{type}")
    public ResponseEntity<Page<Transaction>> filterByType(@PathVariable String type, HttpSession session, Pageable pageable) {
        User sessionUser = (User) session.getAttribute("user");
        if (sessionUser == null) {
            System.out.println("Unauthorized access");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        TransactionType transactionType = TransactionType.valueOf(type.toUpperCase());
        System.out.println("Successfully retrieved past " + type + "s");
        return ResponseEntity.ok(transactionService.getTransactionsByType(sessionUser, transactionType, pageable));
    }

}