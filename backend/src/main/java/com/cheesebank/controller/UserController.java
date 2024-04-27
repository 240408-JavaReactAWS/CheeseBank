package com.cheesebank.controllers;

import com.cheesebank.exceptions.TransactionCannotBeProcessException;
import com.cheesebank.models.User;
import com.cheesebank.services.EmailService;
import com.cheesebank.services.TransactionHistoryService;
import com.cheesebank.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("api/v1/user")
@CrossOrigin(origins = "http://localhost:3000")
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



    @GetMapping("/username")
    public ResponseEntity<User> getUserByUsername(@RequestParam String username) {
        User user = userService.findByUsername(username);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/transfer")
    public ResponseEntity<TransactionHistory> transfer(
            @RequestParam double amount,
            @RequestParam String emailFrom,
            @RequestParam String emailTo,
            @RequestParam String description) {

        User receiver= userService.findByEmail(emailTo);
        User sender = userService.findByEmail(emailFrom);
        double senderBalance = sender.getBalance();
        double receiverBalance = receiver.getBalance();

        boolean isSameEmail = emailFrom.equals(emailTo) ? true : false;
        if (isSameEmail) {
            emailService.sendEmail(emailFrom, "Transfer Notification Error", "Dear "+ sender.getFirst_name() +","+ "\n\nYou cannot transfer to your own account.\n\nCheese Bank");
            throw new TransactionCannotBeProcessException("You cannot transfer to your own account");
        }

        if (senderBalance < amount) {
            emailService.sendEmail(emailFrom, "Insufficient Funds Notification", "Dear "+ sender.getFirst_name() +","+ "\n\nYou cannot transfer $" + amount + " due to insufficient funds.\n\nCheese Bank");
            throw new TransactionCannotBeProcessException("You cannot transfer $" + amount + " due to insufficient funds");
        }


        sender.setBalance(senderBalance - amount);
        receiver.setBalance(receiverBalance + amount);

        if((senderBalance - amount) < 100){
            emailService.sendEmail(emailFrom, "Low Balance Notification", "Dear "+ sender.getFirst_name() +","+ "\n\n" + "Your balance is below the maintaining limit.\n\nPlease deposit to your account within 7 days to avoid penalties\n\nCheese Bank");
        }
        userService.updateUser(sender);
        userService.updateUser(receiver);

        emailService.sendEmail(emailFrom, "Transfer Notification", "Dear "+ sender.getFirst_name() +","+ "\n\n$" + amount + " has been transferred from your account.\n\nCheese Bank");
        emailService.sendEmail(emailTo, "Transfer Notification", "Dear "+ receiver.getFirst_name() +","+ "\n\n$" + amount + " has been transferred to your account.\n\nCheese Bank");

        TransactionHistory th = ths.logTransaction("TRANSFER",description,amount, senderBalance,sender);
       ths.logTransaction("TRANSFER",description,amount, receiverBalance,receiver);


        return ResponseEntity.status(HttpStatus.OK).body(th);
    }

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
            emailService.sendEmail(email, "Deposit Notification", "Dear "+ user.getFirst_name() +","+ "\n\n$" + amount + " has been deposited to your account.\n\nCheese Bank");
        } else if ("WITHDRAWAL".equals(type)) {
            if (currentBalance < amount) {
                emailService.sendEmail(email, "Insufficient Funds Notification", "Dear "+ user.getFirst_name() +","+ "\n\nYou cannot withdraw from your account due to insufficient funds.\n\nCheese Bank");
                throw new TransactionCannotBeProcessException("You cannot withdraw $" + amount + " due to insufficient funds");
            }
            user.setBalance(currentBalance - amount);

            if((currentBalance - amount)  < 100){
                emailService.sendEmail(email, "Low Balance Notification", "Dear "+ user.getFirst_name() +","+ "\n\n" + "Your balance is below the maintaining limit.\n\nPlease deposit to your account within 7 days to avoid penalties\n\nCheese Bank");
            }
            emailService.sendEmail(email, "Withdrawal Notification", "Dear "+ user.getFirst_name() +","+ "\n\n$" + amount + " has been withdrawn from your account.\n\nCheese Bank");
        } else {
            throw new IllegalArgumentException("Invalid transaction type: " + type);
        }

        userService.updateUser(user);

        TransactionHistory th = ths.logTransaction(type,description,amount, currentBalance,user);

        return ResponseEntity.status(HttpStatus.OK).body(th);
    } //note from sav: this brace corresponds to the one on ln 58, "@RequestParam String type) {". if this was not intentional, this may cause compile issues


    //SAV USER STORIES
    //User story 1: As a user, I can register my account.
    //note code mostly copied from my proj0
    @PostMapping
    public ResponseEntity<User> createUserHandler(@RequestBody User user) {

        User newUser;
        try {
            newUser = this.userService.createUserAccount(user);
        }
        catch (Exception e) {
            return new ResponseEntity<User>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<User>(user, HttpStatus.CREATED);
    }

    //User story 2: As a user, I can log in to my account.
    //note code mostly copied from my proj0
    @PostMapping("/login")
    public ResponseEntity<User> userLoginHandler(@RequestBody User user) {
       Optional<User> optionalUser = userService.findUserByUsernameAndPassword(user.getUsername(), user.getPassword());

        if (optionalUser.isPresent()) {
            return new ResponseEntity<>(optionalUser.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }



    //User story 3: As a user, I can update my personal information such as name,email, and phone number.
    @PutMapping({"/update"})
    public ResponseEntity<User> updateUserInfo(@RequestBody User user){
        //validate user entity. if user exists, then can update it
        User updatedUser;

        try{
            updatedUser = this.userService.updateUser(user);
        }
        catch (Exception e) {
            return new ResponseEntity<User>(HttpStatus.UNAUTHORIZED);
        }


        return new ResponseEntity<User>(updatedUser, HttpStatus.OK);
    }
}
