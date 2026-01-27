/**
 * Save System Module
 * Handles persistence of game state to localStorage with versioning and error handling.
 */

const SAVE_KEY = 'city_slacker_save_data';
const CURRENT_VERSION = 'v1';

/**
 * Checks if localStorage is available and functional
 * @returns {boolean}
 */
export const isStorageAvailable = () => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (_e) {
    return false;
  }
};

/**
 * Saves the current game state to localStorage
 * @param {Object} state - The game state object to save
 * @returns {boolean} - True if save was successful, false otherwise
 */
export const saveGame = (state) => {
  try {
    const saveData = {
      version: CURRENT_VERSION,
      timestamp: new Date().toISOString(),
      data: state
    };
    const serializedData = JSON.stringify(saveData);
    localStorage.setItem(SAVE_KEY, serializedData);
    return true;
  } catch (error) {
    console.error('Failed to save game state:', error);
    // Handle quota exceeded or other storage errors
    return false;
  }
};

/**
 * Loads the game state from localStorage
 * @returns {Object|null} - The saved game state or null if no valid save found
 */
export const loadGame = () => {
  try {
    const serializedData = localStorage.getItem(SAVE_KEY);
    if (!serializedData) return null;

    const saveData = JSON.parse(serializedData);
    
    // Version migration placeholder
    if (saveData.version !== CURRENT_VERSION) {
      console.warn(`Save version mismatch: found ${saveData.version}, expected ${CURRENT_VERSION}`);
      // Migration logic would go here
    }

    return saveData.data;
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
};

/**
 * Clears the saved game state from localStorage
 */
export const clearSave = () => {
  try {
    localStorage.removeItem(SAVE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear save data:', error);
    return false;
  }
};

/**
 * Checks if a saved game exists in localStorage
 * @returns {boolean}
 */
export const hasSaveData = () => {
  try {
    return localStorage.getItem(SAVE_KEY) !== null;
  } catch (error) {
    console.error('Failed to check for save data:', error);
    return false;
  }
};
