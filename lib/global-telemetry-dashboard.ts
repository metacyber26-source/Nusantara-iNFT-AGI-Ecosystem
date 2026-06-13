'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Global Telemetry Dashboard
 * Tracks real-time transaction health and revenue splits (50-30-10-10 protocol)
 * Provides transparent logs for the ICP2E Jawa Timur community
 */

export interface TransactionRecord {
  txId: string;
  timestamp: number;
  amount: number;
  status: 'pending' | 'confirmed' | 'failed';
  splits: {
    user: number;
    community: number;
    developer: number;
    server: number;
  };
  wallets: {
    userWallet: string;
    communityWallet: string;
    developerWallet: string;
    serverWallet: string;
  };
}

export interface TelemetryMetrics {
  totalTransactions: number;
  totalVolume: number;
  successRate: number;
  averageLatency: number;
  revenueDistributed: {
    user: number;
    community: number;
    developer: number;
    server: number;
  };
  topSplits: Array<{ date: string; volume: number; transactions: number }>;
}

export class GlobalTelemetryDashboard {
  private transactions: TransactionRecord[] = [];
  private metrics: TelemetryMetrics = {
    totalTransactions: 0,
    totalVolume: 0,
    successRate: 100,
    averageLatency: 0,
    revenueDistributed: { user: 0, community: 0, developer: 0, server: 0 },
    topSplits: [],
  };

  private listeners: Set<(metrics: TelemetryMetrics) => void> = new Set();

  constructor() {
    this.loadFromStorage();
    this.startMetricsAggregation();
  }

  /**
   * Record a transaction and automatically calculate splits
   */
  public recordTransaction(transaction: Omit<TransactionRecord, 'splits'>): void {
    const splits = {
      user: transaction.amount * 0.5,
      community: transaction.amount * 0.3,
      developer: transaction.amount * 0.1,
      server: transaction.amount * 0.1,
    };

    const record: TransactionRecord = {
      ...transaction,
      splits,
    };

    this.transactions.push(record);
    this.updateMetrics();
    this.notifyListeners();
    this.persistToStorage();

    console.log('[Telemetry] Transaction recorded:', {
      txId: record.txId,
      amount: record.amount,
      splits,
      status: record.status,
    });
  }

  /**
   * Update transaction status
   */
  public updateTransactionStatus(
    txId: string,
    status: TransactionRecord['status'],
  ): void {
    const transaction = this.transactions.find((t) => t.txId === txId);
    if (transaction) {
      transaction.status = status;
      this.updateMetrics();
      this.notifyListeners();
      this.persistToStorage();

      console.log('[Telemetry] Transaction status updated:', { txId, status });
    }
  }

  /**
   * Calculate current metrics
   */
  private updateMetrics(): void {
    const confirmed = this.transactions.filter((t) => t.status === 'confirmed');
    const failed = this.transactions.filter((t) => t.status === 'failed');
    const allLatencies: number[] = [];

    let totalUser = 0;
    let totalCommunity = 0;
    let totalDeveloper = 0;
    let totalServer = 0;

    for (const tx of confirmed) {
      totalUser += tx.splits.user;
      totalCommunity += tx.splits.community;
      totalDeveloper += tx.splits.developer;
      totalServer += tx.splits.server;
      allLatencies.push(Date.now() - tx.timestamp);
    }

    const totalVolume = confirmed.reduce((sum, tx) => sum + tx.amount, 0);
    const successRate =
      this.transactions.length === 0
        ? 100
        : ((confirmed.length / this.transactions.length) * 100).toFixed(2);

    this.metrics = {
      totalTransactions: this.transactions.length,
      totalVolume,
      successRate: parseFloat(successRate as string),
      averageLatency:
        allLatencies.length > 0
          ? allLatencies.reduce((a, b) => a + b) / allLatencies.length
          : 0,
      revenueDistributed: {
        user: parseFloat(totalUser.toFixed(2)),
        community: parseFloat(totalCommunity.toFixed(2)),
        developer: parseFloat(totalDeveloper.toFixed(2)),
        server: parseFloat(totalServer.toFixed(2)),
      },
      topSplits: this.aggregateByDate(),
    };
  }

  /**
   * Aggregate transaction volume by date
   */
  private aggregateByDate(): Array<{ date: string; volume: number; transactions: number }> {
    const byDate = new Map<string, { volume: number; transactions: number }>();

    for (const tx of this.transactions.filter((t) => t.status === 'confirmed')) {
      const date = new Date(tx.timestamp).toISOString().split('T')[0];
      const existing = byDate.get(date) || { volume: 0, transactions: 0 };
      existing.volume += tx.amount;
      existing.transactions += 1;
      byDate.set(date, existing);
    }

    return Array.from(byDate.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 30); // Last 30 days
  }

