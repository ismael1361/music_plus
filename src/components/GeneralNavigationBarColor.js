import React from 'react';
import { View, Dimensions } from 'react-native';
import styled from 'styled-components/native';

import changeNavigationBarColor, {
  hideNavigationBar,
  showNavigationBar,
} from 'react-native-navigation-bar-color';

const screenHeight = Dimensions.get('screen').height;
const windowHeight = Dimensions.get('window').height;
const navbarHeight = Math.round(screenHeight - windowHeight);

const Container = styled.View`
  width: 100%;
  height: ${navbarHeight}px;
  position: absolute;
  bottom: 0px;
  left: 0px;
  right: 0px;
  z-index: 9999;
  elevation: 9999;
  background-color: ${(props)=>{return typeof props.backgroundColor === "string" ? props.backgroundColor : "transparent"}}
`;

export default ({ backgroundColor, barStyle, hide, ...props }) => {
  changeNavigationBarColor("transparent", (typeof barStyle === "string" ? (barStyle !== "light-content") : false));

  if(hide === true){
    hideNavigationBar();
  }else{
    showNavigationBar();
  }

  return (<Container backgroundColor={backgroundColor}><View style={{ zIndex: 1 }} /></Container>)
};