import { z } from 'zod';

/**
 * Feature flag configuration
 */
export interface FeatureFlag {
  name: string;
  description: string;
  enabled: boolean;
  defaultValue: boolean;
  dependencies?: string[];
}

/**
 * Feature flag configuration schema
 */
export const featureFlagSchema = z.object({
  name: z.string(),
  description: z.string(),
  enabled: z.boolean(),
  defaultValue: z.boolean(),
  dependencies: z.array(z.string()).optional(),
});

/**
 * Feature flag configuration map
 */
export interface FeatureFlagConfig {
  [key: string]: FeatureFlag;
}

/**
 * Feature flag configuration schema
 */
export const featureFlagConfigSchema = z.record(featureFlagSchema);

/**
 * Feature flag state
 */
export interface FeatureFlagState {
  [key: string]: boolean;
}

/**
 * Feature flag state schema
 */
export const featureFlagStateSchema = z.record(z.boolean()); 