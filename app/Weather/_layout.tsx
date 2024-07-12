import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { getWeather, getForecast } from './WeatherSlice';
import { addFavorite, removeFavorite, updateWeather } from '../Favorites/favoritesSlice';
import WeatherDisplay from '../../components/WeatherDisplay';
import ForecastDisplay from '../../components/ForecastDisplay';
import { useNavigation } from '@react-navigation/native';
import { unwrapResult } from '@reduxjs/toolkit';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import CustomButton from '../../components/CustomButton';

type WeatherScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Weather'>;

export default function WeatherScreen() {
  const [city, setCity] = useState('');
  const dispatch: AppDispatch = useDispatch();
  const weather = useSelector((state: RootState) => state.weather);
  const favorites = useSelector((state: RootState) => state.favorites.cities);
  const navigation = useNavigation<WeatherScreenNavigationProp>();

  const handleFetchWeather = () => {
    dispatch(getWeather(city));
    dispatch(getForecast(city));
  };

  const handleAddFavorite = () => {
    dispatch(addFavorite(city));
  };

  const handleRemoveFavorite = (cityName: string) => {
    dispatch(removeFavorite(cityName));
  };

  const handleFetchFavoriteWeather = async (cityName: string) => {
    try {
      const resultAction = await dispatch(getWeather(cityName));
      const weatherData = unwrapResult(resultAction);
      dispatch(updateWeather({ name: cityName, weather: weatherData }));
      dispatch(getForecast(cityName));
    } catch (err) {
      console.error('Failed to fetch favorite weather: ', err);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Weather App</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter city"
        value={city}
        onChangeText={setCity}
      />
      <CustomButton title="Get Weather" onPress={handleFetchWeather} style={styles.button} />
      <CustomButton title="Add to Favorites" onPress={handleAddFavorite} style={styles.button} />
      <CustomButton title="View Favorites" onPress={() => navigation.navigate('Favorites')} style={styles.button} />
      {weather.status === 'loading' && <Text>Loading...</Text>}
      {weather.status === 'succeeded' && weather.data && (
        <>
          <WeatherDisplay data={weather.data} />
          {weather.forecast && <ForecastDisplay forecast={weather.forecast} />}
        </>
      )}
      {weather.status === 'failed' && <Text>{weather.error}</Text>}
      <Text style={styles.subTitle}>Favorite Cities</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={styles.favoriteItem}>
            <TouchableOpacity onPress={() => handleFetchFavoriteWeather(item.name)}>
              <Text style={styles.cityName}>{item.name}</Text>
            </TouchableOpacity>
            <CustomButton title="Remove" onPress={() => handleRemoveFavorite(item.name)} style={styles.button} />
            {item.weather && (
              <View style={styles.weatherInfo}>
                <Text>Temp: {item.weather.main.temp} °C</Text>
                <Text>Weather: {item.weather.weather[0].description}</Text>
              </View>
            )}
          </View>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  button: {
    marginTop: 10,
  },
  subTitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  horizontalList: {
    paddingBottom: 20,
  },
  favoriteItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cityName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 10,
  },
  weatherInfo: {
    marginTop: 10,
  },
});
