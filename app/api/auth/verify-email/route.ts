import { NextRequest, NextResponse } from 'next/server';
import { verifyCode, findUserByEmail, updateUser } from '@/lib/db/db';
import { sendWelcomeEmail } from '@/lib/email';
import { z } from 'zod';

const verifyEmailSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6)
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = verifyEmailSchema.parse(body);
    console.log("Incoming verify-email body:", body);

    // Verify the code
    const isValid = await verifyCode(validatedData.email, validatedData.code);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code' },
        { status: 400 }
      );
    }

    // Find user and update verification status
    const user = await findUserByEmail(validatedData.email);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user verification status
    const updatedUser = await updateUser(user.id, { is_verified: true });
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to verify user' },
        { status: 500 }
      );
    }

    // Send welcome email
    await sendWelcomeEmail(updatedUser.email, updatedUser.first_name, updatedUser.user_type);

    return NextResponse.json(
      { message: 'Email verified successfully' },
      { status: 200 }
    );

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
