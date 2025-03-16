/**
 * User model definitions
 */

/**
 * Represents a user's permission
 * @prisma.model
 */
export interface Permission {
  /** Unique identifier */
  id: string;
  
  /** Permission name (e.g., "manage_events") */
  name: string;
  
  /** Permission description */
  description: string;
  
  /** Roles with this permission */
  roles: Role[];
}

/**
 * Represents a user role
 * @prisma.model
 */
export interface Role {
  /** Unique identifier */
  id: string;
  
  /** Role name (e.g., "admin", "editor") */
  name: string;
  
  /** Role description */
  description: string;
  
  /** Permissions granted to this role */
  permissions: Permission[];
  
  /** Users assigned to this role */
  users: User[];
}

/**
 * Represents an account linked to a user (for OAuth)
 * @prisma.model
 */
export interface Account {
  /** Unique identifier */
  id: string;
  
  /** User ID */
  userId: string;
  
  /** User this account belongs to */
  user: User;
  
  /** Provider type (oauth, email, etc) */
  type: string;
  
  /** Provider name (google, facebook, etc) */
  provider: string;
  
  /** Provider account ID */
  providerAccountId: string;
  
  /** Provider refresh token */
  refresh_token?: string;
  
  /** Provider access token */
  access_token?: string;
  
  /** Access token expires at time */
  expires_at?: number;
  
  /** Provider token type */
  token_type?: string;
  
  /** Provider scope */
  scope?: string;
  
  /** Provider ID token */
  id_token?: string;
  
  /** Provider session state */
  session_state?: string;
}

/**
 * Represents a user session
 * @prisma.model
 */
export interface Session {
  /** Unique identifier */
  id: string;
  
  /** Session token */
  sessionToken: string;
  
  /** User ID */
  userId: string;
  
  /** User this session belongs to */
  user: User;
  
  /** Expiration date */
  expires: Date;
}

/**
 * Represents a verification request
 * @prisma.model
 */
export interface VerificationToken {
  /** Identifier - the email or phone */
  identifier: string;
  
  /** The token */
  token: string;
  
  /** Expiration date */
  expires: Date;
}

/**
 * Represents a user
 * @prisma.model
 */
export interface User {
  /** Unique identifier */
  id: string;
  
  /** User's name */
  name?: string;
  
  /** User's email */
  email?: string;
  
  /** User's email verified timestamp */
  emailVerified?: Date;
  
  /** User's profile image */
  image?: string;
  
  /** When the user was created */
  createdAt: Date;
  
  /** When the user was updated */
  updatedAt: Date;
  
  /** User's assigned roles */
  roles: Role[];
  
  /** User's OAuth accounts */
  accounts: Account[];
  
  /** User's active sessions */
  sessions: Session[];
} 