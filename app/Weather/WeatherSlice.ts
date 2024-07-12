import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchWeather, fetchForecast, WeatherData, ForecastData } from '../../api/weatherapi';

export const getWeather = createAsyncThunk<WeatherData, string>('weather/getWeather', async (city) => {
  const response = await fetchWeather(city);
  return response;
});

export const getForecast = createAsyncThunk<ForecastData, string>('weather/getForecast', async (city) => {
  const response = await fetchForecast(city);
  return response;
});

interface WeatherState {
  data: WeatherData | null;
  forecast: ForecastData | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: WeatherState = {
  data: null,
  forecast: null,
  status: 'idle',
  error: null,
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWeather.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getWeather.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(getWeather.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || '';
      })
      .addCase(getForecast.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getForecast.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.forecast = action.payload;
      })
      .addCase(getForecast.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || '';
      });
  },
});

export default weatherSlice.reducer;
