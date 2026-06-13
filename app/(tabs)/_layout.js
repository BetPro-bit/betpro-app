import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';
import { Colors } from '../../src/constants/theme';

function TabIcon({ icon, label, focused }) {
  return (
    <View style={{ alignItems: 'center', gap: 2, paddingTop: 4 }}>
      <Text style={{ fontSize: 20 }}>{icon}</Text>
      <Text style={{ fontSize: 10, fontWeight: '700', color: focused ? Colors.green : Colors.text3 }}>{label}</Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.bg2,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 62,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: Colors.green,
        tabBarInactiveTintColor: Colors.text3,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="🏠" label="Home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="sports"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="⚽" label="Sports" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{
              backgroundColor: Colors.green, borderRadius: 12,
              paddingHorizontal: 14, paddingVertical: 6, marginBottom: 4,
            }}>
              <Text style={{ color: '#000', fontWeight: '800', fontSize: 12 }}>+ Deposit</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="casino"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="🎮" label="Casino" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="👤" label="Profile" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
