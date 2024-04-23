package com.cheesebank.controllers;

import com.cheesebank.exceptions.TransactionCannotBeProcessException;
import com.cheesebank.models.TransactionHistory;
import com.cheesebank.models.TransactionType;
import com.cheesebank.models.User;
import com.cheesebank.services.EmailService;
import com.cheesebank.services.TransactionHistoryService;
import com.cheesebank.services.UserService;
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

    public UserController(UserService userService, TransactionHistoryService ths, EmailService emailService) {
        this.userService = userService;
        this.ths = ths;
        this.emailService = emailService;
    }

    @PostMapping("/transaction")
    public ResponseEntity<TransactionHistory> deposit
            (@RequestParam int userId,
             @RequestParam double amount,
             @RequestParam String email,
             @RequestParam String description,
             @RequestParam TransactionType type){

        User user = userService.findByUserId(userId);

        double newBalance = user.getBalance();

       if(type.equals(TransactionType.DEPOSIT)){
            newBalance = user.getBalance() + amount;
           user.setBalance(newBalance);
           emailService.sendEmail(email,"Deposit Notification","Dear Customer " +"\n \n"+"$"+amount+ " has been deposited to your account"+"\n \nCheese Bank");
       }

        if(type.equals(TransactionType.WITHDRAWAL)){
             newBalance = user.getBalance() - amount;
            if(newBalance < 0){
                emailService.sendEmail(email,"Insufficient funds Notification","Dear Customer " +"\n \n"+ "You cannot withdraw from your account because you have you have insufficient "+"\n \nCheese Bank");
                throw new TransactionCannotBeProcessException("You cannot withdraw the " +amount+" due to insufficient funds");

            }
            user.setBalance(newBalance);
            emailService.sendEmail(email,"Withdrawal Notification","Dear Customer " +"\n \n"+"$"+amount+ " has been withdrawn from your account"+"\n \nCheese Bank");

        }

        userService.updateUser(user);

        TransactionHistory newTransaction = new TransactionHistory();
        newTransaction.setType(type);
        newTransaction.setDescription(description);
        newTransaction.setTransaction_amount(amount);
        newTransaction.setTimeStamp(LocalDateTime.now());
        newTransaction.setCurrent_balance(newBalance);
        newTransaction.setUser(user);

        ths.logTransaction(newTransaction);

        return ResponseEntity.status(HttpStatus.OK).body(newTransaction);

    }
}
