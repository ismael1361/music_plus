import React from 'react';
import styled from 'styled-components/native';
import { ImageBackground, StatusBar, Platform, Dimensions } from 'react-native';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;
const WINDOW_WIDTH = Math.round(Dimensions.get('window').width);

import LinearGradient from 'react-native-linear-gradient';

export const Loading = styled.ActivityIndicator`
  margin-top: 50px;
`;

export const CapaThumbnail = styled.View`
  width: 100%;
  height: ${Math.min(WINDOW_WIDTH, 350)}px;
  justify-content: flex-end;
  align-items: flex-start;
  position: relative;
  border-style: solid;
`;

export const CapaThumbnailImage = styled(ImageBackground)`
  background: rgba(255, 255, 255, 0.3);
  flex: 1;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const CapaGradient = styled(LinearGradient)`
  flex: 1;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

`;

export const CapaHeader = styled.View`
	width: 100%;
	padding: 15px;
	flex-direction: row;
	align-items: flex-end;
`;

export const CapaHeaderInfo = styled.View`
	flex: 1;
`;

export const CapaHeaderInfoTitle = styled.Text`
	font-size: 35px;
	font-weight: bold;
	opacity: 0.8;
	text-align: left;
`;

export const CapaHeaderInfoSubtitle = styled.Text`
	font-size: 15px;
	opacity: 0.6;
	text-align: left;
`;

export const CapaButtonPlay = styled.TouchableOpacity`
	width: 50px;
	height: 50px;
	align-items: center;
	justify-content: center;
	background: rgba(255, 255, 255, .2);
	border-radius: 25px;
	border: solid 2px rgba(255, 255, 255, .7);
	margin-left: 10px;
`;

//, TrackMusicList, TrackMusicListItem, TrackMusicListItemIndex, TrackMusicListItemHeader, TrackMusicListItemTitle, TrackMusicListItemSubtitle, TrackMusicListItemDuration

export const TrackMusicList = styled.View`
	padding: 25px 0 50px 0;
`;

export const TrackMusicListItem = styled.TouchableOpacity`
	flex-direction: row;
	align-items: center;
	padding: 10px 15px;
	border-style: solid;
	border-bottom-color: rgba(0, 0, 0, .2);
	border-bottom-width: 1px;
`;

export const TrackMusicListItemIndex = styled.Text`
	font-size: 20px;
	font-weight: bold;
	margin-right: 10px;
`;

export const TrackMusicListItemHeader = styled.View`
	flex: 1;
	padding: 0 15px;
	flex-direction: column;
	justify-content: center;
`;

export const TrackMusicListItemTitle = styled.Text`
	font-size: 16px;
	font-weight: bold;
`;

export const TrackMusicListItemSubtitle = styled.Text`
	font-size: 12px;
	opacity: 0.7;
`;

export const TrackMusicListItemDuration = styled.Text`
	font-size: 12px;
	opacity: 0.6;
`;