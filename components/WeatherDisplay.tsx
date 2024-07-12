import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WeatherData } from '../api/weatherapi';

interface WeatherDisplayProps {
  data: WeatherData;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ data }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Temperature: {data.main.temp} °C</Text>
      <Text style={styles.text}>Weather: {data.weather[0].description}</Text>
      <Text style={styles.text}>City: {data.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  text: {
    fontSize: 18,
  },
});

export default WeatherDisplay;
