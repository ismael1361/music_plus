import React from 'react';
import styled from 'styled-components/native';
import { ImageBackground, Dimensions } from "react-native";
import { default as slider_ } from '@react-native-community/slider';

import LinearGradient from 'react-native-linear-gradient';

const screenHeight = Dimensions.get('screen').height;
const windowHeight = Dimensions.get('window').height;
const navbarHeight = Math.round(screenHeight - windowHeight);

export const Container = styled.SafeAreaView`
  background-color: transparent;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 15px;
  padding-bottom: ${navbarHeight+50}px;
`;

export const BackgroundGradient = styled(LinearGradient)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
`;

export const CapaMusic = styled.TouchableOpacity`
  width: 300px;
  height: 300px;
  overflow: hidden;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  position: relative;
`;

export const CapaMusicBackground = styled(ImageBackground)`
  background: rgba(0, 0, 0, 0.3);
  flex: 1;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const CapaMusicLoadingIcon = styled.ActivityIndicator``;

export const CapaMusicActions = styled(LinearGradient)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: flex-end;
  padding-bottom: 15px;
  opacity: ${props => props.visible ? 1 : 0};
`;

export const CapaMusicActionsBtn = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  margin: 2px;
  background-color: ${(props)=>{return typeof props.backgroundColor === "string" ? props.backgroundColor : "rgba(255, 255, 255, 0.2)"}};
  justify-content: center;
  align-items: center;
  border-radius: 20px;
`;

export const SliderLabelText = styled.Text`
  font-size: 12px;
  color: #f5f5f5;
`;

export const HeaderTitle = styled.SafeAreaView`
  width: 350px;
  height: 130px;
  justify-content: space-between;
  align-items: center;
  padding: 35px 15px 20px 15px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const HeaderTitleBodyTitle = styled.Text`
  width: 100%;
  font-size: 20px;
  color: #f5f5f5;
  margin-bottom: 5px;
  text-align: center;
`;

export const HeaderTitleBodySubtitle = styled.Text`
  width: 100%;
  font-size: 12px;
  color: #f5f5f5;
  text-align: center;
`;

export const SliderContainer = styled.SafeAreaView`
  width: 350px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Slider = styled(slider_)`
  width: 100%;
  height: 40px;
`;

export const SliderLabelContainer = styled.SafeAreaView`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0px 15px;
`;

//Actions, ActionsButton, ActionsButtonPlayPause

export const Actions = styled.SafeAreaView`
  width: 350px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0px 15px 20px 15px;
  opacity: ${(props)=>{return props.disabled ? "0.6" : "1"}};
`;

export const ActionsButton = styled.TouchableOpacity`
  width: 50px;
  height: 50px;
  justify-content: center;
  align-items: center;
`;

export const ActionsButtonPlayPause = styled.TouchableOpacity`
  width: 80px;
  height: 80px;
  background-color: rgba(255, 255, 255, 0.1);
  justify-content: center;
  align-items: center;
  border-radius: 40px;
`;

export const SwipeHidden = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 0px 0 0 0;
  padding-bottom: ${navbarHeight+80}px;
  opacity: ${(props)=>{return props.opacity ? props.opacity : "1"}};
`;

export const PlaylistView = styled.View`
  flex-direction: column;
  padding-top: 20px;
`;

export const PlaylistElement = styled.TouchableOpacity`
  flex-direction: row;
  padding: 5px 0px 5px 10px;
  background-color: ${(props)=>{return props.playing === true ? "rgba(255, 255, 255, .1)" : "transparent"}};
  opacity: ${(props)=>{return props.loaded !== true ? "0.5" : "1"}}
`;

export const PlaylistTrackCapa = styled.View`
  width: 50px;
  height: 50px;
  overflow: hidden;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
  position: relative;
  border-style: solid;
  border-width: 1px;
  border-left-color: rgba(0, 0, 0, 0.2);
  border-top-color: rgba(0, 0, 0, 0.1);
  border-right-color: rgba(0, 0, 0, 0.2);
  border-bottom-color: rgba(0, 0, 0, 0.1);
  margin: 0 10px;
`;

export const PlaylistTrackCapaBackground = styled(ImageBackground)`
  background: rgba(255, 255, 255, 0.3);
  flex: 1;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const PlaylistTrackTitle = styled.SafeAreaView`
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin: 0 10px;
  flex: 1;
`;

export const PlaylistTrackTitleText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 2px;
  width: 100%;
`;

export const PlaylistTrackSubtitleText = styled.Text`
  font-size: 12px;
  opacity: .6;
  width: 100%;
`;

export const PlaylistCapaMusicLoadingIcon = styled.ActivityIndicator``;

//PlaylistTrackTitle, PlaylistTrackTitleText 