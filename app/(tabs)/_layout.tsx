import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs>
    <Tabs.Screen
      // Name of the route to hide.
      name="index"
      options={{
        // This tab will no longer show up in the tab bar.
        href: null,
      }}
    />
  </Tabs>
  );
}

