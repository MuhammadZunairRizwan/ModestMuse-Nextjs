import { config } from 'dotenv';
import { pool } from '../lib/db/init';
import { hashPassword } from '../lib/auth';

// Load environment variables
config();

async function createAdminUser() {
  try {
    console.log('Creating admin user...');
    
    const adminEmail = 'admin@modestmuse.com';
    const adminPassword = 'admin';
    
    // Check if admin user already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [adminEmail]
    );
    
    if (existingUser.rows.length > 0) {
      console.log('Admin user already exists');
      return;
    }
    
    // Hash the password
    const hashedPassword = await hashPassword(adminPassword);
    
    // Create admin user
    const result = await pool.query(
      `INSERT INTO users (
        email, password, first_name, last_name, phone_number, address, 
        user_type, is_verified
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        adminEmail,
        hashedPassword,
        'Admin',
        'User',
        '1234567890',
        'Admin Address',
        'admin',
        true
      ]
    );
    
    console.log('Admin user created successfully:', result.rows[0]);
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await pool.end();
  }
}

createAdminUser();
