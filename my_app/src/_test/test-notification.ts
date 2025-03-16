/**
 * Test file to check if watcher detects changes
 */
import { TestUser } from './test-model';

/**
 * Represents a system alert to administrators
 * @prisma.model
 */
export interface TestAlert {
  /** Unique identifier for the alert */
  id: string;
  
  /** Severity level (info, warning, error, critical) */
  severity: string;
  
  /** Alert message */
  message: string;
  
  /** When the alert was triggered */
  createdAt: Date;
  
  /** Whether the alert has been acknowledged */
  acknowledged: boolean;
  
  /** When the alert was acknowledged */
  acknowledgedAt?: Date;
  
  /** Who acknowledged the alert */
  acknowledgedById?: string;
  
  /** Reference to the user who acknowledged */
  acknowledgedBy?: TestUser;
} 