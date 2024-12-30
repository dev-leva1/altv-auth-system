# alt:V Authentication System

A modern authentication system for alt:V multiplayer modification, featuring user registration and login functionality with MySQL database integration.

## Features

- User registration with email verification
- Secure password hashing using SHA256
- MySQL database integration
- Modern and responsive UI
- Email validation
- Password strength requirements
- Animated camera during authentication
- Player state management
- Error handling and validation

## Requirements

- Node.js
- MySQL Server
- Required npm packages:
  - crypto-js
  - mysql2

## Installation

1. Copy the `auth` folder to your server's `resources` directory
2. Configure your MySQL database settings in `server/database.js`:
```js
const dbConfig = {
    host: 'your_host',
    user: 'your_username',
    password: 'your_password',
    database: 'your_database'
};
```

3. Install dependencies:
```bash
cd resources/auth
npm install
```

4. Add the resource to your `server.toml`:
```toml
resources = [
  'auth'
]
```

## Configuration

### Database Structure
The system automatically creates the following table structure:
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
)
```

### Security Features
- Password minimum length: 6 characters
- Email format validation
- Unique username and email constraints
- Password hashing using SHA256

## Usage

### Registration
Players can register with:
- Username
- Email address
- Password (minimum 6 characters)
- Password confirmation

### Login
Players can log in using:
- Username
- Password

## Events

### Client Events
- `auth:showLoginForm`
- `auth:loginResponse`
- `auth:registerResponse`

### Server Events
- `auth:tryLogin`
- `auth:tryRegister`

## Error Handling

- Missing fields
- Invalid email format
- Password mismatch
- Duplicate username/email
- Database connection issues
- Authentication failures
