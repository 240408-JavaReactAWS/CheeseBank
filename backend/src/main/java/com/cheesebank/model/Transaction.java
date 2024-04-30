package com.cheesebank.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType transactionType;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column
    private String description;

    @Column(nullable = false)
    private LocalDateTime timeStamp;
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal currentBalance;

    @Column(nullable = false)
    private int targetAccount;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal resultBalance;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "userId", nullable = false)
    @JsonIgnoreProperties({ "password" })
    private User user;

    public Transaction() {
    }

    public Transaction(Long id, TransactionType transactionType, BigDecimal amount, String description,
            LocalDateTime timeStamp, BigDecimal currentBalance, int targetAccount, User user) {
        this.id = id;
        this.transactionType = transactionType;
        this.amount = amount;
        this.description = description;
        this.timeStamp = timeStamp;
        this.currentBalance = currentBalance;
        this.targetAccount = targetAccount;
        this.resultBalance = resultBalance;
        this.user = user;
    }

    public BigDecimal getCurentBalance() {
        return currentBalance;
    }

    public void setCurentBalance(BigDecimal curentBalance) {
        this.currentBalance = curentBalance;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TransactionType getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(TransactionType transactionType) {
        this.transactionType = transactionType;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getTimeStamp() {
        return timeStamp;
    }

    public void setTimeStamp(LocalDateTime timeStamp) {
        this.timeStamp = timeStamp;
    }

    public int getTargetAccount() {
        return targetAccount;
    }

    public void setTargetAccount(int targetAccount) {
        this.targetAccount = targetAccount;
    }

    public BigDecimal getResultBalance() {
        return resultBalance;
    }

    public void setResultBalance(BigDecimal resultBalance) {
        this.resultBalance = resultBalance;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    // Helper Methods

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        Transaction that = (Transaction) o;
        return targetAccount == that.targetAccount && Objects.equals(id, that.id)
                && transactionType == that.transactionType && Objects.equals(amount, that.amount)
                && Objects.equals(description, that.description) && Objects.equals(timeStamp, that.timeStamp)
                && Objects.equals(currentBalance, that.currentBalance) && Objects.equals(user, that.user);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, transactionType, amount, description, timeStamp, currentBalance, targetAccount, user);
    }

    @Override
    public String toString() {
        return "Transaction{" +
                "id=" + id +
                ", transactionType=" + transactionType +
                ", amount=" + amount +
                ", description='" + description + '\'' +
                ", timeStamp=" + timeStamp +
                ", currentBalance=" + currentBalance +
                ", targetAccount=" + targetAccount +
                ", user=" + user +
                '}';
    }
}