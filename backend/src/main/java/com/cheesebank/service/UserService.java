package com.cheesebank.service;

import com.cheesebank.exception.*;
import com.cheesebank.model.User;
import com.cheesebank.model.UserType;
import com.cheesebank.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder;

    private EmailService emailService;

    @Autowired
    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Find user by username
    @Transactional(readOnly = true)
    public Optional<User> findByUsername(String username) throws UserNotFoundException {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isEmpty()) {
            throw new UserNotFoundException("User not found");
        }

        return userRepository.findByUsername(username);
    }

    // Find user by email
    @Transactional(readOnly = true)
    public Optional<User> findByEmail(String email) throws UserNotFoundException {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isEmpty()) {
            throw new UserNotFoundException("User not found");
        }

        return userRepository.findByEmail(email);
    }

    // Register new user
    @Transactional
    public User registerUser(User newUser) throws UsernameAlreadyTakenException, EmailAlreadyTakenException, PhoneAlreadyTakenException {
        Optional<User> possibleUser = userRepository.findByUsername(newUser.getUsername());
        if (possibleUser.isPresent()) {
            throw new UsernameAlreadyTakenException("Username: " + newUser.getUsername() +" was already taken!");
        }

        Optional<User> possibleEmail = userRepository.findByEmail(newUser.getEmail());
        if (possibleEmail.isPresent()) {
            throw new EmailAlreadyTakenException("This email is already in use.");
        }

        Optional<User> possiblePhone = userRepository.findByPhone(newUser.getPhone());
        if (possiblePhone.isPresent()) {
            throw new PhoneAlreadyTakenException("This phone number is already in use.");
        }

        newUser.setUserType(UserType.USER);
        newUser.setFrozen(false);
        return userRepository.save(newUser);
    }

    // Login user
    @Transactional
    public User login(String username, String password) throws InvalidCredentialsException {
        Optional<User> possibleUser = userRepository.findByUsername(username);
        if (possibleUser.isEmpty()) {
            throw new InvalidCredentialsException("Invalid username or password");
        }

        User returnedUser = possibleUser.get();
        if (!passwordEncoder.matches(password, returnedUser.getPassword())) {
            throw new InvalidCredentialsException("Invalid username or password");
        }

        return returnedUser;
    }

    // Reset password
    @Transactional
    public User resetPassword(String username, String newPassword) throws UserNotFoundException {
        Optional<User> possibleUser = userRepository.findByUsername(username);
        if (possibleUser.isEmpty()) {
            throw new UserNotFoundException("Invalid username");
        }

        User user = possibleUser.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        emailService.sendPasswordChangeEmail(user);
        return user;
    }

    // View user information
    @Transactional(readOnly = true)
    public User getUser(User user) throws UserNotFoundException {
        return userRepository.findById(user.getId())
                .orElseThrow(() -> new UserNotFoundException("User not found"));
    }

    // View all users' information (ADMIN ONLY)
    @Transactional(readOnly = true)
    public List<User> getAllUsers(User user) throws AccessDeniedException {
        if (user.getUserType() != UserType.ADMIN) {
            throw new AccessDeniedException("You do not have admin privileges.");
        }

        return userRepository.findAll();
    }

    // Update user information
    @Transactional
    public User updateUser(User updatedUser) throws UserNotFoundException, UsernameAlreadyTakenException, EmailAlreadyTakenException, PhoneAlreadyTakenException {
        int id = updatedUser.getId();

        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        Optional<User> userByUsername = userRepository.findByUsername(updatedUser.getUsername());
        if (userByUsername.isPresent() && userByUsername.get().getId() != id) {
            throw new UsernameAlreadyTakenException("Username: " + updatedUser.getUsername() +" was already taken!");
        }

        Optional<User> userByEmail = userRepository.findByEmail(updatedUser.getEmail());
        if (userByEmail.isPresent() && userByEmail.get().getId() != id) {
            throw new EmailAlreadyTakenException("This email is already in use.");
        }

        Optional<User> userByPhone = userRepository.findByPhone(updatedUser.getPhone());
        if (userByPhone.isPresent() && userByPhone.get().getId() != id) {
            throw new PhoneAlreadyTakenException("This phone number is already in use.");
        }

        existingUser.setUsername(updatedUser.getUsername());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setPhone(updatedUser.getPhone());
        emailService.sendAccountUpdateEmail(existingUser);
        return userRepository.save(existingUser);
    }

    // Freeze user account
    @Transactional
    public User freezeUser(User user) throws UserNotFoundException {
        User existingUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        existingUser.setFrozen(!existingUser.getFrozen());
        return userRepository.save(existingUser);
    }

    // Freeze any user account (ADMIN ONLY)
    @Transactional
    public User freezeAnyUser(User user) throws UserNotFoundException, AccessDeniedException {
        if (user.getUserType() != UserType.ADMIN) {
            throw new AccessDeniedException("You do not have admin privileges.");
        }

        int id = user.getId();
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        existingUser.setFrozen(!existingUser.getFrozen());
        return userRepository.save(existingUser);
    }

    // Delete user account (ADMIN ONLY)
    @Transactional
    public void deleteUser(User user) throws UserNotFoundException, AccessDeniedException {
        if (user.getUserType() != UserType.ADMIN) {
            throw new AccessDeniedException("You do not have admin privileges.");
        }

        int id = user.getId();
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        userRepository.delete(existingUser);
    }
}