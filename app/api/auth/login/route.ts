import { NextRequest, NextResponse } from 'next/server';
import { comparePassword, generateToken } from '@/lib/auth';
import { findUserByEmail } from '@/lib/db/db';
import { z } from 'zod';
import { cookies } from "next/headers";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = loginSchema.parse(body);

    // Find user by email
    const user = await findUserByEmail(validatedData.email);
    if (!user) {
      console.log("❌ No user found for email:", validatedData.email);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await comparePassword(validatedData.password, user.password);
    if (!isPasswordValid) {
      console.log("❌ Password mismatch for email:", validatedData.email);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if user is verified
    if (!user.is_verified) {
     console.log("❌ User not verified:", user.is_verified);
      return NextResponse.json(
        { error: 'Please verify your email before logging in' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken(user);

    // Set token as HTTP-only cookie
    cookies().set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    // Return user data (excluding password) and token
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword,
      token
    }, { status: 200 });

  } catch (error) {
    if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: 'Invalid input data', details: error.errors },
      { status: 400 }
    );
  }

  console.error('Login error:', error);
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
    );
  }
}
