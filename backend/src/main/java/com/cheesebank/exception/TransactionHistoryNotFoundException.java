package com.cheesebank.exceptions;

public class TransactionHistoryNotFoundException extends RuntimeException {
    public TransactionHistoryNotFoundException(String s) {
        super(s);
    }
}
