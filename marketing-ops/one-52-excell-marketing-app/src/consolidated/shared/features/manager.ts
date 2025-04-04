import { z } from 'zod';
import {
  FeatureFlag,
  FeatureFlagConfig,
  FeatureFlagState,
  featureFlagSchema,
  featureFlagConfigSchema,
  featureFlagStateSchema,
} from './types';
import { featureFlags } from './config';

/**
 * Feature flag manager class
 */
export class FeatureFlagManager {
  private config: FeatureFlagConfig;
  private state: FeatureFlagState;

  /**
   * Create a new feature flag manager
   * @param config Feature flag configuration
   * @param initialState Initial feature flag state
   */
  constructor(
    config: FeatureFlagConfig = featureFlags,
    initialState: FeatureFlagState = {}
  ) {
    // Validate config
    this.config = featureFlagConfigSchema.parse(config);

    // Initialize state with default values
    this.state = Object.entries(config).reduce(
      (state, [key, flag]) => ({
        ...state,
        [key]: initialState[key] ?? flag.defaultValue,
      }),
      {}
    );

    // Validate state
    this.state = featureFlagStateSchema.parse(this.state);
  }

  /**
   * Check if a feature is enabled
   * @param featureKey Feature key
   * @returns Whether the feature is enabled
   */
  isEnabled(featureKey: string): boolean {
    // Check if feature exists
    if (!this.config[featureKey]) {
      console.warn(`Feature flag "${featureKey}" not found`);
      return false;
    }

    // Check if feature is enabled in config
    if (!this.config[featureKey].enabled) {
      return false;
    }

    // Check feature state
    const isEnabled = this.state[featureKey];

    // Check dependencies
    const dependencies = this.config[featureKey].dependencies;
    if (dependencies) {
      return (
        isEnabled &&
        dependencies.every((dependency) => this.isEnabled(dependency))
      );
    }

    return isEnabled;
  }

  /**
   * Enable a feature
   * @param featureKey Feature key
   */
  enableFeature(featureKey: string): void {
    // Check if feature exists
    if (!this.config[featureKey]) {
      console.warn(`Feature flag "${featureKey}" not found`);
      return;
    }

    // Check if feature is enabled in config
    if (!this.config[featureKey].enabled) {
      console.warn(`Feature flag "${featureKey}" is disabled in config`);
      return;
    }

    // Enable feature
    this.state[featureKey] = true;
  }

  /**
   * Disable a feature
   * @param featureKey Feature key
   */
  disableFeature(featureKey: string): void {
    // Check if feature exists
    if (!this.config[featureKey]) {
      console.warn(`Feature flag "${featureKey}" not found`);
      return;
    }

    // Disable feature
    this.state[featureKey] = false;
  }

  /**
   * Get feature flag configuration
   * @param featureKey Feature key
   * @returns Feature flag configuration
   */
  getFeature(featureKey: string): FeatureFlag | undefined {
    return this.config[featureKey];
  }

  /**
   * Get all feature flag configurations
   * @returns Feature flag configurations
   */
  getAllFeatures(): FeatureFlagConfig {
    return this.config;
  }

  /**
   * Get current feature flag state
   * @returns Feature flag state
   */
  getState(): FeatureFlagState {
    return this.state;
  }

  /**
   * Update feature flag state
   * @param state New feature flag state
   */
  setState(state: FeatureFlagState): void {
    // Validate state
    this.state = featureFlagStateSchema.parse(state);
  }

  /**
   * Reset feature flag state to default values
   */
  resetState(): void {
    this.state = Object.entries(this.config).reduce(
      (state, [key, flag]) => ({
        ...state,
        [key]: flag.defaultValue,
      }),
      {}
    );
  }
}

// Create default feature flag manager instance
export const featureFlagManager = new FeatureFlagManager(); 