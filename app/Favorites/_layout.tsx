import React from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { removeFavorite, updateWeather } from './favoritesSlice';
import { getWeather } from '../Weather/WeatherSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import CustomButton from '@/components/CustomButton';
type FavoritesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Favorites'>;

export default function Favorites() {
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
          <View style={styles.favoriteItem}>
            <TouchableOpacity onPress={() => handleFetchFavoriteWeather(item.name)}>
              <Text style={styles.cityName}>{item.name}</Text>
            </TouchableOpacity>
            {item.weather && (
              <View style={styles.weatherInfo}>
                <Text>Temp: {item.weather.main.temp} °C</Text>
                <Text>Weather: {item.weather.weather[0].description}</Text>
              </View>
            )}
            <CustomButton  title="Remove" onPress={() => handleRemoveFavorite(item.name)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
    },
    title: {
      fontSize: 24,
      textAlign: 'center',
      marginBottom: 20,
    },
    favoriteItem: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    cityName: {
      fontSize: 16,
    },
    weatherInfo: {
      marginTop: 10,
    },
    button : {
      marginTop: 10,
    }
  });
    
