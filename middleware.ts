import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // ⚠️ Deine E-Mail hier eintragen
  const allowedEmail = 'deine@email.de';

  // Wenn kein Token vorhanden oder E-Mail nicht erlaubt → Zugriff verweigern
  if (!token || token.email !== allowedEmail) {
    return new NextResponse('Zugriff verweigert', { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|public|images).*)'], // schützt alle Seiten außer statische Dateien & API
};
