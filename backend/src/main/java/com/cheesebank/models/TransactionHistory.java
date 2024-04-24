package com.cheesebank.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class TransactionHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Enumerated(EnumType.STRING)
    private TransactionType type;
    private String description;
    private double transaction_amount;

    private LocalDateTime timeStamp;
    private double current_balance;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="fk_user_id")
    @JsonIgnoreProperties({"password"})
    private User user;


    public TransactionHistory(){

    }

    public TransactionHistory(long id, TransactionType type, String description, double transaction_amount, LocalDateTime timeStamp, double current_balance, User user) {
        this.id = id;
        this.type = type;
        this.description = description;
        this.transaction_amount = transaction_amount;
        this.timeStamp = timeStamp;
        this.current_balance = current_balance;
        this.user = user;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public TransactionType getType() {
        return type;
    }

    public void setType(TransactionType type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getTransaction_amount() {
        return transaction_amount;
    }

    public void setTransaction_amount(double transaction_amount) {
        this.transaction_amount = transaction_amount;
    }

    public LocalDateTime getTimeStamp() {
        return timeStamp;
    }

    public void setTimeStamp(LocalDateTime timeStamp) {
        this.timeStamp = timeStamp;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public double getCurrent_balance() {
        return current_balance;
    }

    public void setCurrent_balance(double current_balance) {
        this.current_balance = current_balance;
    }

    @Override
    public String toString() {
        return "TransactionHistory{" +
                "id=" + id +
                ", type=" + type +
                ", description='" + description + '\'' +
                ", transaction_amount=" + transaction_amount +
                ", timeStamp=" + timeStamp +
                ", current_balance=" + current_balance +
                ", user=" + user +
                '}';
    }
}