  /**
   * Get detailed transaction logs
   */
  public getTransactionLogs(limit: number = 100): TransactionRecord[] {
    return this.transactions
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  /**
   * Get revenue split verification report
   */
  public getRevenueSplitReport(): {
    protocol: string;
    totalProcessed: number;
    splits: Record<string, { percentage: number; amount: number; wallets: string[] }>;
    auditTrail: TransactionRecord[];
  } {
    return {
      protocol: '50-30-10-10 (User-Community-Developer-Server)',
      totalProcessed: this.metrics.totalVolume,
      splits: {
        user: {
          percentage: 50,
          amount: this.metrics.revenueDistributed.user,
          wallets: this.transactions
            .map((t) => t.wallets.userWallet)
            .filter((v, i, a) => a.indexOf(v) === i),
        },
        community: {
          percentage: 30,
          amount: this.metrics.revenueDistributed.community,
          wallets: this.transactions
            .map((t) => t.wallets.communityWallet)
            .filter((v, i, a) => a.indexOf(v) === i),
        },
        developer: {
          percentage: 10,
          amount: this.metrics.revenueDistributed.developer,
          wallets: this.transactions
            .map((t) => t.wallets.developerWallet)
            .filter((v, i, a) => a.indexOf(v) === i),
        },
        server: {
          percentage: 10,
          amount: this.metrics.revenueDistributed.server,
          wallets: this.transactions
            .map((t) => t.wallets.serverWallet)
            .filter((v, i, a) => a.indexOf(v) === i),
        },
      },
      auditTrail: this.getTransactionLogs(1000),
    };
  }

  /**
   * Monitor and alert on anomalies
   */
  public detectAnomalies(): string[] {
    const alerts: string[] = [];

    // Success rate below 95%
    if (this.metrics.successRate < 95) {
      alerts.push(
        `⚠️ Success rate critical: ${this.metrics.successRate}% (below 95% threshold)`,
      );
    }

    // Latency spike
    if (this.metrics.averageLatency > 5000) {
      alerts.push(
        `⚠️ High latency detected: ${Math.round(this.metrics.averageLatency)}ms`,
      );
    }

    // Revenue split verification
    const totalSplit = Object.values(this.metrics.revenueDistributed).reduce(
      (a, b) => a + b,
      0,
    );
    const expectedTotal = this.metrics.totalVolume;
    if (Math.abs(totalSplit - expectedTotal) > 0.01) {
      alerts.push(
        `⚠️ Revenue split mismatch: ${totalSplit.toFixed(2)} vs expected ${expectedTotal.toFixed(2)}`,
      );
    }

    return alerts;
  }

  /**
   * Subscribe to metrics updates
   */
  public subscribe(listener: (metrics: TelemetryMetrics) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.metrics));
  }

  /**
   * Persist metrics to local storage
   */
  private persistToStorage(): void {
    try {
      localStorage.setItem(
        'telemetry_transactions',
        JSON.stringify(this.transactions.slice(-1000)),
      );
      localStorage.setItem('telemetry_metrics', JSON.stringify(this.metrics));
    } catch (error) {
      console.error('[Telemetry] Storage error:', error);
    }
  }

  /**
   * Load metrics from storage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('telemetry_transactions');
      if (stored) {
        this.transactions = JSON.parse(stored);
        this.updateMetrics();
      }
    } catch (error) {
      console.error('[Telemetry] Load error:', error);
    }
  }

  /**
   * Start continuous metrics aggregation
   */
  private startMetricsAggregation(): void {
    setInterval(() => {
      this.updateMetrics();
      this.notifyListeners();
    }, 5000);
  }

  /**
   * Get current metrics
   */
  public getMetrics(): TelemetryMetrics {
    return { ...this.metrics };
  }

  /**
   * Export metrics for reporting
   */
  public exportMetrics(): string {
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        metrics: this.metrics,
        transactionCount: this.transactions.length,
        reports: {
          revenueSplit: this.getRevenueSplitReport(),
          anomalies: this.detectAnomalies(),
        },
      },
      null,
      2,
    );
  }
}

export function useTelemetryDashboard() {
  const [dashboard] = useState(() => new GlobalTelemetryDashboard());
  const [metrics, setMetrics] = useState<TelemetryMetrics>(dashboard.getMetrics());

  useEffect(() => {
    const unsubscribe = dashboard.subscribe((updatedMetrics) => {
      setMetrics(updatedMetrics);
    });

    return unsubscribe;
  }, [dashboard]);

  return { dashboard, metrics };
}

export const globalTelemetry = new GlobalTelemetryDashboard();
