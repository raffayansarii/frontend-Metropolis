const STORAGE_KEY = 'selectedSeats';

export const saveSelectedSeats = (seatIds: string[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seatIds));
  } catch (error) {
    console.error('Failed to save selected seats:', error);
  }
};

export const loadSelectedSeats = (): string[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load selected seats:', error);
    return [];
  }
};

