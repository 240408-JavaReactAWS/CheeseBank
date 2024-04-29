package com.cheesebank.exception;

public class PhoneAlreadyTakenException extends Exception{

    public PhoneAlreadyTakenException(String message) {
        super(message);
    }
}