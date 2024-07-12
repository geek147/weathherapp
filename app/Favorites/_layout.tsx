import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { removeFavorite, updateWeather } from './favoritesSlice';
import { getWeather } from '../Weather/WeatherSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import CustomButton from '../../components/CustomButton';

type FavoritesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Favorites'>;

export default function FavoritesScreen() {
  const dispatch: AppDispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.cities);
  const navigation = useNavigation<FavoritesScreenNavigationProp>();

  const handleRemoveFavorite = (cityName: string) => {
    dispatch(removeFavorite(cityName));
  };

  const handleFetchFavoriteWeather = async (cityName: string) => {
    try {
      const resultAction = await dispatch(getWeather(cityName));
      const weatherData = unwrapResult(resultAction);
      dispatch(updateWeather({ name: cityName, weather: weatherData }));
    } catch (err) {
      console.error('Failed to fetch favorite weather: ', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorite Cities</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity onPress={() => handleFetchFavoriteWeather(item.name)}>
              <Text style={styles.cityName}>{item.name}</Text>
            </TouchableOpacity>
            {item.weather && (
              <View style={styles.weatherInfo}>
                <Text style={styles.tempText}>Temp: {item.weather.main.temp} °C</Text>
                <Text style={styles.weatherText}>Weather: {item.weather.weather[0].description}</Text>
              </View>
            )}
            <CustomButton title="Remove" onPress={() => handleRemoveFavorite(item.name)} style={styles.button} />
          </View>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
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
    marginBottom: 10,
    color: '#007BFF',
  },
  weatherInfo: {
    marginTop: 10,
    marginBottom: 10,
  },
  tempText: {
    fontSize: 16,
    color: '#333',
  },
  weatherText: {
    fontSize: 16,
    color: '#555',
  },
  button: {
    marginTop: 10,
  },
});
