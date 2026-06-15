import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from '@applaid/core';
import { ActivityIndicator, View, StatusBar } from 'react-native';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import AddApplicationScreen from './src/screens/AddApplicationScreen';
import ApplicationDetailScreen from './src/screens/ApplicationDetailScreen';
import { RootStackParamList, MainStackParamList } from './src/navigation/types';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();

function MainNavigator() {
  return (
    <MainStack.Navigator 
      screenOptions={{ 
        headerStyle: { backgroundColor: '#0e0e0f' },
        headerTintColor: '#fff',
        headerShadowVisible: false,
      }}
    >
      <MainStack.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{ headerShown: false }}
      />
      <MainStack.Screen 
        name="AddApplication" 
        component={AddApplicationScreen} 
        options={{ title: 'New Application' }}
      />
      <MainStack.Screen 
        name="ApplicationDetail" 
        component={ApplicationDetailScreen} 
        options={{ title: 'Details' }}
      />
    </MainStack.Navigator>
  );
}

function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#0e0e0f' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <RootStack.Screen name="Main" component={MainNavigator} />
      ) : (
        <RootStack.Screen name="Login" component={LoginScreen} />
      )}
    </RootStack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer theme={DarkTheme}>
        <StatusBar barStyle="light-content" />
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
