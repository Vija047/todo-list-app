import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#2563eb', // Modern blue
        tabBarInactiveTintColor: '#94a3b8', // Muted gray-blue
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
          letterSpacing: 0.5,
        },
        tabBarStyle: {
          height: 70,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 16,
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 12,
          elevation: 8,
          borderTopWidth: 0,
        },
        tabBarIconStyle: {
          marginTop: 8,
        },
        animation: 'fade', // Smooth animation
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="task"
        options={{
          headerShown: false,
          title: 'Task',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-done-outline" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
