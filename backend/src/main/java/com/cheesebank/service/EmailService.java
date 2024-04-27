package com.cheesebank.service;

import com.cheesebank.model.Transaction;
import com.cheesebank.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private JavaMailSender javaMailSender;

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
        String text = "Dear " + user.getFirstName() + " " + user.getLastName() + ",\n\nA transaction has been made on your account. Details:\n\n" + transaction.toString();
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
}