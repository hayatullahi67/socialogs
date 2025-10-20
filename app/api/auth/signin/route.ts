import { NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth-utils';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    
    const userCredential = await loginUser(email, password);
    const { uid, email: userEmail } = userCredential.user;

    return NextResponse.json({
      success: true,
      user: { id: uid, email: userEmail }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Login failed' },
      { status: 401 }
    );
  }
}