// Simple test script to verify authentication endpoints work
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000/api/auth';

async function testSignup() {
  console.log('Testing signup endpoint...');
  
  const buyerData = {
    email: 'testbuyer@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'Buyer',
    phoneNumber: '1234567890',
    address: '123 Test Street',
    userType: 'buyer'
  };

  try {
    const response = await fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(buyerData),
    });

    const data = await response.json();
    console.log('Signup response:', data);
    
    if (response.ok) {
      console.log('✅ Buyer signup successful');
      return buyerData.email;
    } else {
      console.log('❌ Buyer signup failed:', data.error);
      return null;
    }
  } catch (error) {
    console.log('❌ Signup test error:', error.message);
    return null;
  }
}

async function testLogin(email, password) {
  console.log('\nTesting login endpoint...');
  
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log('Login response:', data);
    
    if (response.ok) {
      console.log('✅ Login successful');
      return data.token;
    } else {
      console.log('❌ Login failed:', data.error);
      return null;
    }
  } catch (error) {
    console.log('❌ Login test error:', error.message);
    return null;
  }
}

async function main() {
  console.log('Starting authentication system tests...\n');
  
  // Test buyer signup
  const email = await testSignup();
  
  if (email) {
    // Test login (should fail because email is not verified)
    await testLogin(email, 'password123');
    
    console.log('\nNote: Email verification would be tested with actual email service');
    console.log('To complete the test:');
    console.log('1. Check the data/db.json file to see the user was created');
    console.log('2. Manually verify the email in the database');
    console.log('3. Then test login again');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testSignup, testLogin };
