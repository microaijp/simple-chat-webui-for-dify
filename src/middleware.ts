import { NextRequest, NextResponse } from 'next/server';


export const config = {
    matcher: ['/(.*)'],
};


export function middleware(req: NextRequest) {
    if (process.env.AUTH_MODE == "BASIC") {
        const basicAuth = req.headers.get('Authorization');
        if (basicAuth) {
            const authValue = basicAuth.split(' ')[1];
            const [user, password] = atob(authValue).split(':');

            const users = JSON.parse(process.env.BASIC_AUTH_USERS || '{}');

            if (users[user] && users[user] === password) {
                return NextResponse.next();
            }

            return NextResponse.json(
                { error: 'Invalid credentials' },
                { headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' }, status: 401 }
            );
        } else {
            return NextResponse.json(
                { error: 'Please enter credentials' },
                { headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' }, status: 401 }
            );
        }
    }
}
