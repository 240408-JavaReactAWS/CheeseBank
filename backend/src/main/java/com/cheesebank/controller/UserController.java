package com.cheesebank.controller;

import com.cheesebank.dto.UserDTO;
import com.cheesebank.exception.*;
import com.cheesebank.model.User;
import com.cheesebank.model.UserType;
import com.cheesebank.service.EmailService;
import com.cheesebank.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(
        origins = "${frontend.url}",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.DELETE},
        allowCredentials = "true"
)
public class UserController {

    private final UserService userService;

    private final EmailService emailService;

    @Autowired
    public UserController(UserService userService, EmailService emailService) {
        this.userService = userService;
        this.emailService = emailService;
    }

    // Register new user
    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User newUser, HttpSession session) throws PhoneAlreadyTakenException, EmailAlreadyTakenException, UsernameAlreadyTakenException {
        User user = userService.registerUser(newUser);
        session.setAttribute("user", user);
        System.out.println("User registration successful");
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    // Login user
    @PostMapping("/login")
    public ResponseEntity<UserDTO> loginUser(@RequestBody User user, HttpSession session) throws InvalidCredentialsException {
        User sessionUser = (User) session.getAttribute("user");
        if (sessionUser != null) {
            System.out.println("Already logged in to an account");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }

        User loggedInUser = userService.loginUser(user.getUsername(), user.getPassword());
        session.setAttribute("user", loggedInUser);
        System.out.println("User login successful");
        return ResponseEntity.ok(new UserDTO(loggedInUser.getUsername(), loggedInUser.getUserType()));
    }

    @GetMapping("/login")
    public String loginPage(@RequestBody User user, HttpSession session) {
        return "Redirecting to login page";
    }

    // Validate user session
    @GetMapping("/session")
    public ResponseEntity<User> validateSession(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            System.out.println("User session invalid");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        System.out.println("User session valid");
        return ResponseEntity.ok(user);
    }

    // Validate admin session
    @GetMapping("/admin")
    public ResponseEntity<User> validateAdminSession(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null || user.getUserType() != UserType.ADMIN) {
            System.out.println("Admin session invalid");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        System.out.println("Admin session valid");
        return ResponseEntity.ok(user);
    }

    // Logout user
    @PostMapping("/logout")
    public ResponseEntity<String> logoutUser(HttpSession session) {
        session.removeAttribute("user");
        session.invalidate();
        System.out.println("User logout successful");
        return ResponseEntity.ok("User logout successful");
    }

    // Trigger password reset
    @PostMapping("/forgot-password")
    public ResponseEntity<User> forgotPassword(@RequestParam String email) throws UserNotFoundException, PhoneAlreadyTakenException, EmailAlreadyTakenException, UsernameAlreadyTakenException {

        Optional<User> user = userService.findByEmail(email);
        if (user.isEmpty()) {
            throw new UserNotFoundException("User not found");
        }
        User possibleUser = user.get();
        String token = UUID.randomUUID().toString();
        possibleUser.setToken(token);
        userService.updateUser(possibleUser);
        emailService.sendEmail(email, "Password Reset", "Dear " + possibleUser.getFirstName() + "," + "\n\nPlease click the link to reset your password: http://localhost:3000/reset-password?token=" + token + "\n\nCheese Bank");
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // Reset password
    @PostMapping("/reset-password")
    public void resetPassword(@RequestBody Map<String, String> request) throws UserNotFoundException {
        String token = request.get("token");
        String password = request.get("password");
        userService.resetPassword(token, password);
    }

    // View user information
    @GetMapping("/profile")
    public ResponseEntity<User> getUser(HttpSession session) throws UserNotFoundException {
        User sessionUser = (User) session.getAttribute("user");
        if (sessionUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        User user = userService.getUser(sessionUser);
        System.out.println("Profile information retrieved");
        return ResponseEntity.ok(user);
    }

    // Find user by username
    @GetMapping("/username/{username}")
    public ResponseEntity<Optional<User>> findByUsername(@PathVariable String username, HttpSession session) throws UserNotFoundException {
        User sessionUser = (User) session.getAttribute("user");
        if (sessionUser == null || (!sessionUser.getUsername().equals(username))) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Optional<User> user = userService.findByUsername(username);
        System.out.println("User found by username");
        return ResponseEntity.ok(user);
    }

    // Find user by email
    @GetMapping("/email/{email}")
    public ResponseEntity<Optional<User>> findByEmail(@PathVariable String email, HttpSession session) throws UserNotFoundException {
        User sessionUser = (User) session.getAttribute("user");
        if (sessionUser == null || (!sessionUser.getEmail().equals(email))) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Optional<User> user = userService.findByEmail(email);
        System.out.println("User found by email");
        return ResponseEntity.ok(user);
    }

    // Find user by phone
    @GetMapping("/phone/{phone}")
    public ResponseEntity<Optional<User>> findByPhone(@PathVariable String phone, HttpSession session) throws UserNotFoundException {
        User sessionUser = (User) session.getAttribute("user");
        if (sessionUser == null || (!sessionUser.getPhone().equals(phone) && sessionUser.getUserType() != UserType.ADMIN)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Optional<User> user = userService.findByPhone(phone);
        System.out.println("User found by phone");
        return ResponseEntity.ok(user);
    }

    // View all users' information (ADMIN ONLY)
    @GetMapping("/all")
    public ResponseEntity<List<User>> findAllUsers(HttpSession session) throws AccessDeniedException {
        User sessionUser = (User) session.getAttribute("user");
        if (sessionUser == null || sessionUser.getUserType() != UserType.ADMIN) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<User> users = userService.getAllUsers(sessionUser);
        System.out.println("All users found");
        return ResponseEntity.ok(users);
    }

    // Update user information
    @PatchMapping("/update")
    public ResponseEntity<User> updateUser(@RequestBody User user, HttpSession session) throws UserNotFoundException, PhoneAlreadyTakenException, EmailAlreadyTakenException, UsernameAlreadyTakenException {
        User sessionUser = (User) session.getAttribute("user");

        String username = user.getUsername() != null ? user.getUsername() : sessionUser.getUsername();
        String email = user.getEmail() != null ? user.getEmail() : sessionUser.getEmail();
        String phone = user.getPhone() != null ? user.getPhone() : sessionUser.getPhone();

        sessionUser.setUsername(username);
        sessionUser.setEmail(email);
        sessionUser.setPhone(phone);

        userService.updateUser(sessionUser);
        emailService.sendAccountUpdateEmail(sessionUser);
        System.out.println("User information updated");
        return ResponseEntity.ok(sessionUser);
    }

    // Freeze account
    @PatchMapping("/freeze")
    public ResponseEntity<User> freezeUser(@RequestBody User user, HttpSession session) throws UserNotFoundException {
        User sessionUser = (User) session.getAttribute("user");
        if (sessionUser == null || !sessionUser.getUsername().equals(user.getUsername())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User frozenUser = userService.freezeUser(sessionUser);
        System.out.println("Toggled account freeze");
        return ResponseEntity.ok(frozenUser);
    }

    // Freeze any account (ADMIN ONLY)
    @PatchMapping("/freeze/{username}")
    public ResponseEntity<User> freezeAnyUser(@PathVariable String username, HttpSession session) throws UserNotFoundException {
        User sessionUser = (User) session.getAttribute("user");
        if (sessionUser == null || sessionUser.getUserType() != UserType.ADMIN) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User frozenUser = userService.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        userService.freezeUser(frozenUser);
        System.out.println("Toggled account freeze");
        return ResponseEntity.ok(frozenUser);
    }

    // Delete user account (ADMIN ONLY)
    @DeleteMapping("/delete/{username}")
    public ResponseEntity<String> deleteUser(@PathVariable String username, HttpSession session) throws UserNotFoundException {
        User sessionUser = (User) session.getAttribute("user");
        if (sessionUser == null || sessionUser.getUserType() != UserType.ADMIN) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User deletedUser = userService.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        userService.deleteUser(deletedUser);
        System.out.println("User deleted");
        return ResponseEntity.ok("User deleted");
    }

}