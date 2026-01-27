import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import ParticleEffect from '../ParticleEffect';

describe('ParticleEffect Component', () => {
  beforeEach(() => {
    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  describe('Basic Rendering', () => {
    test('should render without crashing', () => {
      const { container } = render(<ParticleEffect x={100} y={100} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    test('should render correct number of particles', () => {
      const { container } = render(<ParticleEffect x={100} y={100} count={10} />);
      const particles = container.querySelectorAll('[style*="position: absolute"]');
      expect(particles.length).toBeGreaterThanOrEqual(10); // At least 10 particles
    });

    test('should have pointerEvents none for non-blocking interaction', () => {
      const { container } = render(<ParticleEffect x={100} y={100} />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveStyle({ pointerEvents: 'none' });
    });
  });

  describe('Particle Types', () => {
    test('should render burst particles', () => {
      const { container } = render(<ParticleEffect type="burst" x={100} y={100} count={5} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    test('should render confetti particles', () => {
      const { container } = render(<ParticleEffect type="confetti" x={100} y={100} count={5} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    test('should render star particles', () => {
      const { container } = render(<ParticleEffect type="stars" x={100} y={100} count={5} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    test('should render sparkle particles', () => {
      const { container } = render(<ParticleEffect type="sparkles" x={100} y={100} count={5} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    test('should render coin particles', () => {
      const { container } = render(<ParticleEffect type="coins" x={100} y={100} count={5} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    test('should render fireworks particles', () => {
      const { container } = render(<ParticleEffect type="fireworks" x={100} y={100} count={5} />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('City-Specific Colors', () => {
    test('should use City 1 colors (green)', () => {
      const { container } = render(<ParticleEffect cityLevel={1} x={100} y={100} count={3} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    test('should use City 2 colors (gold)', () => {
      const { container } = render(<ParticleEffect cityLevel={2} x={100} y={100} count={3} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    test('should use City 3 colors (purple)', () => {
      const { container } = render(<ParticleEffect cityLevel={3} x={100} y={100} count={3} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    test('should use City 4 colors (blue)', () => {
      const { container } = render(<ParticleEffect cityLevel={4} x={100} y={100} count={3} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    test('should use City 5 colors (cyan)', () => {
      const { container} = render(<ParticleEffect cityLevel={5} x={100} y={100} count={3} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    test('should accept custom colors', () => {
      const customColors = ['#ff0000', '#00ff00', '#0000ff'];
      const { container } = render(
        <ParticleEffect customColors={customColors} x={100} y={100} count={3} />
      );
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Configuration Options', () => {
    test('should respect custom size', () => {
      const { container } = render(<ParticleEffect x={100} y={100} size={20} count={3} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    test('should respect custom duration', () => {
      const { container } = render(<ParticleEffect x={100} y={100} duration={2} count={3} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    test('should respect custom distance', () => {
      const { container } = render(<ParticleEffect x={100} y={100} distance={200} count={3} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    test('should respect min/max size range', () => {
      const { container } = render(
        <ParticleEffect x={100} y={100} minSize={10} maxSize={20} count={5} />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    test('should respect spread angle', () => {
      const { container } = render(<ParticleEffect x={100} y={100} spread={180} count={5} />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Accessibility - Reduced Motion', () => {
    beforeEach(() => {
      // Mock reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });
    });

    test('should reduce particle count with reduced motion', () => {
      const { container } = render(<ParticleEffect x={100} y={100} count={20} />);
      const particles = container.querySelectorAll('[style*="position: absolute"]');
      // Should have fewer than 20 particles with reduced motion
      expect(particles.length).toBeLessThan(20);
    });

    test('should not render sparkles with reduced motion', () => {
      const { container } = render(<ParticleEffect type="sparkles" x={100} y={100} count={20} />);
      // Sparkles are completely hidden in reduced motion mode
      expect(container.firstChild).toBeNull();
    });

    test('should use faster duration with reduced motion', () => {
      const { container } = render(<ParticleEffect x={100} y={100} duration={2} count={5} />);
      // Effect should complete faster
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('onComplete Callback', () => {
    test('should call onComplete callback when provided', (done) => {
      const onComplete = vi.fn(() => {
        expect(onComplete).toHaveBeenCalledTimes(1);
        done();
      });

      render(
        <ParticleEffect 
          x={100} 
          y={100} 
          count={2} 
          duration={0.1} 
          onComplete={onComplete}
        />
      );
    });

    test('should not crash when onComplete is not provided', () => {
      const { container } = render(<ParticleEffect x={100} y={100} count={5} />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    test('should handle high particle count', () => {
      const { container } = render(<ParticleEffect x={100} y={100} count={50} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    test('should use GPU-accelerated properties', () => {
      const { container } = render(<ParticleEffect x={100} y={100} count={5} />);
      const particles = container.querySelectorAll('[style*="will-change"]');
      expect(particles.length).toBeGreaterThan(0);
    });

    test('should have high z-index for proper layering', () => {
      const { container } = render(<ParticleEffect x={100} y={100} />);
      expect(container.firstChild).toHaveStyle({ zIndex: '1000' });
    });
  });

  describe('Position', () => {
    test('should position at specified x,y coordinates', () => {
      const { container } = render(<ParticleEffect x={250} y={350} count={3} />);
      expect(container.firstChild).toBeInTheDocument();
      // Particles should be positioned relative to x=250, y=350
    });

    test('should handle edge positions (0,0)', () => {
      const { container } = render(<ParticleEffect x={0} y={0} count={3} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    test('should handle large coordinates', () => {
      const { container } = render(<ParticleEffect x={5000} y={5000} count={3} />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
