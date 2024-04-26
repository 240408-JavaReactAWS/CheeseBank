package com.cheesebank.repository;

import com.cheesebank.models.TransactionHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TransactionHistoryRepo extends JpaRepository<TransactionHistory,Long> {


    List<TransactionHistory> findAllByUserUsername(String username);
}
