import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WeatherData } from '../../api/weatherapi';

interface FavoriteCity {
  name: string;
  weather: WeatherData | null;
}

interface FavoritesState {
  cities: FavoriteCity[];
}

const initialState: FavoritesState = {
  cities: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<string>) => {
      if (!state.cities.find(city => city.name.toLowerCase() === action.payload.toLowerCase())) {
        state.cities.push({ name: action.payload, weather: null });
      }
    },
    updateWeather: (state, action: PayloadAction<{ name: string; weather: WeatherData }>) => {
      const city = state.cities.find(city => city.name.toLowerCase() === action.payload.name.toLowerCase());
      if (city) {
        city.weather = action.payload.weather;
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.cities = state.cities.filter(city => city.name.toLowerCase() !== action.payload.toLowerCase());
    },
  },
});

export const { addFavorite, removeFavorite, updateWeather } = favoritesSlice.actions;
export default favoritesSlice.reducer;
