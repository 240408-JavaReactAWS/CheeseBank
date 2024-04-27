package com.cheesebank.controller;

import com.cheesebank.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/history")
@CrossOrigin(origins = "http://localhost:3000")
public class TransactionHistory {

    private final TransactionService ths;
    @Autowired
    public TransactionHistory(TransactionService ths) {
        this.ths = ths;
    }

    @GetMapping("/transaction")
    public ResponseEntity<List<com.cheesebank.model.TransactionHistory>> viewTransaction(@RequestParam String username) {
        List<com.cheesebank.model.TransactionHistory> th = ths.getAllTranByUsername(username);

        return ResponseEntity.ok(th);
    }


}
