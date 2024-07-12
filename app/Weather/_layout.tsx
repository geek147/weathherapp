import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
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
import CustomButton from '@/components/CustomButton';

type WeatherScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Weather'>;

export default function Weather() {
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
      <View style={styles.container}>
        <Text style={styles.title}>Weather App</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter city"
          value={city}
          onChangeText={setCity}
        />
        <CustomButton title="Get Weather" onPress={handleFetchWeather} />
        <CustomButton title="Add to Favorites" onPress={handleAddFavorite} />
        <CustomButton title="View Favorites" onPress={() => navigation.navigate('Favorites')} />
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
              <CustomButton title="Remove" onPress={() => handleRemoveFavorite(item.name)} />
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
    input: {
      borderWidth: 1,
      padding: 10,
      marginBottom: 20,
    },
    subTitle: {
      fontSize: 18,
      marginTop: 20,
      marginBottom: 10,
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
  });