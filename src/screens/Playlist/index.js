import React, { useState, useEffect } from 'react';

import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { ContainerScreen } from "../../components";

import { YoutubeMusic, PlaylistHelper, Color } from '../../utils';
import { Result, TrackMusic } from '../../Models';

import { Loading, CapaThumbnail, CapaThumbnailImage, CapaGradient, CapaHeader, CapaHeaderInfo, CapaHeaderInfoTitle, CapaHeaderInfoSubtitle, CapaButtonPlay, TrackMusicList, TrackMusicListItem, TrackMusicListItemIndex, TrackMusicListItemHeader, TrackMusicListItemTitle, TrackMusicListItemSubtitle, TrackMusicListItemDuration } from "./style";

import Svg, { Circle, Path } from 'react-native-svg';

import { mdiPlay } from '@mdi/js';

const Capa = ({ image, title, subtitle, disabled, onPress })=>{
	const onPressFn = ()=>{
		typeof onPress === "function" && onPress();
	}

	return <CapaThumbnail>
		<CapaThumbnailImage source={{uri: image}} resizeMode="cover"/>
		<CapaGradient 
  		colors={["rgba(66, 66, 66, 0)", "rgba(66, 66, 66, 1)"]}
			start={{x: 0, y: 0}} end={{x: 0, y: 1}}
		/>
		<CapaHeader>
			<CapaHeaderInfo>
				{typeof title === "string" && <CapaHeaderInfoTitle numberOfLines={2}>{title}</CapaHeaderInfoTitle>}
				{typeof subtitle === "string" && <CapaHeaderInfoSubtitle numberOfLines={2}>{subtitle}</CapaHeaderInfoSubtitle>}
			</CapaHeaderInfo>
			<CapaButtonPlay disabled={disabled} onPress={onPressFn}>
				<Svg viewBox="0 0 24 24" width="30" height="30" fill={"#ffff"}><Path d={mdiPlay}/></Svg>
			</CapaButtonPlay>
		</CapaHeader>
	</CapaThumbnail>
}

export default ({ navigation, route })=>{
	const [browseId, setBrowseId] = useState("");
  const [content, setContent] = useState([]);

	const { params } = route;

	let thumbnail = "";

	if(Array.isArray(params.thumbnails)){
		thumbnail = params.thumbnails[params.thumbnails.length-1].url;
	}

	useEffect(() => {
    let { params } = route;

    params = Object.assign(params.browse || {}, params);

    if(params.browseId !== browseId){
      setBrowseId(params.browseId);
      setContent([]);
      PlaylistHelper.getPlaylistBy(params.browseId).then((result)=>{
      	//console.log(result);
      	setContent(result);
      }).catch(console.log);
    }

    return ()=>{
    	setContent([]);
    };
  }, [route]);

  onPressPlay = (i)=>{
  	PlaylistHelper.playPlaylist(navigation, browseId, content, typeof i === "number" ? i : 0);
  }

  return <ContainerScreen scroll={true} statusbarSize={false} GeneralStatusBar={{
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    barStyle: "light-content"
  }}>
  	<Capa image={thumbnail} title={params?.title} subtitle={params?.subtitle} disabled={content.length < 1} onPress={()=>{
	  	onPressPlay(0);
	  }}/>

  	{content.length < 1 && <Loading size="large" color="#FFFFFF" />}

  	<TrackMusicList>
	  	{content.length > 0 && content.map((t, i)=>{
	  		t = t instanceof TrackMusic ? t : new TrackMusic().parse(null, t);
	  		let {title, subtitle, duration} = t;
	  		let d = t.getDuration();

	  		return <TrackMusicListItem key={"TrackMusicListItem_"+i} style={{
	  			borderBottomWidth: (i < (content.length-1) ? 1 : 0)
	  		}} onPress={()=>{
			  	onPressPlay(i);
			  }}>
	  			<TrackMusicListItemIndex>{((i+1) <= 9 ? "0" : "")+(i+1)}</TrackMusicListItemIndex>
	  			<TrackMusicListItemHeader>
	  				{typeof title === "string" && <TrackMusicListItemTitle numberOfLines={2}>{title}</TrackMusicListItemTitle>}
	  				{typeof subtitle === "string" && <TrackMusicListItemSubtitle numberOfLines={1}>{subtitle}</TrackMusicListItemSubtitle>}
	  			</TrackMusicListItemHeader>
	  			{(typeof d === "string" && duration > 0) && <TrackMusicListItemDuration>{d}</TrackMusicListItemDuration>}
	  		</TrackMusicListItem>
	  	})}
  	</TrackMusicList>

	</ContainerScreen>
}