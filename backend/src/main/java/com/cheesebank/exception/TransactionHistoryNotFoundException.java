package com.cheesebank.exception;

public class TransactionHistoryNotFoundException extends RuntimeException {
    public TransactionHistoryNotFoundException(String s) {
        super(s);
    }
}
