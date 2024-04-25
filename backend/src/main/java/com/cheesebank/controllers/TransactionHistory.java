package com.cheesebank.controllers;

import com.cheesebank.services.TransactionHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/history")
@CrossOrigin(origins = "http://localhost:3000")
public class TransactionHistory {

    private final TransactionHistoryService ths;
    @Autowired
    public TransactionHistory(TransactionHistoryService ths) {
        this.ths = ths;
    }

    @GetMapping("/transaction")
    public ResponseEntity<List<com.cheesebank.models.TransactionHistory>> viewTransaction(@RequestParam int userId) {
        List<com.cheesebank.models.TransactionHistory> th = ths.getAllTranByUserId(userId);
        return ResponseEntity.ok(th);
    }


}
