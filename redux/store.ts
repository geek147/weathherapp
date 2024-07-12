import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from '../app/Weather/WeatherSlice';
import favoritesReducer from '../app/Favorites/favoritesSlice';


export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    favorites: favoritesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

