import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { CustomTabBar } from '../components';

import { Home, Search, Play, MayPlaylist, Settings } from '../screens';

const Tab = createBottomTabNavigator();

export default () => (
  <Tab.Navigator tabBar={props=><CustomTabBar {...props} />}>
    <Tab.Screen options={{ headerShown: false }} name="Home" component={Home} />
    <Tab.Screen options={{ headerShown: false }} name="Search" component={Search} />
    <Tab.Screen options={{ headerShown: false }} name="Play" component={Play} />
    <Tab.Screen options={{ headerShown: false }} name="MayPlaylist" component={MayPlaylist} />
    <Tab.Screen options={{ headerShown: false }} name="Settings" component={Settings} />
  </Tab.Navigator>
);