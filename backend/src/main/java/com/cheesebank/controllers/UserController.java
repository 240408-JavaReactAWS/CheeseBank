package com.cheesebank.controllers;

import com.cheesebank.exceptions.TransactionCannotBeProcessException;
import com.cheesebank.models.TransactionHistory;
import com.cheesebank.models.TransactionType;
import com.cheesebank.models.User;
import com.cheesebank.services.EmailService;
import com.cheesebank.services.TransactionHistoryService;
import com.cheesebank.services.UserService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("api/v1/user")
public class UserController {

    private UserService userService;
    private TransactionHistoryService ths;
    private EmailService emailService;

    @Autowired
    public UserController(UserService userService, TransactionHistoryService ths, EmailService emailService) {
        this.userService = userService;
        this.ths = ths;
        this.emailService = emailService;
    }

    // Matthew code ////////////////////////////////////////
    @GetMapping("/balance")
    public ResponseEntity<User> getBalance(@RequestParam int userId) {
        User user = userService.findByUserId(userId);
        double currentBalance = user.getBalance();

        return ResponseEntity.ok(user);
    }

    @PostMapping("/freeze")
    public ResponseEntity<User> freezeAccount(@RequestParam int userId) {
        User user = userService.findByUserId(userId);
        user.setFrozen(!user.isFrozen());
        userService.save(user);

        return ResponseEntity.ok(user);
    }
    ////////////////////////////////////////////////////////

    @PostMapping("/transaction")
    public ResponseEntity<TransactionHistory> deposit(
            @RequestParam int userId,
            @RequestParam double amount,
            @RequestParam String email,
            @RequestParam String description,
            @RequestParam String type) {

        User user = userService.findByUserId(userId);
        double currentBalance = user.getBalance();

        if ("DEPOSIT".equals(type)) {
            user.setBalance(currentBalance + amount);
            emailService.sendEmail(email, "Deposit Notification", "Dear Customer,\n\n$" + amount + " has been deposited to your account.\n\nCheese Bank");
        } else if ("WITHDRAWAL".equals(type)) {
            if (currentBalance < amount) {
                emailService.sendEmail(email, "Insufficient Funds Notification", "Dear Customer,\n\nYou cannot withdraw from your account due to insufficient funds.\n\nCheese Bank");
                throw new TransactionCannotBeProcessException("You cannot withdraw $" + amount + " due to insufficient funds");
            }
            user.setBalance(currentBalance - amount);
            emailService.sendEmail(email, "Withdrawal Notification", "Dear Customer,\n\n$" + amount + " has been withdrawn from your account.\n\nCheese Bank");
        } else {
            throw new IllegalArgumentException("Invalid transaction type: " + type);
        }

        userService.updateUser(user);

        TransactionHistory th = ths.logTransaction(type,description,amount, currentBalance,user);

        return ResponseEntity.status(HttpStatus.OK).body(th);
    }
}
