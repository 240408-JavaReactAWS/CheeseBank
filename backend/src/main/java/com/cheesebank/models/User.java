package com.cheesebank.models;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.Objects;

@Entity
@Table(name="users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String first_name;
    private String last_name;
    private String username;
    private String password;
    private String email;
    private LocalDate dob;
    private long phoneNumber;
    private String token;
    private boolean isIsFrozen;
    private double balance;


    public User(){

    }

    public User(int id, String first_name, String last_name, String username, String password, String email, LocalDate dob, long phoneNumber, String token, boolean isFrozen, double balance) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.username = username;
        this.password = password;
        this.email = email;
        this.dob = dob;
        this.phoneNumber = phoneNumber;
        this.token = token;
        this.isIsFrozen = isFrozen;
        this.balance =balance;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getFirst_name() {
        return first_name;
    }

    public void setFirst_name(String first_name) {
        this.first_name = first_name;
    }

    public String getLast_name() {
        return last_name;
    }

    public void setLast_name(String last_name) {
        this.last_name = last_name;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDate getDob() {
        return dob;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    public long getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(long phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public boolean isFrozen() {
        return isIsFrozen;
    }

    public void setFrozen(boolean frozen) {
        isIsFrozen = frozen;
    }

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return id == user.id && phoneNumber == user.phoneNumber && isIsFrozen == user.isIsFrozen && Double.compare(user.balance, balance) == 0 && Objects.equals(first_name, user.first_name) && Objects.equals(last_name, user.last_name) && Objects.equals(username, user.username) && Objects.equals(password, user.password) && Objects.equals(email, user.email) && Objects.equals(dob, user.dob) && Objects.equals(token, user.token);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, first_name, last_name, username, password, email, dob, phoneNumber, token, isIsFrozen, balance);
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", first_name='" + first_name + '\'' +
                ", last_name='" + last_name + '\'' +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", email='" + email + '\'' +
                ", dob=" + dob +
                ", phoneNumber=" + phoneNumber +
                ", token='" + token + '\'' +
                ", isFrozen=" + isIsFrozen +
                ", balance=" + balance +
                '}';
    }
}
