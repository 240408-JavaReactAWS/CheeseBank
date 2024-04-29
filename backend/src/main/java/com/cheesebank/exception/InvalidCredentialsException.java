package com.cheesebank.exception;

public class InvalidCredentialsException extends Exception{

    public InvalidCredentialsException(String message) {
        super(message);
    }
}