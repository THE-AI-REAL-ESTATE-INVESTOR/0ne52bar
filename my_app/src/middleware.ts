import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path starts with /admin (excluding /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET || "your-default-secret-do-not-use-in-production"
    });
    
    // Redirect to login if not authenticated or not admin
    if (!token || token.role !== "admin") {
      const url = new URL("/admin/login", request.url);
      url.searchParams.set("callbackUrl", encodeURI(request.url));
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

// Apply middleware to admin routes
export const config = {
  matcher: ["/admin/:path*"]
}; 