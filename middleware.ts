import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const basicAuth = request.headers.get('authorization');

  const USER = 'admin'; // Dein Benutzername
  const PASS = process.env.SITE_PASSWORD || '511maRjus'; // Passwort aus Umgebungsvariable

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [user, pass] = atob(authValue).split(':');

    if (user === USER && pass === PASS) {
      return NextResponse.next();
    }
  }

  return new NextResponse('Auth required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Protected"',
    },
  });
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|public|images).*)'],
};
