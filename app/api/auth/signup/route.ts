import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, generateVerificationCode } from '@/lib/auth';
import { findUserByEmail, createUser, saveVerificationCode } from '@/lib/db/db';
import { sendVerificationEmail } from '@/lib/email';
import { z } from 'zod';

// Validation schemas
const buyerSignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phoneNumber: z.string().min(10),
  address: z.string().min(1),
  userType: z.literal('buyer')
});

const sellerSignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phoneNumber: z.string().min(10),
  address: z.string().min(1),
  userType: z.literal('seller'),
  shopName: z.string().min(1),
  registrationNumber: z.string().min(1),
  shopAddress: z.string().min(1),
  warehouseAddress: z.string().min(1),
  returnAddress: z.string().min(1),
  businessDetails: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Determine which schema to use based on userType
    let validatedData;
    if (body.userType === 'buyer') {
      validatedData = buyerSignupSchema.parse(body);
    } else if (body.userType === 'seller') {
      validatedData = sellerSignupSchema.parse(body);
    } else {
      return NextResponse.json(
        { error: 'Invalid user type' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(validatedData.email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);

    // Create user data
    const userData = {
      email: validatedData.email,
      password: hashedPassword,
      first_name: validatedData.firstName,
      last_name: validatedData.lastName,
      phone_number: validatedData.phoneNumber,
      address: validatedData.address,
      user_type: validatedData.userType,
      is_verified: false,
      ...(validatedData.userType === 'seller' && {
        shop_name: validatedData.shopName,
        registration_number: validatedData.registrationNumber,
        shop_address: validatedData.shopAddress,
        warehouse_address: validatedData.warehouseAddress,
        return_address: validatedData.returnAddress,
        business_details: validatedData.businessDetails
      })
    };

    // Create user
    const user = await createUser(userData);

    // Generate verification code
    const verificationCode = generateVerificationCode();
    await saveVerificationCode(validatedData.email, verificationCode);

    // Send verification email (don't fail the signup if email sending fails)
    const emailSent = await sendVerificationEmail(validatedData.email, verificationCode);
    
    if (!emailSent) {
      console.error('Failed to send verification email to:', validatedData.email);
      // Continue with signup but inform client that email sending failed
      return NextResponse.json(
        { 
          message: 'User created successfully, but failed to send verification email. Please use the resend option on the verification page.',
          userId: user.id,
          emailSent: false
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { 
        message: 'User created successfully. Please check your email for verification code.',
        userId: user.id,
        emailSent: true
      },
      { status: 201 }
    );

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
