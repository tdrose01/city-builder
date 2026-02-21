/**
 * Weather Data Configuration
 * Defines types, effects, and visual profiles for the Dynamic Weather System
 */

export const WEATHER_TYPES = {
  SUNNY: {
    id: 'sunny',
    name: 'Clear Skies',
    icon: '☀️',
    description: 'Perfect weather for city building. Standard rates.',
    color: '#0ea5e9', // Deep Sky Blue
    modifiers: {
      funds: 1.0,
      xp: 1.0,
      diceCost: 1.0,
      shieldRate: 1.0
    },
    particles: null,
    skyColor: '#075985'
  },
  RAINY: {
    id: 'rainy',
    name: 'Steady Rain',
    icon: '🌧️',
    description: 'Construction boom! +20% Funds from all tiles.',
    color: '#3b82f6',
    modifiers: {
      funds: 1.2,
      xp: 1.0,
      diceCost: 1.0,
      shieldRate: 1.0
    },
    particles: 'rain',
    skyColor: '#1e293b'
  },
  THUNDERSTORM: {
    id: 'thunder',
    name: 'Thunderstorm',
    icon: '⛈️',
    description: 'High energy! 2x XP gain, but dice rolls cost slightly more.',
    color: '#8b5cf6',
    modifiers: {
      funds: 1.0,
      xp: 2.0,
      diceCost: 1.25,
      shieldRate: 1.0
    },
    particles: 'storm',
    skyColor: '#0f172a'
  },
  SNOWY: {
    id: 'snowy',
    name: 'Fresh Snowfall',
    icon: '❄️',
    description: 'Winter peace. 1.5x Shield collection rate.',
    color: '#94a3b8',
    modifiers: {
      funds: 1.0,
      xp: 1.0,
      diceCost: 1.0,
      shieldRate: 1.5
    },
    particles: 'snow',
    skyColor: '#334155'
  }
};

export const getRandomWeather = () => {
  const keys = Object.keys(WEATHER_TYPES);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return WEATHER_TYPES[randomKey];
};
