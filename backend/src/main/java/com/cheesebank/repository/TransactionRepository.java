package com.cheesebank.repository;

import com.cheesebank.model.Transaction;
import com.cheesebank.model.TransactionType;
import com.cheesebank.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUser(User user);
    Page<Transaction> findByUserAndTimeStampBetween(User user, LocalDateTime start, LocalDateTime end, Pageable pageable);
    Page<Transaction> findByUserAndTransactionType(User user, TransactionType transactionType, Pageable pageable);
}