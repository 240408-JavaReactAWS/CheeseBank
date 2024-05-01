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
        String subject = "Cheese Bank - Recent Transaction";
        String text = "Dear " + user.getFirstName() + " " + user.getLastName() + ",\n\nA transaction has been made on your account. \n\n-----------------------------\nDetails:\n" + "Transaction Type: " + transaction.getTransactionType() + "\nAmount: " + transaction.getAmount() + "\nDescription: " + transaction.getDescription() + "\nTime Stamp: " + transaction.getTimeStamp() + "\nTarget Account: " + transaction.getTargetAccount() + "\nResult Balance: " + transaction.getTransactionType() + "\nTransaction Amount: " + transaction.getAmount() + "\nDescription: " + transaction.getDescription() + "\nTime Stamp: " + transaction.getTimeStamp() + "\nTarget Account: " + transaction.getTargetAccount() + "\nDescription: " + transaction.getDescription() + "\n-----------------------------\n\nIf this transaction does not seem familiar to you, please contact Customer Support immediately.\n\nCheese Bank";
        sendEmail(user.getEmail(), subject, text);
    }

    public void sendAccountUpdateEmail(User user) {
        String subject = "Cheese Bank - Account Information Updated";
        String text = "Dear " + user.getFirstName() + " " + user.getLastName() + ",\n\nYour account information has been updated.\n\nCheese Bank";
        sendEmail(user.getEmail(), subject, text);
    }

    public void sendPasswordChangeEmail(User user) {
        String subject = "Cheese Bank - Password Change";
        String text = "Dear " + user.getFirstName() + " " + user.getLastName() + ",\n\nYour password has been changed. Please contact Customer Support if this was not intended.\n\nCheese Bank";
        sendEmail(user.getEmail(), subject, text);
    }

    public void sendInsufficientBalanceEmail(User user, Transaction transaction) {
        String subject = "Cheese Bank - Insufficient Balance";
        String text = "Dear " + user.getFirstName() + " " + user.getLastName() + ",\n\nYour recent withdrawal or transfer of $" + transaction.getAmount() + " was canceled due to insufficient funds. Deposit money as soon as possible to avoid this issue.\n\nCheese Bank";
        sendEmail(user.getEmail(), subject, text);
    }

    public void sendTransferReceivedEmail(User senderUser, User recipientUser, Transaction transaction) {
        String subject = "Cheese Bank - Transfer Notification";
        String text = "Dear " + recipientUser.getFirstName() + " " + recipientUser.getLastName() + ",\n\nYou have received a transfer of $" + transaction.getAmount() + " from " + senderUser.getFirstName() + " " + senderUser.getLastName() + "with the description: \n" + transaction.getDescription() + ".\n\nCheese Bank";
        sendEmail(recipientUser.getEmail(), subject, text);
    }

    public void sendLowBalanceEmail(User user) {
        String subject = "Cheese Bank - Low Balance";
        String text = "Dear " + user.getFirstName() + " " + user.getLastName() + ",\n\nWe wish to notify you that the balance in your bank account is less than $100, which is the specified amount for this alert.\n\nTo avoid possible fees, make sure you have enough funds in your account. Deposit money as soon as possible.\n\nCheese Bank";
        sendEmail(user.getEmail(), subject, text);
    }

    public void sendFrozenAccountEmail(User user) {
        String subject = "Cheese Bank - Account Frozen";
        String text = "Dear " + user.getFirstName() + " " + user.getLastName() + ",\n\nYour account has been frozen. Please contact Customer Support for more information.\n\nCheese Bank";
        sendEmail(user.getEmail(), subject, text);
    }

}