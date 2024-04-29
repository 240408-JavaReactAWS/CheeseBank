package com.cheesebank.exception;

public class AccountFrozenException extends Exception{

    public AccountFrozenException(String message) {
        super(message);
    }
}