package com.cheesebank.repository;

import com.cheesebank.models.TransactionHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionHistoryRepo extends JpaRepository<TransactionHistory,Long> {

    List<TransactionHistory> findAllByUserId(int userId);
}
