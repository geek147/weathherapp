import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { ForecastData } from '../api/weatherapi';

interface ForecastDisplayProps {
  forecast: ForecastData;
}

const ForecastDisplay: React.FC<ForecastDisplayProps> = ({ forecast }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>5-Day Forecast</Text>
      <FlatList
        data={forecast.list}
        keyExtractor={(item) => item.dt.toString()}
        renderItem={({ item }) => (
          <View style={styles.forecastItem}>
            <Text>{new Date(item.dt * 1000).toLocaleDateString()}</Text>
            <Text>Temperature: {item.main.temp} °C</Text>
            <Text>Weather: {item.weather[0].description}</Text>
          </View>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  forecastItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginRight: 10,
    alignItems: 'center',
  },
});

export default ForecastDisplay;
