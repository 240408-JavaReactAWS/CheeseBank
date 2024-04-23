package com.cheesebank.repository;

import com.cheesebank.models.TransactionHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionHistoryRepo extends JpaRepository<TransactionHistory,Long> {
}
