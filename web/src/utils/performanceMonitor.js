/**
 * Performance Monitoring Utility
 * 
 * Provides tools to measure and track app performance:
 * - FPS tracking
 * - Memory usage
 * - Render count
 * - Component timing
 */

class PerformanceMonitor {
  constructor() {
    this.fps = 60;
    this.fpsHistory = [];
    this.memoryHistory = [];
    this.renderCounts = {};
    this.lastFrameTime = performance.now();
    this.isMonitoring = false;
    this.maxHistoryLength = 300; // 5 minutes at 1 sample/second
  }

  /**
   * Start monitoring performance
   */
  start() {
    if (this.isMonitoring) return;
    this.isMonitoring = true;
    this.monitorFPS();
    this.monitorMemory();
    console.log('Performance monitoring started');
  }

  /**
   * Stop monitoring performance
   */
  stop() {
    this.isMonitoring = false;
    console.log('Performance monitoring stopped');
  }

  /**
   * Monitor FPS
   */
  monitorFPS() {
    if (!this.isMonitoring) return;

    const now = performance.now();
    const delta = now - this.lastFrameTime;
    this.lastFrameTime = now;

    // Calculate FPS
    const currentFPS = Math.round(1000 / delta);
    this.fps = currentFPS;

    // Update history (sample every second)
    if (this.fpsHistory.length === 0 || now - this.fpsHistory[this.fpsHistory.length - 1].time > 1000) {
      this.fpsHistory.push({
        time: now,
        fps: currentFPS
      });

      // Limit history size
      if (this.fpsHistory.length > this.maxHistoryLength) {
        this.fpsHistory.shift();
      }
    }

    requestAnimationFrame(() => this.monitorFPS());
  }

  /**
   * Monitor memory usage
   */
  monitorMemory() {
    if (!this.isMonitoring) return;

    // Check if memory API is available
    if (performance.memory) {
      const memoryMB = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
      
      this.memoryHistory.push({
        time: performance.now(),
        memory: memoryMB
      });

      // Limit history size
      if (this.memoryHistory.length > this.maxHistoryLength) {
        this.memoryHistory.shift();
      }
    }

    // Check memory every 5 seconds
    setTimeout(() => this.monitorMemory(), 5000);
  }

  /**
   * Track component render
   */
  trackRender(componentName) {
    if (!this.renderCounts[componentName]) {
      this.renderCounts[componentName] = 0;
    }
    this.renderCounts[componentName]++;
  }

  /**
   * Get current FPS
   */
  getCurrentFPS() {
    return this.fps;
  }

  /**
   * Get FPS statistics
   */
  getFPSStats() {
    if (this.fpsHistory.length === 0) {
      return { min: 0, max: 0, avg: 0, current: this.fps };
    }

    const fpsValues = this.fpsHistory.map(h => h.fps);
    return {
      min: Math.min(...fpsValues),
      max: Math.max(...fpsValues),
      avg: Math.round(fpsValues.reduce((a, b) => a + b, 0) / fpsValues.length),
      current: this.fps
    };
  }

  /**
   * Get memory statistics
   */
  getMemoryStats() {
    if (this.memoryHistory.length === 0 || !performance.memory) {
      return { current: 0, min: 0, max: 0, trend: 'stable' };
    }

    const memoryValues = this.memoryHistory.map(h => h.memory);
    const currentMemory = memoryValues[memoryValues.length - 1];
    const startMemory = memoryValues[0];
    const trend = currentMemory > startMemory * 1.2 ? 'increasing' :
                  currentMemory < startMemory * 0.8 ? 'decreasing' : 'stable';

    return {
      current: currentMemory,
      min: Math.min(...memoryValues),
      max: Math.max(...memoryValues),
      trend
    };
  }

  /**
   * Get render count statistics
   */
  getRenderStats() {
    return { ...this.renderCounts };
  }

  /**
   * Reset statistics
   */
  reset() {
    this.fpsHistory = [];
    this.memoryHistory = [];
    this.renderCounts = {};
  }

  /**
   * Get full performance report
   */
  getReport() {
    return {
      fps: this.getFPSStats(),
      memory: this.getMemoryStats(),
      renders: this.getRenderStats(),
      monitoring: this.isMonitoring
    };
  }

  /**
   * Log performance report to console
   */
  logReport() {
    const report = this.getReport();
    console.group('Performance Report');
    console.log('FPS:', report.fps);
    console.log('Memory:', report.memory);
    console.log('Render Counts:', report.renders);
    console.groupEnd();
    return report;
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

// Auto-start in development
if (import.meta.env.DEV) {
  performanceMonitor.start();
}

export default performanceMonitor;
