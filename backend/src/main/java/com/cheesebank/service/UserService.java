package com.cheesebank.service;

import com.cheesebank.exception.*;
import com.cheesebank.model.User;
import com.cheesebank.model.UserType;
import com.cheesebank.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder;

    private final EmailService emailService;

    @Autowired
    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
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

        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
        newUser.setBalance(BigDecimal.ZERO);
        newUser.setUserType(UserType.USER);
        newUser.setFrozen(false);
        return userRepository.save(newUser);
    }

    // Login user
    @Transactional
    public User loginUser(String username, String password) throws InvalidCredentialsException {
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
    public void resetPassword(User user) throws UserNotFoundException, InvalidCredentialsException {
        String username = user.getUsername();
        String phone = user.getPhone();
        String email = user.getEmail();
        LocalDate dob = user.getDob();
        String newPassword = user.getPassword();

        User updatedUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        if (!updatedUser.getEmail().equals(email) || !updatedUser.getPhone().equals(phone) || !updatedUser.getDob().equals(dob)) {
            throw new InvalidCredentialsException("Invalid email, phone, or date of birth");
        }

        updatedUser.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(updatedUser);
    }

    // View user information
    @Transactional(readOnly = true)
    public User getUser(User user) throws UserNotFoundException {
        return userRepository.findById(user.getId())
                .orElseThrow(() -> new UserNotFoundException("User not found"));
    }

    // Find user by ID
    @Transactional(readOnly = true)
    public User findById(int id) throws UserNotFoundException {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
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

    // Find user by phone
    @Transactional(readOnly = true)
    public Optional<User> findByPhone(String phone) throws UserNotFoundException {
        Optional<User> user = userRepository.findByPhone(phone);
        if (user.isEmpty()) {
            throw new UserNotFoundException("User not found");
        }

        return userRepository.findByPhone(phone);
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
    public void updateUser(User updatedUser) throws UserNotFoundException, UsernameAlreadyTakenException, EmailAlreadyTakenException, PhoneAlreadyTakenException {
        User existingUser = userRepository.findById(updatedUser.getId())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (!existingUser.getUsername().equals(updatedUser.getUsername())) {
            Optional<User> possibleUser = userRepository.findByUsername(updatedUser.getUsername());
            if (possibleUser.isPresent()) {
                throw new UsernameAlreadyTakenException("Username: " + updatedUser.getUsername() +" was already taken!");
            }
        }
        if (!existingUser.getEmail().equals(updatedUser.getEmail())) {
            Optional<User> possibleEmail = userRepository.findByEmail(updatedUser.getEmail());
            if (possibleEmail.isPresent()) {
                throw new EmailAlreadyTakenException("This email is already in use.");
            }
        }
        if (!existingUser.getPhone().equals(updatedUser.getPhone())) {
            Optional<User> possiblePhone = userRepository.findByPhone(updatedUser.getPhone());
            if (possiblePhone.isPresent()) {
                throw new PhoneAlreadyTakenException("This phone number is already in use.");
            }
        }

        userRepository.save(updatedUser);
    }

    // Freeze account
    @Transactional
    public User freezeUser(User user) throws UserNotFoundException {
        User existingUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        existingUser.setFrozen(!existingUser.getFrozen());
        return userRepository.save(existingUser);
    }

    // Freeze any user account (ADMIN ONLY)
    @Transactional
    public User freezeAnyUser(User user, String username) throws UserNotFoundException, AccessDeniedException {
        if (user.getUserType() != UserType.ADMIN) {
            throw new AccessDeniedException("You do not have admin privileges.");
        }

        User existingUser = userRepository.findByUsername(username)
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