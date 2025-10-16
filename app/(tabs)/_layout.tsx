import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MenuProvider } from 'react-native-popup-menu';

export default function Layout() {
  const router = useRouter();

  return (
    <MenuProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            headerShown: true,
            headerTitle: '',
            headerStyle: {
              backgroundColor: '#000',
            },
            headerRight: () => (
              <TouchableOpacity
                style={{ marginRight: 20 }}
                onPress={() => router.push('/settings')}
              >
                <Ionicons name="settings-outline" size={26} color="#fff" />
              </TouchableOpacity>
            ),
            tabBarStyle: {
              backgroundColor: '#000',
              borderTopColor: '#222',
            },
            tabBarActiveTintColor: '#fff',
            tabBarInactiveTintColor: '#777',
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Calculator',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="calculator-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="flashcards"
            options={{
              title: 'Study',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="albums-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="help"
            options={{
              title: 'Help',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="help-circle-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="metric"
            options={{
              title: 'Metric',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="swap-horizontal-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="scan"
            options={{
              title: 'Scan',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="camera-outline" size={size} color={color} />
              ),
            }}
          />
        </Tabs>
      </GestureHandlerRootView>
    </MenuProvider>
  );
}
