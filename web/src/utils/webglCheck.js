/**
 * WebGL Support Check
 * Detects if WebGL is available and returns helpful info
 */

export function checkWebGLSupport() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      return { 
        supported: false, 
        reason: 'WebGL not supported',
        mode: null 
      };
    }
    
    // Check for WebGL 2
    const gl2 = canvas.getContext('webgl2');
    
    return {
      supported: true,
      mode: gl2 ? 'WebGL 2' : 'WebGL 1',
      vendor: gl.getParameter(gl.VENDOR),
      renderer: gl.getParameter(gl.RENDERER),
      version: gl.getParameter(gl.VERSION)
    };
  } catch (e) {
    return { 
      supported: false, 
      reason: e.message,
      mode: null 
    };
  }
}

export function isHardwareAccelerationEnabled() {
  const info = checkWebGLSupport();
  if (!info.supported) return false;
  
  // Check if it's using software rendering
  const isSoftware = info.renderer?.toLowerCase().includes('swiftshader') ||
                     info.renderer?.toLowerCase().includes('llvmpipe') ||
                     info.renderer?.toLowerCase().includes('software');
  
  return !isSoftware;
}

export function getWebGLContextOptions() {
  const info = checkWebGLSupport();
  
  if (!info.supported) {
    throw new Error('WebGL is not supported on this device');
  }
  
  return {
    antialias: true,
    alpha: true,
    powerPreference: isHardwareAccelerationEnabled() ? "high-performance" : "low-power",
    failIfMajorPerformanceCaveat: false // Allow software rendering as fallback
  };
}
