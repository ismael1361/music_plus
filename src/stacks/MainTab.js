import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { CustomTabBar } from '../components';

import { Home, GenresCategory, Playlist, Search, Play, MayPlaylist, Settings } from '../screens';

const Tab = createBottomTabNavigator();

export default () => (
  <Tab.Navigator backBehavior={"history"} tabBar={props=><CustomTabBar {...props} />}>
    <Tab.Screen options={{ headerShown: false }} name="Home" component={Home} />
    <Tab.Screen options={{ headerShown: false }} name="Search" component={Search} />
    <Tab.Screen options={{ headerShown: false }} name="Play" component={Play} />
    <Tab.Screen options={{ headerShown: false }} name="MayPlaylist" component={MayPlaylist} />
    <Tab.Screen options={{ headerShown: false }} name="Settings" component={Settings} />
    <Tab.Screen options={{ headerShown: false }} name="GenresCategory" component={GenresCategory} />
    <Tab.Screen options={{ headerShown: false }} name="Playlist" component={Playlist} />
  </Tab.Navigator>
);