import { NextRequest, NextResponse } from 'next/server';
import { generateVerificationCode } from '@/lib/auth';
import { findUserByEmail, saveVerificationCode } from '@/lib/db/db';
import { sendVerificationEmail } from '@/lib/email';
import { z } from 'zod';

const resendVerificationSchema = z.object({
  email: z.string().email()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = resendVerificationSchema.parse(body);

    // Find user
    const user = await findUserByEmail(validatedData.email);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user is already verified
    if (user.is_verified) {
      return NextResponse.json(
        { error: 'Email is already verified' },
        { status: 400 }
      );
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode();
    await saveVerificationCode(validatedData.email, verificationCode);

    // Send verification email
    const emailSent = await sendVerificationEmail(validatedData.email, verificationCode);
    
    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Verification code sent successfully' },
      { status: 200 }
    );

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Resend verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
