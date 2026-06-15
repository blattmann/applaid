import React, { useEffect, useState } from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useAuth, AuthProvider } from '@applaid/core';
import * as Font from 'expo-font';
import { SpaceMono_400Regular } from '@expo-google-fonts/space-mono';

import DashboardScreen from './src/screens/DashboardScreen';
import LoginScreen from './src/screens/LoginScreen';
import AddApplicationScreen from './src/screens/AddApplicationScreen';
import ApplicationDetailScreen from './src/screens/ApplicationDetailScreen';
import { MainStackParamList } from './src/navigation/types';

const Stack = createNativeStackNavigator<MainStackParamList>();

const AppTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#0e0e0f',
    card: '#0e0e0f',
    text: '#e8e6e0',
    border: '#2a2a2e',
    primary: '#c8a96e',
  },
};

function Navigation() {
  const { user, loading } = useAuth();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'SpaceMono': SpaceMono_400Regular,
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (loading || !fontsLoaded) return null;

  return (
    <NavigationContainer theme={AppTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0e0e0f',
          },
          headerTintColor: '#c8a96e',
          headerTitleStyle: {
            fontStyle: 'italic',
            fontFamily: 'SpaceMono',
          },
          contentStyle: {
            backgroundColor: '#0e0e0f',
          },
        }}
      >
        {user ? (
          <>
            <Stack.Screen 
              name="Dashboard" 
              component={DashboardScreen} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="AddApplication" 
              component={AddApplicationScreen} 
              options={{ title: 'New Application' }}
            />
            <Stack.Screen 
              name="ApplicationDetail" 
              component={ApplicationDetailScreen} 
              options={{ title: 'Detail' }}
            />
          </>
        ) : (
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Navigation />
    </AuthProvider>
  );
}
