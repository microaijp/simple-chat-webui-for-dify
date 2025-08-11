import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const basicAuth = req.headers.get('Authorization');

    if (basicAuth && basicAuth.startsWith('Basic ')) {
        const authValue = basicAuth.split(' ')[1];
        const [user] = atob(authValue).split(':');

        return NextResponse.json({ user });
    }

    return NextResponse.json({ user: null }, { status: 401 });
}