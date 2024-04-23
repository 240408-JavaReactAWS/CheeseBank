package com.cheesebank.services;

import com.cheesebank.models.TransactionHistory;
import com.cheesebank.repository.TransactionHistoryRepo;
import org.springframework.stereotype.Service;

@Service
public class TransactionHistoryService {

    private TransactionHistoryRepo thr;

    public TransactionHistoryService(TransactionHistoryRepo thr) {
        this.thr = thr;
    }

    public void logTransaction(TransactionHistory newTransaction) {

        thr.save(newTransaction);

    }
}
