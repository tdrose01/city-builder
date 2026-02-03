import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

global.fetch = vi.fn(() => Promise.resolve({ ok: false }))

class AudioContextMock {
  constructor() {
    this.currentTime = 0
    this.state = 'running'
    this.destination = {}
  }

  resume() {
    return Promise.resolve()
  }

  createOscillator() {
    return {
      type: 'sine',
      frequency: { 
        value: 0,
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn()
      },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    }
  }

  createGain() {
    return {
      gain: { 
        value: 0,
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn()
      },
      connect: vi.fn(),
    }
  }

  close() {
    return Promise.resolve()
  }
}

global.AudioContext = AudioContextMock
global.webkitAudioContext = AudioContextMock

const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

global.ResizeObserver = ResizeObserverMock
import React from 'react'

window.ResizeObserver = ResizeObserverMock

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => {
      // Extract only valid DOM props
      const { layout, initial, animate, transition, whileHover, whileTap, ...domProps } = props;
      return React.createElement('div', domProps, children);
    },
  },
  AnimatePresence: ({ children }) => React.createElement(React.Fragment, null, children),
}))
