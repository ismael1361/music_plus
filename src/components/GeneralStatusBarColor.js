import React, { useState } from 'react';
import { View, StatusBar, Platform } from 'react-native';
import styled from 'styled-components/native';

import { MultiStorager } from '../utils';
const dataStorager = MultiStorager.DataStorager;

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

const Container = styled.View`
  width: 100%;
  height: ${STATUSBAR_HEIGHT}px;
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  z-index: 9999;
  elevation: 9999;
  background-color: ${(props)=>{return typeof props.backgroundColor === "string" ? props.backgroundColor : "red"}};
  justifyContent: center;
  alignItems: center;
`;

export const setPropsStatusBar = (props)=>{
  dataStorager.set("__propsStatusBar", Object.assign({
    backgroundColor: "transparent",
    barStyle: "light-content"
  }, props));
}

export const StatusBarComponent = (props_) => {
  const [propsIn, setPropsIn] = useState({
    backgroundColor: "transparent",
    barStyle: "light-content"
  });

  dataStorager.deleteListener("__propsStatusBar");
  dataStorager.addListener("__propsStatusBar", (a)=>{
    setPropsIn(a);
  });

  const { backgroundColor, ...props } = propsIn;

  return <Container backgroundColor={backgroundColor}>
    <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  </Container>
};