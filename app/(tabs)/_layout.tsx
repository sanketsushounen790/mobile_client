import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#1E90FF",
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: "Search",
          title: "Search",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "search" : "search-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          headerTitle: "Library",
          title: "Library",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "library" : "library-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
