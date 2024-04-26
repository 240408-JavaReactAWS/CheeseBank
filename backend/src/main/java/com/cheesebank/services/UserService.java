package com.cheesebank.services;

import com.cheesebank.exceptions.UserNotFoundException;
import com.cheesebank.models.User;
import com.cheesebank.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private UserRepo userRepo;

    @Autowired
    public UserService(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    public User findByUserId(int userId) {
        Optional<User> user = userRepo.findById(userId);

        return user.get();

    }

    public User updateUser(User user) {
        Optional<User> updateUser = userRepo.findById(user.getId());

        if (!updateUser.isPresent()){
//            userRepo.save(user);
            throw new UserNotFoundException("User not found");
        }

//        userRepo.save(user);
        return userRepo.save(user);
    }

    // Matthew code ////////////////////////////////////////
    public void save(User user) {
    }
    ////////////////////////////////////////////////////////

    //User story 1: As a user, I can register my account.
    public User createUserAccount(User user){
        return this.userRepo.save(user);
    }

    //User story 2: As a user, I can log in to my account.
    //Sav's code
    public Optional<User> findUserByUsernameAndPassword(String username, String password) {

         Optional<User> user = Optional.ofNullable(userRepo.findByUsernameAndPassword(username, password));
            return user;
    }

    public User findByUsername(String username) {
        Optional<User> user = userRepo.findByUsername(username);

        if (user.isPresent()){
            return user.get();
        }
        else{
            throw new UserNotFoundException("User not found");
        }
    }

    public User findByEmail(String email) {
        Optional<User> user = userRepo.findByEmail(email);

        if (user.isPresent()){
            return user.get();
        }
        else{
            throw new UserNotFoundException("User not found");
        }
    }

    //User story 3: As a user, I can update my personal information such as name,email, and phone number.
    // note: does the above method "update user" do this?...
}
