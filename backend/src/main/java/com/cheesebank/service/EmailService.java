package com.cheesebank.service;

import com.cheesebank.model.Transaction;
import com.cheesebank.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class EmailService {

    private final JavaMailSender javaMailSender;

    @Autowired
    public EmailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    @Async
    public void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        javaMailSender.send(message);
    }

    public void sendTransactionEmail(User user, Transaction transaction) {
        String subject = "Transaction Notification";
        String text = "Dear " + user.getFirstName() + " " + user.getLastName() + ",\n\nA transaction has been made on your account. \n\nDetails:\n" + "Transaction Type: " + transaction.getTransactionType() + "\nAmount: " + transaction.getAmount() + "\nDescription: " + transaction.getDescription() + "\nTime Stamp: " + transaction.getTimeStamp() + "\nTarget Account: " + transaction.getTargetAccount() + "\nResult Balance: " + transaction.getTransactionType() + "\nTransaction Amount: " + transaction.getAmount() + "\nDescription: " + transaction.getDescription() + "\nTime Stamp: " + transaction.getTimeStamp() + "\nTarget Account: " + transaction.getTargetAccount() + "\nDescription: " + transaction.getDescription();
        sendEmail(user.getEmail(), subject, text);
    }

    public void sendAccountUpdateEmail(User user) {
        String subject = "Account Update Notification";
        String text = "Dear " + user.getFirstName() + " " + user.getLastName() + ",\n\nYour account information has been updated.";
        sendEmail(user.getEmail(), subject, text);
    }

    public void sendPasswordChangeEmail(User user) {
        String subject = "Password Change Notification";
        String text = "Dear " + user.getFirstName() + " " + user.getLastName() + ",\n\nYour password has been changed.";
        sendEmail(user.getEmail(), subject, text);
    }

    public void sendInsufficientBalanceEmail(User user, BigDecimal amount) {
        String subject = "Insufficient Balance";
        String text = "Dear "+ user.getFirstName() +","+ "\n\nYou cannot withdraw or transfer $" + amount + " due to insufficient funds.\n\nCheese Bank";
        sendEmail(user.getEmail(), subject, text);
    }

    public void sendTransferEmailToSender(User user, BigDecimal amount, String emailTo) {
        String subject = "Transfer Notification";
        String text = "Dear "+ user.getFirstName() +","+ "\n\nYou have successfully transferred $" + amount + " to " + emailTo + ".\n\nCheese Bank";
        sendEmail(user.getEmail(), subject, text);
    }

    public void sendTransferEmailToReceiver(User user, BigDecimal amount, String emailFrom) {
        String subject = "Transfer Notification";
        String text = "Dear "+ user.getFirstName() +","+ "\n\nYou have received a transfer of $" + amount + " from " + emailFrom + ".\n\nCheese Bank";
        sendEmail(user.getEmail(), subject, text);
    }

    public void sendDepositEmail(User user, BigDecimal amount) {
        String subject = "Deposit Notification";
        String text = "Dear "+ user.getFirstName() +","+ "\n\nYou have successfully deposited $" + amount + " to your account.\n\nCheese Bank";
        sendEmail(user.getEmail(), subject, text);
    }
    public void sendWithdrawEmail(User user, BigDecimal amount) {
        String subject = "Withdraw Notification";
        String text = "Dear "+ user.getFirstName() +","+ "\n\nYou have successfully withdrawn $" + amount + " from your account.\n\nCheese Bank";
        sendEmail(user.getEmail(), subject, text);
    }

    public void sendLowBalanceEmail(User user) {
        String subject = "Low Balance";
        String text = "Dear "+ user.getFirstName() +","+ "\n\nYour account balance is low. Please deposit money to avoid any inconvenience.\n\nCheese Bank";
        sendEmail(user.getEmail(), subject, text);
    }

    public void sendFrozenAccountEmail(User user) {
        String subject = "Account Frozen";
        String text = "Dear "+ user.getFirstName() +","+ "\n\nYour account has been frozen. Please contact customer service for more information.\n\nCheese Bank";
        sendEmail(user.getEmail(), subject, text);
    }
    public void sendPasswordResetEmail(User user) {
        String subject = "Password Reset";
        String text = "Dear "+ user.getFirstName() +","+ "\n\n\n\nPlease click the link to reset your password: http://localhost:3000/reset-password?token=" + user.getToken() + "\n\nCheese Bank";
        sendEmail(user.getEmail(), subject, text);
    }

}