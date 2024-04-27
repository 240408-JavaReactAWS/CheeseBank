package com.cheesebank.exception;

public class UsernameAlreadyTakenException extends Exception{

    public UsernameAlreadyTakenException(String message) {
        super(message);
    }
}