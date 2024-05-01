package com.cheesebank.exception;

public class EmailAlreadyTakenException extends Exception{

    public EmailAlreadyTakenException(String message) {
        super(message);
    }

}