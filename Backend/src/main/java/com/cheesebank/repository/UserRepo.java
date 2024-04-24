package com.cheesebank.repository;

import com.cheesebank.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepo extends JpaRepository<User, Integer> {
    Optional<User> findUserByUsername(String username);
    @Query("From User WHERE username = :usernameVar AND password = :passwordVar")
    User findByUsernameAndPassword(@Param("usernameVar") String username, @Param("passwordVar") String password);

    Optional<User> findUserByUsernameAndPassword(String username, String password);
    //double check the find by user and password...
}
