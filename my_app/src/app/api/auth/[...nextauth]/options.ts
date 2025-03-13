import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";

// Extend the JWT type
interface ExtendedJWT extends JWT {
  role?: string;
}

// Extend the Session type
interface ExtendedSession {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
}

// Admin user credentials - In a real app, this would be in a database
const adminUsers = [
  { id: "1", name: "Admin", email: "admin@one52bar.com", password: "one52adminpassword" }
];

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form
      name: "Credentials",
      // The fields needed to log in
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@one52bar.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Simple validation
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find user with matching email
        const user = adminUsers.find(user => user.email === credentials.email);
        
        // Check credentials
        if (user && user.password === credentials.password) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: "admin"
          };
        }
        
        // Invalid credentials
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add role to JWT token when user signs in
      if (user) {
        (token as ExtendedJWT).role = "admin";
      }
      return token;
    },
    async session({ session, token }) {
      // Add role to session from token
      if (session?.user) {
        (session as ExtendedSession).user.role = (token as ExtendedJWT).role;
      }
      return session;
    }
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  session: {
    strategy: "jwt",
    maxAge: 3600, // 1 hour
  },
  secret: process.env.NEXTAUTH_SECRET || "your-default-secret-do-not-use-in-production",
}; 