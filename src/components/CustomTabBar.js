import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components/native';
import { Animated, Easing, Dimensions, ImageBackground } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';

import { UserContext } from '../contexts/UserContext';

import { MultiStorager, PlaylistHelper, Color } from '../utils';
const dataStorager = MultiStorager.DataStorager;

import { mdiCog, mdiPlay, mdiPause, mdiHome, mdiMagnify, mdiPlaylistMusic, mdiChevronUp } from '@mdi/js';

import GeneralNavigationBarColor from './GeneralNavigationBarColor';

import TrackPlayer, { useProgress, useTrackPlayerEvents, Event, State } from 'react-native-track-player';

const screenHeight = Dimensions.get('screen').height;
const windowHeight = Dimensions.get('window').height;
const navbarHeight = Math.round(screenHeight - windowHeight);

const TabArea = styled.View`
  width: 100%;
  background-color: ${(props)=>{return typeof props.backgroundColor === "string" ? props.backgroundColor : "#212121"}};
  flex-direction: column;
  padding-bottom: ${navbarHeight}px;
  bottom: 0px;
`;

const TabButtons = styled.View`
  height: 60px;
  width: 100%;
  background-color: ${(props)=>{return typeof props.backgroundColor === "string" ? props.backgroundColor : "#212121"}};
  flex-direction: row;
`;

const TabItem = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const TabItemCenter = styled.TouchableOpacity`
  position: relative;
  width: 70px;
  height: 70px;
  justify-content: center;
  align-items: center;
  background-color: #e0e0e0;
  border-radius: 35px;
  border: 5px solid ${(props)=>{return typeof props.color === "string" ? props.color : "#212121"}};
  margin-top: -20px;
`;

const ProgressCenter = styled(Svg)`
  position: absolute;
  top: -7px;
  left: -7px;
  width: 74px;
  height: 74px;
`;

const AvatarIcon = styled.Image`
  width: 24px;
  height: 24px;
  border-radius: 12px;
`;

const AnimatedProgress = new Animated.Value(0);

