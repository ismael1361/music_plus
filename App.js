import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings([""]);
console.disableYellowBox = true;

import * as firebase from 'firebase';

import React from 'react';

import { NavigationContainer } from '@react-navigation/native';

import UserContextProvider from './src/contexts/UserContext';
import { MainStack } from './src/stacks';

import { MultiStorager } from './src/utils';

MultiStorager.DataStorager.set('isOk', true);

import { Dialog, InputCustom } from './src/components';

import { useSafeAreaInsets, SafeAreaProvider } from 'react-native-safe-area-context';

import { StatusBarComponent } from './src/components/GeneralStatusBarColor';

const firebaseConfig = {
  apiKey: 'AIzaSyAC9nWJXaZevElnEwJO2tZhbpPD4dOvJ4Q',
  authDomain: 'music-plus-ae6b7.firebaseapp.com',
  projectId: 'music-plus-ae6b7',
  storageBucket: 'music-plus-ae6b7.appspot.com',
  messagingSenderId: '965815390212',
  appId: '1:965815390212:web:bddf219f85bf91b5856551',
  measurementId: 'G-QDXYM0NX30',
};

if (!firebase.apps || !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

export default () => {
  return (<UserContextProvider style={{flex: 1, backgroundColor: "#212121"}}>
    <Dialog />
    <InputCustom isDialog={true}/>
    <StatusBarComponent barStyle="light-content"/>
    <NavigationContainer style={{flex: 1, backgroundColor: "#212121"}}>
      <MainStack />
    </NavigationContainer>
  </UserContextProvider>);
};
