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

    boolean existsByUsernameAndPassword(String username, String password);

    Optional<User> findUserByUsernameAndPassword(String username, String password);

    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);

    User findByToken(String token);
}
