package com.cheesebank.dto;

import com.cheesebank.model.UserType;

public class UserDTO {

    private String username;
    private UserType userType;

    public UserDTO(String username, UserType userType) {
        this.username = username;
        this.userType = userType;
    }

    public String getUsername() { return username; }

    public void setUsername(String username) { this.username = username; }

    public UserType getUserType() { return userType; }

    public void setUserType(UserType userType) { this.userType = userType; }

}