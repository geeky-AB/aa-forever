import { SignJWT } from 'jose';
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
const COOKIE_NAME = 'auth_token';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    let role = '';

    // user or admin
    if (password === process.env.SITE_PASSWORD) {
      role = 'user';
    } else if (password === process.env.ADMIN_PASSWORD) {
      role = 'admin';
    } else {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // 2. Create a JWT token
    const token = await new SignJWT({ role: role })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h') // Token expires in 1 hour
      .sign(secretKey);

    // 3. Serialize the cookie
    const cookie = serialize(COOKIE_NAME, token, {
      httpOnly: true, // Crucial for security
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60, // 1 hour in seconds
      path: '/',
    });

    // 4. Send the cookie back in the response headers
    return new Response(JSON.stringify({ success: true, role: role }), {
      status: 200,
      headers: { 'Set-Cookie': cookie },
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}