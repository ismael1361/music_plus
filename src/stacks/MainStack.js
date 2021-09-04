import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { Preload, SignIn, PlayView } from '../screens';

import { MainTab } from '../stacks';

const Stack = createStackNavigator();

export default () => (
    <Stack.Navigator
        initialRouteName="Preload"
        screenOptions={{
            headerShown: false
        }}
    >
      <Stack.Screen name="Preload" component={Preload} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="PlayView" component={PlayView} />
      <Stack.Screen name="MainTab" component={MainTab} />
    </Stack.Navigator>
);