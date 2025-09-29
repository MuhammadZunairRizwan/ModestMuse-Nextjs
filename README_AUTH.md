# Authentication System Setup Guide

## Overview
This authentication system provides:
- User registration with buyer/seller options
- Email verification via nodemailer
- JWT-based authentication
- Secure password hashing with bcryptjs

## Setup Instructions

### 1. Environment Variables
Create a `.env.local` file in the root directory with the following variables:

```env
# JWT Secret Key (change this in production)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Email Configuration (for nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=ModestMuse <noreply@modestmuse.com>
```

### 2. Email Service Setup
For Gmail:
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password in `EMAIL_PASS`

### 3. Running the Application
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Test authentication endpoints
npm run test:auth
```

## API Endpoints

### POST `/api/auth/signup`
Creates a new user account and sends verification email.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "1234567890",
  "address": "123 Main St",
  "userType": "buyer" // or "seller"
}
```

**Seller-specific fields:**
```json
{
  "shopName": "My Shop",
  "registrationNumber": "REG123",
  "shopAddress": "456 Shop St",
  "warehouseAddress": "789 Warehouse St",
  "returnAddress": "321 Return St",
  "businessDetails": "Business description"
}
```

### POST `/api/auth/login`
Authenticates user and returns JWT token.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### POST `/api/auth/verify-email`
Verifies email with the received code.

**Body:**
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

### POST `/api/auth/resend-verification`
Resends verification code to email.

**Body:**
```json
{
  "email": "user@example.com"
}
```

## Pages

### `/login`
Login page with email and password fields.

### `/signup`
Registration page with buyer/seller options and different form fields.

### `/verify-email`
Email verification page with code input and resend functionality.

## Database
The system uses a simple JSON file-based database (`data/db.json`) for development. In production, you should replace this with a proper database like PostgreSQL or MongoDB.

## Security Features
- Password hashing with bcryptjs (12 rounds)
- JWT tokens for authentication
- Email verification requirement before login
- Input validation with Zod schemas
- CORS protection (configure in production)

## Testing
Run the test script to verify endpoints work:
```bash
npm run test:auth
```

The test will:
1. Create a test buyer account
2. Attempt login (should fail due to unverified email)
3. Show instructions for manual verification testing

## Production Considerations
1. Use a real database (PostgreSQL, MongoDB, etc.)
2. Set proper environment variables in production
3. Configure CORS for your domain
4. Use HTTPS in production
5. Set proper JWT expiration times
6. Implement rate limiting
7. Add proper error logging
8. Use a dedicated email service (SendGrid, Mailgun, etc.)

## File Structure
```
app/
  api/
    auth/
      signup/route.ts
      login/route.ts
      verify-email/route.ts
      resend-verification/route.ts
  login/page.tsx
  signup/page.tsx
  verify-email/page.tsx
lib/
  auth.ts          # Authentication utilities
  db/
    db.ts          # Database operations
  email.ts         # Email service
  utils.ts         # Common utilities
```

## Troubleshooting

### Email Not Sending
1. Check email credentials in environment variables
2. Verify email service is properly configured
3. Check spam folder for verification emails

### Database Issues
1. Ensure `data/` directory has write permissions
2. Check `data/db.json` file exists and is valid JSON

### Authentication Errors
1. Verify JWT_SECRET is set in environment variables
2. Check token expiration settings
