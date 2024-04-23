package com.cheesebank.services;

import com.cheesebank.models.User;
import com.cheesebank.repository.UserRepo;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private UserRepo userRepo;

    public UserService(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    public User findByUserId(int userId) {
        Optional<User> user = userRepo.findById(userId);

        return user.get();

    }

    public void updateUser(User user) {
        userRepo.save(user);
    }
}
