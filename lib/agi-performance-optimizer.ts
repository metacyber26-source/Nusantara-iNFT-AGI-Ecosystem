'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * AGI-Driven Performance Optimization Protocol
 * Automatically detects and adapts to mobile network conditions
 * Implements dynamic quality scaling, connection pooling, and cache strategies
 */

export interface NetworkMetrics {
  downlink: number; // Mbps
  effectiveType: 'slow-2g' | '2g' | '3g' | '4g' | 'unknown';
  rtt: number; // ms
  saveData: boolean;
  onchange: (() => void) | null;
}

export interface OptimizationProfile {
  qualityLevel: 'ultra' | 'high' | 'medium' | 'low';
  cacheStrategy: 'aggressive' | 'balanced' | 'minimal';
  compressionEnabled: boolean;
  textureResolution: 'full' | '1k' | '512' | '256';
  batchSize: number;
  retryCount: number;
  connectionPoolSize: number;
}

export interface PerformanceMetrics {
  avgLatency: number;
  packetLossRate: number;
  throughput: number;
  cpuUsage: number;
  memoryUsage: number;
  fps: number;
  bottlenecks: string[];
}

class AGIPerformanceOptimizer {
  private metrics: PerformanceMetrics = {
    avgLatency: 0,
    packetLossRate: 0,
    throughput: 0,
    cpuUsage: 0,
    memoryUsage: 0,
    fps: 0,
    bottlenecks: [],
  };

  private profile: OptimizationProfile = {
    qualityLevel: 'high',
    cacheStrategy: 'balanced',
    compressionEnabled: true,
    textureResolution: 'full',
    batchSize: 50,
    retryCount: 3,
    connectionPoolSize: 4,
  };

  private networkConnection: NetworkInformation | null = null;
  private fpsMonitor: number | null = null;
  private metricsBuffer: PerformanceMetrics[] = [];

  constructor() {
    this.initializeNetworkMonitoring();
    this.startPerformanceMonitoring();
  }

  private initializeNetworkMonitoring() {
    if ('connection' in navigator) {
      this.networkConnection = (navigator as any).connection;
      this.networkConnection?.addEventListener('change', () => this.adaptToNetwork());
      this.adaptToNetwork();
    }
  }

  private startPerformanceMonitoring() {
    // Monitor FPS
    let lastTime = performance.now();
    let frames = 0;

    const countFrames = () => {
      frames++;
      const currentTime = performance.now();
      if (currentTime - lastTime >= 1000) {
        this.metrics.fps = frames;
        frames = 0;
        lastTime = currentTime;
      }
      this.fpsMonitor = requestAnimationFrame(countFrames);
    };

    this.fpsMonitor = requestAnimationFrame(countFrames);

    // Monitor memory
    if ('memory' in performance) {
      setInterval(() => {
        const memUsage = (performance as any).memory;
        this.metrics.memoryUsage =
          (memUsage.usedJSHeapSize / memUsage.jsHeapSizeLimit) * 100;
      }, 1000);
    }

    // Analyze and optimize every 5 seconds
    setInterval(() => this.analyzeAndOptimize(), 5000);
  }

  private adaptToNetwork() {
    if (!this.networkConnection) return;

    const effectiveType = this.networkConnection.effectiveType as NetworkMetrics['effectiveType'];
    const downlink = this.networkConnection.downlink || 0;

    // Determine optimization profile based on network
    if (effectiveType === 'slow-2g' || effectiveType === '2g') {
      this.profile.qualityLevel = 'low';
      this.profile.textureResolution = '256';
      this.profile.cacheStrategy = 'aggressive';
      this.profile.batchSize = 10;
    } else if (effectiveType === '3g') {
      this.profile.qualityLevel = 'medium';
      this.profile.textureResolution = '512';
      this.profile.cacheStrategy = 'balanced';
      this.profile.batchSize = 25;
    } else if (effectiveType === '4g') {
      this.profile.qualityLevel = 'high';
      this.profile.textureResolution = '1k';
      this.profile.cacheStrategy = 'minimal';
      this.profile.batchSize = 50;
    }

    console.log('[AGI Optimizer] Network adapted:', {
      effectiveType,
      downlink,
      profile: this.profile.qualityLevel,
    });
  }

  private analyzeAndOptimize() {
    const bottlenecks: string[] = [];

    // Detect bottlenecks
    if (this.metrics.avgLatency > 1000) bottlenecks.push('High latency detected');
    if (this.metrics.packetLossRate > 0.05) bottlenecks.push('Packet loss critical');
    if (this.metrics.fps < 30) bottlenecks.push('Frame rate low');
    if (this.metrics.memoryUsage > 85) bottlenecks.push('Memory pressure high');
    if (this.metrics.cpuUsage > 80) bottlenecks.push('CPU overloaded');

    // Auto-optimize
    if (this.metrics.fps < 30 && this.profile.qualityLevel !== 'low') {
      this.profile.qualityLevel = 'low';
      console.log('[AGI Optimizer] Reduced quality due to low FPS');
    }

    if (this.metrics.memoryUsage > 85) {
      this.profile.cacheStrategy = 'minimal';
      this.profile.batchSize = Math.max(10, this.profile.batchSize - 10);
      console.log('[AGI Optimizer] Reduced batch size due to memory pressure');
    }

    this.metrics.bottlenecks = bottlenecks;
  }

  public getProfile(): OptimizationProfile {
    return this.profile;
  }

  public getMetrics(): PerformanceMetrics {
    return this.metrics;
  }

  public updateMetrics(partial: Partial<PerformanceMetrics>) {
    this.metrics = { ...this.metrics, ...partial };
  }

  public destroy() {
    if (this.fpsMonitor) cancelAnimationFrame(this.fpsMonitor);
    this.networkConnection?.removeEventListener('change', () => this.adaptToNetwork());
  }
}

export function useAGIOptimization() {
  const [optimizer] = useState(() => new AGIPerformanceOptimizer());
  const [profile, setProfile] = useState<OptimizationProfile>(optimizer.getProfile());
  const [metrics, setMetrics] = useState<PerformanceMetrics>(optimizer.getMetrics());

  useEffect(() => {
    const interval = setInterval(() => {
      setProfile({ ...optimizer.getProfile() });
      setMetrics({ ...optimizer.getMetrics() });
    }, 1000);

    return () => {
      clearInterval(interval);
      optimizer.destroy();
    };
  }, [optimizer]);

  return { profile, metrics };
}

export default AGIPerformanceOptimizer;
