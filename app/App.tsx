import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { createStackNavigator } from '@react-navigation/stack';
import WeatherScreen from './Weather/_layout';
import FavoritesScreen from './Favorites/_layout';

export type RootStackParamList = {
  Weather: undefined;
  Favorites: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Stack.Navigator initialRouteName="Weather">
      <Stack.Screen name="Weather" component={WeatherScreen} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
    </Stack.Navigator>
  </Provider>
  );
};

export default App;
