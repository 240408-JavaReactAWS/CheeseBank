package com.cheesebank.services;

import com.cheesebank.repository.TransactionRepository;
import com.cheesebank.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;
    private UserRepository userRepo;
    private TransactionRepository transactionHistoryRepo;

    @Autowired
    public EmailService(JavaMailSender javaMailSender, UserRepository userRepo, TransactionRepository transactionHistoryRepo) {
        this.javaMailSender = javaMailSender;
        this.userRepo = userRepo;
        this.transactionHistoryRepo = transactionHistoryRepo;
    }

    @Async
    public void sendEmail(String to,String subject, String text){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        javaMailSender.send(message);
    }
}