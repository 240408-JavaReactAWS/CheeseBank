package com.cheesebank.exception;

public class TransactionCannotBeProcessException extends RuntimeException {
    public TransactionCannotBeProcessException(String s) {
        super(s);
    }
}