const polarToCartesian = (centerX, centerY, radius, angleInDegrees)=>{
  let angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

const describeArc = (x, y, radius, startAngle, endAngle)=>{
  let normal = startAngle < endAngle;

  let start = polarToCartesian(x, y, radius, endAngle);
  let end = polarToCartesian(x, y, radius, startAngle);

  if(normal !== false){
    let tmp = Object.assign({}, start);
    start = Object.assign({}, end);
    end = Object.assign({}, tmp);
  }

  let largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  largeArcFlag = startAngle > endAngle ? startAngle - endAngle <= 180 ? "1" : "0" : largeArcFlag;

  let numberFixed = (v, toFixed)=>{
    if(typeof v === "number"){
      let int = Math.floor(v);
      let decimals = String(v - int);
      if(decimals.search(".") >= 0){
        decimals = decimals.split(".").pop();
        if(decimals.length > toFixed){
          return Number(v).toFixed(4).replace(/(0+)$/, "").replace(/(\.)$/, "");
        }
      }
    }
    return v;
  }

  let d = ["M", start.x, start.y, "A", radius, radius, 0, largeArcFlag, (normal ? 1 : 0), end.x, end.y].map(v=> numberFixed(v, 4)).join(" ");
  return d;
}

let lengthAnimatedProgress = 0;

const getAnimatedProgress = ()=>{
  let dRange = [];
  let iRange = [];
  let f = 180;
  let off = 10;

  for(var i = 0; i<=(358+f); i++){
    let start = i >= f ? (i+off)-f : (i*off)/f;
    let end = i+off > 358 ? (((i+off)%358)*off)/f : i+off;
    start = i > off+f && (start < off || start > 358) ? 0 : start;
    end = i+off > 358 && end > off ? off : end;
    dRange.push(describeArc(12, 12, 10, start, end) || "");
    iRange.push(i);
  }

  lengthAnimatedProgress = iRange.length-1;

  return AnimatedProgress.interpolate({inputRange: iRange, outputRange: dRange});
}

const pathAnimatedProgress = getAnimatedProgress();

AnimatedProgress.addListener((path) => {
  //console.log(path.value);
});

const getBarProgressType = ()=>{
  let value = "progress_bar";
  if(dataStorager.hasKey("barProgressValue")){
    if(dataStorager.get("barProgressValue") === "loading"){
      value = "loading";
    }
  }
  return value;
}

let initialLoading = false;

const BarProgressCenter = ({stroke, loading})=>{
  const {position, duration} = useProgress(250);

  const value = duration > 0 ? position / duration : 0;

  const AnimatedPath = Animated.createAnimatedComponent(Path);

  const animateWidth = ()=>{
    AnimatedProgress.setValue(0);
    Animated.timing(AnimatedProgress, {useNativeDriver: true, toValue: lengthAnimatedProgress, duration: 1500, easing: Easing.ease}).start(()=>{
      if(!loading){
        initialLoading = false;
        return;
      }
      animateWidth();
    });
  }

  if(loading && !initialLoading){
    initialLoading = true;
    animateWidth();
  }

  let d_ = describeArc(12, 12, 10, 0, Math.round(359*value));

  //d_ = describeArc(12, 12, 10, 359-40, 0);

  stroke = Color(String(stroke)).isValidColor ? stroke : "#f44336";

  return <ProgressCenter viewBox="0 0 24 24" stroke={stroke} fill="none">
    <AnimatedPath d={pathAnimatedProgress} strokeWidth={(!loading ? 0 : 2)} strokeLinecap="round" strokeLinejoin="round"/>
    <Path d={d_ || ""} strokeWidth={(value > 0 && !loading ? 2 : 0)} strokeLinecap="round" strokeLinejoin="round"/>
  </ProgressCenter>
}

const ContainerTrack = styled.TouchableOpacity`
  width: 100%;
  background-color: ${(props)=>{return typeof props.backgroundColor === "string" ? props.backgroundColor : "#212121"}};
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 5px 15px 5px 10px;
  border-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: rgba(0, 0, 0, 0.2);
  border-top-width: 1px;
  border-top-color: rgba(0, 0, 0, 0.2);
`;

const TrackCapa = styled.View`
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
`;

const TrackCapaBackground = styled(ImageBackground)`
  background: rgba(255, 255, 255, 0.3);
  flex: 1;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const TrackTitle = styled.SafeAreaView`
  flex: 1;
  height: 100%;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 5px 15px;
`;

const TrackTitleText = styled.Text`
  width: 100%;
  font-size: 18px;
`;

const TrackView = ({track, background, color})=>{
  const { title, subtitle, thumbnails } = (track || {});
  const navigation = useNavigation();

  let image = "";
  let thisTitle = title && title !== "" ? ([title, subtitle].filter(v=>typeof v === "string" && v !== "").join(" - ")) : "Carregando...";

  if(Array.isArray(thumbnails) && thumbnails.length > 0){
    image = thumbnails[thumbnails.length-1]["url"];
  }

  const onClick = ()=>{
    navigation.navigate("PlayView");
  }

  return <ContainerTrack backgroundColor={background} activeOpacity={1} onPress={onClick}>
    <TrackCapa>
      <TrackCapaBackground source={{uri: image}} resizeMode="cover"/>
    </TrackCapa>
    <TrackTitle>
      <TrackTitleText numberOfLines={1}>{thisTitle}</TrackTitleText>
    </TrackTitle>
    <Svg viewBox="0 0 24 24" width="24" height="24" fill="#ffffff"><Path d={mdiChevronUp}/></Svg>
  </ContainerTrack>
}

export default ({ state, navigation }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  let { track, loaded, initialized } = PlaylistHelper.useMusicPlaying();

  let themeColor = ["#212121", "#212121"];
  let backgroundColor = "#212121";
  let progressColor = "#f44336";

  if(track && track.videoId !== "" && track.colorTheme){
    let colors = ["muted", "darkMuted", "lightVibrant", "vibrant", "average", "darkVibrant", "lightMuted", "dominant"].map((k)=>{
      return (track.colorTheme[k] || "#212121");
    });

    colors.sort((a, b)=>{
      a = ((Color(a).rgb.reduce((a,b)=>a+b, 0))/3);
      b = ((Color(b).rgb.reduce((a,b)=>a+b, 0))/3);
      return a - b;
    });
    themeColor = [colors[colors.length-1], colors[0]];
    backgroundColor = Color(themeColor[0]).blend(themeColor[1], 60).string;
    progressColor = Color(themeColor[0]).blend(themeColor[1], 30).string;
  }

  const goTo = (screenName) => {
    navigation.navigate(screenName);
  }

  useTrackPlayerEvents([Event.PlaybackState], async event => {
    if(event.type === Event.PlaybackState && (event.state === State.Playing || event.state === State.Paused)){
      let isPlaying_ = event.state === State.Playing;
      if(isPlaying_ !== isPlaying){
        setIsPlaying(isPlaying_);
      }
    }
  });

  const onButtonPressed = async ()=>{
    let queue = await TrackPlayer.getQueue();
    if(!queue || queue.length <= 0){return;}

    if (!isPlaying) {
      TrackPlayer.play();
      setIsPlaying(true);
    } else {
      TrackPlayer.pause();
      setIsPlaying(false);
    }
  };

  return (<TabArea>
    {(initialized || (track && track.videoId)) ? <TrackView track={(loaded ? track : {})} background={(loaded ? backgroundColor : null)} color={(loaded ? progressColor : null)}/> : null}

    <TabButtons>
      <TabItem onPress={()=>goTo('Home')}>
        <Svg viewBox="0 0 24 24" width="24" height="24" fill="#ffffff" style={{opacity: state.index===0? 1 : 0.5}}><Path d={mdiHome}/></Svg>
      </TabItem>
      <TabItem onPress={()=>goTo('Search')}>
        <Svg viewBox="0 0 24 24" width="24" height="24" fill="#ffffff" style={{opacity: state.index===1? 1 : 0.5}}><Path d={mdiMagnify}/></Svg>
      </TabItem>
      <TabItemCenter disabled={!loaded} color={(loaded ? backgroundColor : null)} activeOpacity={1} onPress={onButtonPressed}>
        <BarProgressCenter stroke={(loaded ? progressColor : null)} loading={(initialized && !loaded)}/>
        <Svg viewBox="0 0 24 24" width="40" height="40" fill={(loaded ? progressColor : null)}><Path d={isPlaying ? mdiPause : mdiPlay}/></Svg>
      </TabItemCenter>
      <TabItem onPress={()=>goTo('MayPlaylist')}>
        <Svg viewBox="0 0 24 24" width="24" height="24" fill="#ffffff" style={{opacity: state.index===3? 1 : 0.5}}><Path d={mdiPlaylistMusic}/></Svg>
      </TabItem>
      <TabItem onPress={()=>goTo('Settings')}>
        <Svg viewBox="0 0 24 24" width="24" height="24" fill="#ffffff" style={{opacity: state.index===4? 1 : 0.5}}><Path d={mdiCog}/></Svg>
      </TabItem>
    </TabButtons>

    <GeneralNavigationBarColor 
      backgroundColor="rgba(0, 0, 0, 0)"
      barStyle="light-content"
    />
  </TabArea>);
}