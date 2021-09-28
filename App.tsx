import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from './components/Themed';
import { StackNavigationState, StackRouter } from '@react-navigation/routers';

const Stack = createStackNavigator();

import Recorder from './screens/Recorder';
import Home from './screens/Home';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="home" component={Home}
            options={{
              headerTitle: "",
              headerTintColor: "#fff",
              headerStyle: {
                backgroundColor: "#00bfff",
              },
            }} />
          <Stack.Screen name="camera" component={Recorder}
            options={{
              headerTitle: "",
              headerTintColor: "#fff",
              headerStyle: {
                backgroundColor: "#00bfff",
              },
            }} />
        </Stack.Navigator>
      </NavigationContainer >
    );
  }
}
