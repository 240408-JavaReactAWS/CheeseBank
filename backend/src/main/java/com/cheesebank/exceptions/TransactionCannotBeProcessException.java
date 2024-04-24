package com.cheesebank.exceptions;

public class TransactionCannotBeProcessException extends RuntimeException {
    public TransactionCannotBeProcessException(String s) {
        super(s);
    }
}
