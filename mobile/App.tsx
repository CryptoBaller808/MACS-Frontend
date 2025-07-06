import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import ArtistProfileScreen from './src/screens/ArtistProfileScreen';
import PostScreen from './src/screens/PostScreen';
import LiveStreamScreen from './src/screens/LiveStreamScreen';
import BookingScreen from './src/screens/BookingScreen';
import CrowdfundingScreen from './src/screens/CrowdfundingScreen';
import StoreScreen from './src/screens/StoreScreen';
import CollaborationScreen from './src/screens/CollaborationScreen';
import CulturalZoneScreen from './src/screens/CulturalZoneScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// Import providers
import { AuthProvider } from './src/contexts/AuthContext';
import { OfflineProvider } from './src/contexts/OfflineContext';
import { ThemeProvider } from './src/contexts/ThemeContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <OfflineProvider>
              <NavigationContainer>
                <StatusBar style="auto" />
                <Stack.Navigator
                  initialRouteName="Home"
                  screenOptions={{
                    headerShown: false,
                    animation: 'slide_from_right',
                  }}
                >
                  <Stack.Screen name="Home" component={HomeScreen} />
                  <Stack.Screen name="ArtistProfile" component={ArtistProfileScreen} />
                  <Stack.Screen name="Post" component={PostScreen} />
                  <Stack.Screen name="LiveStream" component={LiveStreamScreen} />
                  <Stack.Screen name="Booking" component={BookingScreen} />
                  <Stack.Screen name="Crowdfunding" component={CrowdfundingScreen} />
                  <Stack.Screen name="Store" component={StoreScreen} />
                  <Stack.Screen name="Collaboration" component={CollaborationScreen} />
                  <Stack.Screen name="CulturalZone" component={CulturalZoneScreen} />
                  <Stack.Screen name="Profile" component={ProfileScreen} />
                </Stack.Navigator>
              </NavigationContainer>
            </OfflineProvider>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
} 