import { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
 /*  try {
    const session = getSupabaseUser();

    if (!session) {
      console.error("Erreur d'authentification :");
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("Erreur lors de la vérification du token :", err);
    return NextResponse.redirect(new URL('/', request.url));
  } */
}

export const config = {
  matcher: ['/dashboard/:path*'],
};