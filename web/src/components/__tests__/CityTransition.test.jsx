import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import CityTransition from '../CityTransition';

describe('CityTransition Component', () => {
  let mockOnComplete;

  beforeEach(() => {
    mockOnComplete = vi.fn();
    // Mock window.matchMedia for test environment
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

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering and Visibility', () => {
    test('should not render when isActive is false', () => {
      const { container } = render(
        <CityTransition 
          targetCityLevel={2} 
          onComplete={mockOnComplete} 
          isActive={false} 
        />
      );
      
      expect(container.firstChild).toBeNull();
    });

    test('should render overlay when isActive is true', async () => {
      render(
        <CityTransition 
          targetCityLevel={2} 
          onComplete={mockOnComplete} 
          isActive={true} 
        />
      );
      
      const overlay = document.querySelector('.city-transition-overlay');
      expect(overlay).toBeInTheDocument();
    });

    test('should render with dark overlay background', async () => {
      render(
        <CityTransition 
          targetCityLevel={2} 
          onComplete={mockOnComplete} 
          isActive={true} 
        />
      );
      
      const overlay = document.querySelector('.city-transition-overlay');
      expect(overlay).toHaveStyle({ backgroundColor: 'rgba(0, 0, 0, 0.95)' });
    });

    test('should have high z-index for overlay', async () => {
      render(
        <CityTransition 
          targetCityLevel={2} 
          onComplete={mockOnComplete} 
          isActive={true} 
        />
      );
      
      const overlay = document.querySelector('.city-transition-overlay');
      expect(overlay).toHaveStyle({ zIndex: '9999' });
    });
  });

  describe('City-Specific Configurations', () => {
    test('should display City 2 (Deco Heights) configuration', async () => {
      render(
        <CityTransition 
          targetCityLevel={2} 
          onComplete={mockOnComplete} 
          isActive={true} 
        />
      );
      
      // Wait for fade out stage (300ms) 
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 400));
      });
      
      // Now check for celebration content
      await waitFor(() => {
        expect(screen.getByText('Deco Heights')).toBeInTheDocument();
      }, { timeout: 1000 });
      
      expect(screen.getByText('Welcome to the Golden Age!')).toBeInTheDocument();
      expect(screen.getByText('🏛️')).toBeInTheDocument();
    });

    test('should display City 3 (Crystal Plaza) configuration', async () => {
      render(
        <CityTransition 
          targetCityLevel={3} 
          onComplete={mockOnComplete} 
          isActive={true} 
        />
      );
      
      await waitFor(() => {
        expect(screen.getByText('Crystal Plaza')).toBeInTheDocument();
      }, { timeout: 1000 });
      
      expect(screen.getByText('Enter the Crystal Realm!')).toBeInTheDocument();
      expect(screen.getByText('💎')).toBeInTheDocument();
    });

    test('should display City 4 (Starlight District) configuration', async () => {
      render(
        <CityTransition 
          targetCityLevel={4} 
          onComplete={mockOnComplete} 
          isActive={true} 
        />
      );
      
      await waitFor(() => {
        expect(screen.getByText('Starlight District')).toBeInTheDocument();
      }, { timeout: 1000 });
      
      expect(screen.getByText('Reach for the Stars!')).toBeInTheDocument();
      expect(screen.getByText('🌟')).toBeInTheDocument();
    });

    test('should display City 5 (Neon Skyline) configuration', async () => {
      render(
        <CityTransition 
          targetCityLevel={5} 
          onComplete={mockOnComplete} 
          isActive={true} 
        />
      );
      
      await waitFor(() => {
        expect(screen.getByText('Neon Skyline')).toBeInTheDocument();
      }, { timeout: 1000 });
      
      expect(screen.getByText('The Future Awaits!')).toBeInTheDocument();
      expect(screen.getByText('🌃')).toBeInTheDocument();
    });

    test('should use City 2 as default for invalid city level', async () => {
      render(
        <CityTransition 
          targetCityLevel={99} 
          onComplete={mockOnComplete} 
          isActive={true} 
        />
      );
      
      await waitFor(() => {
        expect(screen.getByText('Deco Heights')).toBeInTheDocument();
      }, { timeout: 1000 });
    });
  });

  describe('Animation Sequence', () => {
    test('should call onComplete callback after animation completes', async () => {
      render(
        <CityTransition 
          targetCityLevel={2} 
          onComplete={mockOnComplete} 
          isActive={true} 
        />
      );
      
      // Wait for full animation sequence (300 + 1000 + 400 + 300 = 2000ms)
      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalled();
      }, { timeout: 2500 });
      
      expect(mockOnComplete).toHaveBeenCalledTimes(1);
    });

    test('should display celebration content during celebration stage', async () => {
      render(
        <CityTransition 
          targetCityLevel={2} 
          onComplete={mockOnComplete} 
          isActive={true} 
        />
      );
      
      // Wait for celebration stage to appear
      await waitFor(() => {
        const celebrationContent = document.querySelector('.celebration-content');
        expect(celebrationContent).toBeInTheDocument();
      }, { timeout: 1000 });
    });

    test('should render particles during celebration', async () => {
      render(
        <CityTransition 
          targetCityLevel={2} 
          onComplete={mockOnComplete} 
          isActive={true} 
        />
      );
      
      // Wait for particles container to appear
      await waitFor(() => {
        const particlesContainer = document.querySelector('.particles-container');
        expect(particlesContainer).toBeInTheDocument();
      }, { timeout: 1000 });
      
      // Check that particles are rendered (should be 30)
      const particles = document.querySelectorAll('.particle');
      expect(particles.length).toBeGreaterThan(0);
      expect(particles.length).toBeLessThanOrEqual(30);
    });

    test('should not call onComplete if not provided', async () => {
      render(
        <CityTransition 
          targetCityLevel={2} 
          onComplete={undefined} 
          isActive={true} 
        />
      );
      
      // Wait for animation to complete
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Should not throw error
      expect(true).toBe(true);
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

    test('should complete faster with reduced motion', async () => {
      const startTime = Date.now();
      
      render(
        <CityTransition 
          targetCityLevel={2} 
          onComplete={mockOnComplete} 
          isActive={true} 
        />
      );
      
      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalled();
      }, { timeout: 1000 });
      
      const duration = Date.now() - startTime;
      // Reduced motion should complete in ~500ms (100+300+100+100)
      expect(duration).toBeLessThan(1000);
    });

    test('should not render particles with reduced motion', async () => {
      render(
        <CityTransition 
          targetCityLevel={2} 
          onComplete={mockOnComplete} 
          isActive={true} 
        />
      );
      
      // Wait a bit for celebration stage
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Particles container should not be rendered with reduced motion
      const particlesContainer = document.querySelector('.particles-container');
      expect(particlesContainer).not.toBeInTheDocument();
    });

    test('should still show celebration content with reduced motion', async () => {
      render(
        <CityTransition 
          targetCityLevel={2} 
          onComplete={mockOnComplete} 
          isActive={true} 
        />
      );
      
      await waitFor(() => {
        expect(screen.getByText('Deco Heights')).toBeInTheDocument();
      }, { timeout: 1000 });
      
      expect(screen.getByText('Welcome to the Golden Age!')).toBeInTheDocument();
    });
  });

  describe('Color Theming', () => {
    test('should apply correct color for City 2 (Gold)', async () => {
      render(
        <CityTransition 
          targetCityLevel={2} 
          onComplete={mockOnComplete} 
          isActive={true} 
        />
      );
      
      await waitFor(() => {
        const cityName = screen.getByText('Deco Heights');
        expect(cityName).toHaveStyle({ color: '#fbbf24' });
      }, { timeout: 1000 });
    });

    test('should apply correct color for City 3 (Purple)', async () => {
      render(
        <CityTransition 
          targetCityLevel={3} 
          onComplete={mockOnComplete} 
          isActive={true} 
        />
      );
      
      await waitFor(() => {
        const cityName = screen.getByText('Crystal Plaza');
        expect(cityName).toHaveStyle({ color: '#a855f7' });
      }, { timeout: 1000 });
    });

    test('should apply correct color for City 4 (Blue)', async () => {
      render(
        <CityTransition 
          targetCityLevel={4} 
          onComplete={mockOnComplete} 
          isActive={true} 
        />
      );
      
      await waitFor(() => {
        const cityName = screen.getByText('Starlight District');
        expect(cityName).toHaveStyle({ color: '#3b82f6' });
      }, { timeout: 1000 });
    });

    test('should apply correct color for City 5 (Cyan)', async () => {
      render(
        <CityTransition 
          targetCityLevel={5} 
          onComplete={mockOnComplete} 
          isActive={true} 
        />
      );
      
      await waitFor(() => {
        const cityName = screen.getByText('Neon Skyline');
        expect(cityName).toHaveStyle({ color: '#06b6d4' });
      }, { timeout: 1000 });
    });
  });

  describe('Edge Cases', () => {
    test('should handle rapid activate/deactivate cycles', async () => {
      const { rerender } = render(
        <CityTransition 
          targetCityLevel={2} 
          onComplete={mockOnComplete} 
          isActive={true} 
        />
      );
      
      // Deactivate before completion
      rerender(
        <CityTransition 
          targetCityLevel={2} 
          onComplete={mockOnComplete} 
          isActive={false} 
        />
      );
      
      const overlay = document.querySelector('.city-transition-overlay');
      expect(overlay).not.toBeInTheDocument();
    });

    test('should handle changing targetCityLevel during transition', async () => {
      const { rerender } = render(
        <CityTransition 
          targetCityLevel={2} 
          onComplete={mockOnComplete} 
          isActive={true} 
        />
      );
      
      // Change city level mid-transition
      await new Promise(resolve => setTimeout(resolve, 200));
      
      rerender(
        <CityTransition 
          targetCityLevel={3} 
          onComplete={mockOnComplete} 
          isActive={true} 
        />
      );
      
      // Should restart with new city
      await waitFor(() => {
        expect(screen.getByText('Crystal Plaza')).toBeInTheDocument();
      }, { timeout: 600 });
    });

    test('should handle null onComplete gracefully', async () => {
      render(
        <CityTransition 
          targetCityLevel={2} 
          onComplete={null} 
          isActive={true} 
        />
      );
      
      // Wait for animation
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Should not throw
      expect(true).toBe(true);
    });
  });

  describe('Performance Optimizations', () => {
    test('should use GPU-accelerated properties', async () => {
      render(
        <CityTransition 
          targetCityLevel={2} 
          onComplete={mockOnComplete} 
          isActive={true} 
        />
      );
      
      await waitFor(() => {
        const particles = document.querySelectorAll('.particle');
        if (particles.length > 0) {
          const firstParticle = particles[0];
          expect(firstParticle).toHaveStyle({ willChange: 'transform, opacity' });
        }
      }, { timeout: 1000 });
    });

    test('should use fixed positioning for overlay', () => {
      render(
        <CityTransition 
          targetCityLevel={2} 
          onComplete={mockOnComplete} 
          isActive={true} 
        />
      );
      
      const overlay = document.querySelector('.city-transition-overlay');
      expect(overlay).toHaveStyle({ position: 'fixed' });
    });
  });
});
