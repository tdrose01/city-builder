import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WEATHER_TYPES, getRandomWeather } from '../data/world/weatherData';

interface WeatherState {
  currentWeather: any;
  rollsUntilChange: number;
  changeWeather: () => void;
  updateRollCount: () => void;
}

export const useWeatherStore = create<WeatherState>()(
  persist(
    (set, get) => ({
      currentWeather: WEATHER_TYPES.SUNNY,
      rollsUntilChange: 10,

      changeWeather: () => {
        const newWeather = getRandomWeather();
        set({ 
          currentWeather: newWeather,
          rollsUntilChange: Math.floor(Math.random() * 10) + 10 // 10-20 rolls
        });
        console.log(`Weather changed to: ${newWeather.name}`);
      },

      updateRollCount: () => {
        const { rollsUntilChange, changeWeather } = get();
        if (rollsUntilChange <= 1) {
          changeWeather();
        } else {
          set({ rollsUntilChange: rollsUntilChange - 1 });
        }
      }
    }),
    {
      name: 'city-builder-weather',
    }
  )
);
