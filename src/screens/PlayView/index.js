import React, { useState, useEffect } from 'react';

import { Platform, StatusBar, Dimensions, View, Text } from 'react-native';

import { Container, BackgroundGradient, HeaderTitle, HeaderTitleBodyTitle, HeaderTitleBodySubtitle, SwipeHidden } from './styles';

import { ContainerScreen, SwipePlaylist } from "../../components";

import { TrackMusic } from "../../Models";

//import TextTicker from 'react-native-text-ticker';

import { Color, PlaylistHelper } from '../../utils';

import SliderComponent from './SliderComponent';
import CapaMusic from './CapaMusic';
import Actions from './Actions';

import RNFetchBlob from "react-native-fetch-blob";
const fs = RNFetchBlob.fs;

import { mdiChevronUp } from '@mdi/js';

import Svg, { Path } from 'react-native-svg';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;
const screenHeight = Dimensions.get('screen').height;
const windowHeight = Dimensions.get('window').height;
const navbarHeight = Math.round(screenHeight - windowHeight);

const image2base64 = (uri)=>{
	return new Promise(async (resolve, reject)=>{
	  const img = await RNFetchBlob.config({fileCache: true}).fetch("GET", uri);

	  base64Data = await img.readFile("base64");

		let img_uri = 'data:image/png;base64,'+base64Data;

	  fs.unlink(img.path());
	  resolve(img_uri);
	});
}

export default ({ route, navigation })=>{
	let { track, loaded, previewList } = PlaylistHelper.useMusicPlaying();

	let backgroundColor = ["#424242", "#212121"];

	if(track && track.colorTheme){
		let colors = ["muted", "darkMuted", "lightVibrant", "vibrant", "average", "darkVibrant", "lightMuted", "dominant"].map((k)=>{
      return (track.colorTheme[k] || "#212121");
    });

		colors.sort((a, b)=>{
			a = ((Color(a).rgb.reduce((a,b)=>a+b, 0))/3);
			b = ((Color(b).rgb.reduce((a,b)=>a+b, 0))/3);
			return a - b;
		});
    backgroundColor = [colors[colors.length-1], colors[0]];
	}

	let capa_image = "";

	if(track && Array.isArray(track.thumbnails) && track.thumbnails.length > 0){
		capa_image = track.thumbnails[track.thumbnails.length-1]["url"];
	}

	const colorText = ((Color(backgroundColor[0]).rgb.reduce((a,b)=>a+b, 0))/3) > 120 ? "#212121" : "#f5f5f5";

	const darkColor = Color(backgroundColor[0]).blend(backgroundColor[1], 60).string

	return <ContainerScreen 
		backgroundColor={backgroundColor[0]}
		scroll={false} 
		GeneralStatusBar={{
	    backgroundColor: "rgba(0, 0, 0, 0.2)",
	    barStyle: "light-content"
	  }}
  >
  	<BackgroundGradient 
  		colors={backgroundColor}
	  	start={{x: 0.5, y: 0}} end={{x: 0.5, y: 1}}
  	/>
  	<Container>
  		<CapaMusic isLoading={!loaded} disabled={!loaded} image={capa_image} color={backgroundColor[0]}/>

      <HeaderTitle>
    		<HeaderTitleBodyTitle numberOfLines={2}>{(track && track.title ? track.title : "")}</HeaderTitleBodyTitle>
    		<HeaderTitleBodySubtitle numberOfLines={1}>{(track && track.subtitle ? track.subtitle : "")}</HeaderTitleBodySubtitle>
      </HeaderTitle>

      <SliderComponent disabled={!loaded}/>

      <Actions disabled={!loaded}/>
  	</Container>

  	{loaded ? <SwipePlaylist
			container={<View>
				<Text>{"Container"}</Text>
			</View>}
			topHeight={50}
			swipeHeight={navbarHeight+30}
			backgroundColor={darkColor}
		/> : null}
	</ContainerScreen>
}

/*
  		<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
	    	<TextTicker 
	    		style={{fontSize: "20px", color: "#f5f5f5"}} 
	    		duration={10000}
	    		marqueeDelay={5000}
	    		loop
	        bounce={false}
	        shouldAnimateTreshold={40}
	        easing={Easing.linear}
	        scroll
	      >
	      	{"Super long"}
	      </TextTicker>
      </View>*/