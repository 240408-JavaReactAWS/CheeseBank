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

    //Sav's code
    public User findUserByUsernameAndPassword(String username, String password) {
        Optional<User> optionalUser = userRepo.findUserByUsernameAndPassword(username, password);

        if (optionalUser.isPresent()){
            User myUser = optionalUser.get();
            return myUser;
        }
        else{
            return null;
        }
    }

    //User story 1: As a user, I can register my account.
    public User createUserAccount(User user){
        return this.userRepo.save(user);
    }

    //User story 2: As a user, I can log in to my account.
    public User processLogin(User user){
        User myUser = findUserByUsernameAndPassword(user.getUsername(), user.getPassword());

        if (myUser != null){
            return myUser;
        }
        else{
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
    }

    //User story 3: As a user, I can update my personal information such as name,email, and phone number.
    // note: does the above method "update user" do this?...
}
