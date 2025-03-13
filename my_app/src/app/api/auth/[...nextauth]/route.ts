import NextAuth from "next-auth";
import { authOptions } from "./options";

// Create the handler with the imported options
const handler = NextAuth(authOptions);

// Export the API route handlers
export { handler as GET, handler as POST }; 