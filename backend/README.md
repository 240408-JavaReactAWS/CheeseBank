# CheeseBank API

## Description
The CheeseBank API provides a set of endpoints for managing user accounts, fund transfers, and transactions. The project aims to facilitate banking operations for users and permit various privileges to bank admin users. 

## Features
- User registration and login
- Cash deposit and withdrawal
- Fund transfer
- Transaction history
- Receive notifications

## Technologies
- Java
- Spring Boot
- Spring Security
- Spring Data JPA
- PostgreSQL
- Maven
- Postman (for testing)
- DBeaver (for testing)

## Installation
1. Clone the repository
   ```sh
   git clone https://github.com/240408-JavaReactAWS/CheeseBank.git
   ```
2. Navigate to the project directory
   ```sh
   cd CheeseBank/backend
   ```
3. Install the dependencies
   ```sh
   mvn clean install
   ``` 
4. Configure the credentials and environment variables laid out in `example.application.properties`
  - PostgreSQL
  - Email service
  - Frontend URL
      ```sh
      src/main/resources/application.properties
      ```
5. Build and run the project 
   ```sh
   mvn spring-boot:run
   ```
6. Access the API
    ```sh
    http://localhost:8080
    ```

## User Stories
### User
- As a user, I can register an account.
- As a user, I can log in to my account.
- As a user, I can reset my password.
- As a user, I can view my profile information (username, full name, phone, email, and balance).
- As a user, I can update my profile information (username, phone, and email).
- As a user, I can freeze my account (prevent withdrawals, deposits, and transfers).
- As a user, I can deposit money into my balance.
- As a user, I can withdraw money from my balance.
- As a user, I can transfer money to another user.
- As a user, I can view my transaction history.
- As a user, I can filter and search through my transaction history.
- As a user, I can receive notifications after each transaction. 
 
### Admin
- As an admin, I can view all users' profile information.
- As an admin, I can view all balances.
- As an admin, I can view all transaction histories.
- As an admin, I can filter and search through all users' information.
- As an admin, I can freeze any user's account.
- As an admin, I can delete any user's account.

## Issues
- Users can't have multiple bank accounts. A new table to separate user data with account data would be needed.
- User account numbers are equal to their primary keys. This is not secure and should be replaced with a unique account number.