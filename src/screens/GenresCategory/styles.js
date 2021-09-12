import React from 'react';
import styled from 'styled-components/native';
import { ImageBackground, StatusBar, Platform } from 'react-native';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

import LinearGradient from 'react-native-linear-gradient';

export const Loading = styled.ActivityIndicator`
  margin-top: 50px;
`;

export const SpaceView = styled.View`
  width: 100%;
  height: 50px;
`;

export const GradientTitle = styled(LinearGradient)`
	padding: 15px 15px 0px 15px;
	padding-top: ${STATUSBAR_HEIGHT}px;
`;

export const Title = styled.Text`
	font-size: 50px;
	font-weight: bold;
	opacity: 0.7;
	padding: 15px 0 20px;
`;

export const ContentItem = styled.View`
	width: 100%;
	padding: 15px;
	margin-top: 15px;
`;

export const TitleList = styled.Text`
	font-size: 20px;
	font-weight: bold;
	margin-bottom: 15px;
`;

export const ContentList = styled.View`
	width: 100%;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: space-around;
`;

export const ContentListItem = styled.TouchableOpacity`
	width: 150px;
	margin: 10px 15px;
`;

export const ContentListItemThumbnail = styled.View`
  width: 150px;
  height: 150px;
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
`;

export const ContentListItemThumbnailImage = styled(ImageBackground)`
  background: rgba(255, 255, 255, 0.3);
  flex: 1;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const ContentListItemTitle = styled.Text`
	font-size: 18px;
	font-weight: bold;
	margin-top: 5px;
`;

export const ContentListItemSubtitle = styled.Text`
	font-size: 13px;
	margin-top: 5px;
`;