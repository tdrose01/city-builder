import { render, screen } from '@testing-library/react';
import React from 'react';
import ThreeDice from '../ThreeDice';
import { vi } from 'vitest';

// Mock Canvas to avoid WebGL context requirement in tests
vi.mock('@react-three/fiber', async () => {
  const actual = await vi.importActual('@react-three/fiber');
  return {
    ...actual,
    Canvas: ({ children }) => <div data-testid="canvas">{children}</div>,
    useFrame: vi.fn(),
  };
});

// Mock drei components
vi.mock('@react-three/drei', () => ({
  RoundedBox: ({ children }) => <mesh>{children}</mesh>,
  ContactShadows: () => <mesh data-testid="contact-shadows" />,
  Environment: () => <mesh data-testid="environment" />,
  Text: ({ children }) => <div data-testid="dice-label">{children}</div>,
}));

test('ThreeDice renders with shadows and environment', () => {
    render(<ThreeDice rolling={false} value1={1} value2={6} />);
    
    expect(screen.getByTestId('canvas')).toBeInTheDocument();
    expect(screen.getByTestId('contact-shadows')).toBeInTheDocument();
    expect(screen.getByTestId('environment')).toBeInTheDocument();
});
