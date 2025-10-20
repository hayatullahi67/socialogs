import { NextResponse } from 'next/server'
import { signUp } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const { email, password, username } = await req.json()
    const user = await signUp(email, password, username)
    return NextResponse.json({ success: true, user })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}