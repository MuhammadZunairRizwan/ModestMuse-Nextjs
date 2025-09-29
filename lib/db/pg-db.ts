import { pool } from './init';

export interface User {
  id: number;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
  user_type: 'buyer' | 'seller';
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  // Seller specific fields
  shop_name?: string;
  registration_number?: string;
  shop_address?: string;
  warehouse_address?: string;
  return_address?: string;
  business_details?: string;
}

export interface VerificationCode {
  id: number;
  email: string;
  code: string;
  expiresAt: string;
  createdAt: string;
}

export const findUserByEmail = async (email: string): Promise<User | undefined> => {
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error finding user by email:', error);
    return undefined;
  }
};

export const findUserById = async (id: number): Promise<User | undefined> => {
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error finding user by id:', error);
    return undefined;
  }
};

export const createUser = async (user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> => {
  try {
    const result = await pool.query(
      `INSERT INTO users (
        email, password, first_name, last_name, phone_number, address, 
        user_type, is_verified, shop_name, registration_number, 
        shop_address, warehouse_address, return_address, business_details
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [
        user.email,
        user.password,
        user.first_name,
        user.last_name,
        user.phone_number,
        user.address,
        user.user_type,
        user.is_verified,
        user.shop_name,
        user.registration_number,
        user.shop_address,
        user.warehouse_address,
        user.return_address,
        user.business_details
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (id: number, updates: Partial<User>): Promise<User | null> => {
  try {
    const setClauses: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        setClauses.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (setClauses.length === 0) {
      return null;
    }

    setClauses.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const result = await pool.query(
      `UPDATE users SET ${setClauses.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0] || null;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
};


export const saveVerificationCode = async (email: string, code: string): Promise<void> => {
  try {
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes
    
    // Remove any existing codes for this email
    await pool.query(
      'DELETE FROM verification_codes WHERE email = $1',
      [email]
    );
    
    // Insert new code
    await pool.query(
      'INSERT INTO verification_codes (email, code, expires_at) VALUES ($1, $2, $3)',
      [email, code, expiresAt]
    );
  } catch (error) {
    console.error('Error saving verification code:', error);
    throw error;
  }
};

export const verifyCode = async (email: string, code: string): Promise<boolean> => {
  try {
    const result = await pool.query(
    `SELECT * FROM verification_codes
     WHERE email=$1 AND code=$2 AND expires_at > NOW()`,
    [email, code]
  );

    if (result.rows.length === 0) {
      return false;
    }

    const verification = result.rows[0];
    
    // Check if code is expired
    // if (new Date(verification.expires_at) < new Date()) {
    //   // Remove expired code
    //   await pool.query(
    //     'DELETE FROM verification_codes WHERE email = $1',
    //     [email]
    //   );
    //   return false;
    // }
    
    // // Remove used code
    // await pool.query(
    //   'DELETE FROM verification_codes WHERE email = $1',
    //   [email]
    // );
   
    return true;
  } catch (error) {
    console.error('Error verifying code:', error);
    return false;
  }
};
