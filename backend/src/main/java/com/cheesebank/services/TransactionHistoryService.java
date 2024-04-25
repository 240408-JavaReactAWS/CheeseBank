package com.cheesebank.services;

import com.cheesebank.exceptions.TransactionHistoryNotFoundException;
import com.cheesebank.models.TransactionHistory;
import com.cheesebank.models.TransactionType;
import com.cheesebank.models.User;
import com.cheesebank.repository.TransactionHistoryRepo;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionHistoryService {

    private final TransactionHistoryRepo thr;

    public TransactionHistoryService(TransactionHistoryRepo thr) {
        this.thr = thr;
    }



    public TransactionHistory logTransaction(String type, String description, double amount, double currentBalance, User user) {
        TransactionHistory newTransaction = new TransactionHistory();
        newTransaction.setType(TransactionType.valueOf(type));
        newTransaction.setDescription(description);
        newTransaction.setTransaction_amount(amount);
        newTransaction.setTimeStamp(LocalDateTime.now());
        newTransaction.setCurrent_balance(user.getBalance());
        newTransaction.setUser(user);
        thr.save(newTransaction);

        return newTransaction;
    }

    public List<TransactionHistory> getAllTranByUserId(int userId) {
        List<TransactionHistory> list = thr.findAllByUserId(userId);
        if(list.isEmpty() || list == null ){
            throw new TransactionHistoryNotFoundException("No transaction history was not found");
        }
        return list;
    }

}
