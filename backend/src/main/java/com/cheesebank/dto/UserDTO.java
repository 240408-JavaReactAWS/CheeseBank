package com.cheesebank.dto;

import com.cheesebank.model.UserType;

import java.math.BigDecimal;
import java.time.LocalDate;

public class UserDTO {

    private int id;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private LocalDate dob;
    private String phone;
    private BigDecimal balance;
    private UserType userType;
    private Boolean isFrozen;

    public UserDTO(int id, String username, String firstName, String lastName, String email, LocalDate dob, String phone, BigDecimal balance, UserType userType, Boolean isFrozen) {
        this.id = id;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.dob = dob;
        this.phone = phone;
        this.balance = balance;
        this.userType = userType;
        this.isFrozen = isFrozen;
    }

    public int getId() { return id; }

    public void setId(int id) { this.id = id; }

    public String getUsername() { return username; }

    public void setUsername(String username) { this.username = username; }

    public String getFirstName() { return firstName; }

    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }

    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public LocalDate getDob() { return dob; }

    public void setDob(LocalDate dob) { this.dob = dob; }

    public String getPhone() { return phone; }

    public void setPhone(String phone) { this.phone = phone; }

    public BigDecimal getBalance() { return balance; }

    public void setBalance(BigDecimal balance) { this.balance = balance; }

    public UserType getUserType() { return userType; }

    public void setUserType(UserType userType) { this.userType = userType; }

    public Boolean getIsFrozen() { return isFrozen; }

    public void setIsFrozen(Boolean isFrozen) { this.isFrozen = isFrozen; }

}