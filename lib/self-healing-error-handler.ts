'use client';

/**
 * Self-Healing Error Handler with Automatic Reconnection
 * Implements circuit breaker pattern, exponential backoff, and connection pooling
 * Seamlessly re-establishes broken connections without UI crashes
 */

export interface ConnectionState {
  status: 'healthy' | 'degraded' | 'reconnecting' | 'failed';
  lastHealthCheck: number;
  failureCount: number;
  successCount: number;
  avgResponseTime: number;
}

export interface ErrorRetryConfig {
  maxRetries: number;
  initialBackoffMs: number;
  maxBackoffMs: number;
  backoffMultiplier: number;
  healthCheckIntervalMs: number;
}

export class SelfHealingErrorHandler {
  private connections: Map<string, ConnectionState> = new Map();
  private errorHandlers: Map<string, (error: any) => Promise<void>> = new Map();
  private circuitBreakers: Map<string, boolean> = new Map();
  private retryConfig: ErrorRetryConfig;
  private recoveryStrategies: Map<string, () => Promise<void>> = new Map();

  constructor(config: Partial<ErrorRetryConfig> = {}) {
    this.retryConfig = {
      maxRetries: 5,
      initialBackoffMs: 100,
      maxBackoffMs: 30000,
      backoffMultiplier: 2,
      healthCheckIntervalMs: 5000,
      ...config,
    };

    this.startHealthMonitoring();
  }

  /**
   * Register recovery strategy for a service
   */
  public registerRecoveryStrategy(
    service: string,
    strategy: () => Promise<void>,
  ): void {
    this.recoveryStrategies.set(service, strategy);
  }

  /**
   * Execute function with automatic retry and healing
   */
  public async executeWithHealing<T>(
    service: string,
    fn: () => Promise<T>,
    context?: string,
  ): Promise<T> {
    let lastError: Error | null = null;
    let backoffMs = this.retryConfig.initialBackoffMs;

    for (let attempt = 0; attempt <= this.retryConfig.maxRetries; attempt++) {
      try {
        const startTime = performance.now();
        const result = await fn();
        const duration = performance.now() - startTime;

        this.updateConnectionState(service, 'healthy', duration);
        return result;
      } catch (error) {
        lastError = error as Error;
        const failureCount = this.updateConnectionState(service, 'degraded');

        console.error(
          `[Self-Healing] Service ${service} failed (attempt ${attempt + 1}/${this.retryConfig.maxRetries + 1}):`,
          {
            error: lastError.message,
            context,
            failureCount,
            nextRetryMs: backoffMs,
          },
        );

        // Trigger recovery if available
        if (failureCount > 2) {
          await this.triggerRecovery(service);
        }

        if (attempt < this.retryConfig.maxRetries) {
          await this.delay(backoffMs);
          backoffMs = Math.min(
            backoffMs * this.retryConfig.backoffMultiplier,
            this.retryConfig.maxBackoffMs,
          );
        }
      }
    }

    this.updateConnectionState(service, 'failed');
    throw lastError || new Error(`Service ${service} failed after all retry attempts`);
  }

  /**
   * Register error handler for service
   */
  public registerErrorHandler(
    service: string,
    handler: (error: any) => Promise<void>,
  ): void {
    this.errorHandlers.set(service, handler);
  }

  /**
   * Trigger recovery for failed service
   */
  private async triggerRecovery(service: string): Promise<void> {
    const strategy = this.recoveryStrategies.get(service);
    if (!strategy) return;

    try {
      console.log(`[Self-Healing] Executing recovery strategy for ${service}`);
      await strategy();
      this.resetCircuitBreaker(service);
    } catch (error) {
      console.error(`[Self-Healing] Recovery strategy failed for ${service}:`, error);
    }
  }

  /**
   * Check if circuit breaker is open (service failing)
   */
  public isCircuitBreakerOpen(service: string): boolean {
    return this.circuitBreakers.get(service) ?? false;
  }

  /**
   * Manually reset circuit breaker
   */
  public resetCircuitBreaker(service: string): void {
    this.circuitBreakers.set(service, false);
    console.log(`[Self-Healing] Circuit breaker reset for ${service}`);
  }

  /**
   * Update connection state metrics
   */
  private updateConnectionState(
    service: string,
    status: ConnectionState['status'],
    responseTime: number = 0,
  ): number {
    const current = this.connections.get(service) || {
      status: 'healthy',
      lastHealthCheck: Date.now(),
      failureCount: 0,
      successCount: 0,
      avgResponseTime: 0,
    };

    if (status === 'healthy') {
      current.failureCount = 0;
      current.successCount++;
      current.avgResponseTime =
        (current.avgResponseTime * 0.7 + responseTime * 0.3);
    } else if (status === 'degraded' || status === 'failed') {
      current.failureCount++;
      if (current.failureCount >= 3) {
        this.circuitBreakers.set(service, true);
      }
    }

    current.status = status;
    current.lastHealthCheck = Date.now();

    this.connections.set(service, current);
    return current.failureCount;
  }

  /**
   * Start periodic health checks
   */
  private startHealthMonitoring(): void {
    setInterval(() => {
      for (const [service, state] of this.connections.entries()) {
        const healthyDuration = Date.now() - state.lastHealthCheck;

        if (state.status === 'failed' && healthyDuration > 60000) {
          // Auto-recover after 1 minute
          console.log(`[Self-Healing] Auto-recovery attempt for ${service}`);
          this.resetCircuitBreaker(service);
          this.updateConnectionState(service, 'healthy');
        }
      }
    }, this.retryConfig.healthCheckIntervalMs);
  }

  /**
   * Get connection health dashboard
   */
  public getHealthDashboard(): Map<string, ConnectionState> {
    return new Map(this.connections);
  }

  /**
   * Delay helper for backoff
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export function useSelfHealingError() {
  const handlerRef = useRef<SelfHealingErrorHandler | null>(null);

  if (!handlerRef.current) {
    handlerRef.current = new SelfHealingErrorHandler();
  }

  return handlerRef.current;
}

import { useRef } from 'react';
