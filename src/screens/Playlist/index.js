import React, { useState, useEffect } from 'react';

import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { ContainerScreen } from "../../components";

import { YoutubeMusic, PlaylistHelper, Color } from '../../utils';
import { Result, TrackMusic } from '../../Models';

import { Loading, CapaThumbnail, CapaThumbnailImage, CapaGradient, CapaHeader, CapaHeaderInfo, CapaHeaderInfoTitle, CapaHeaderInfoSubtitle, CapaButtonPlay, TrackMusicList, TrackMusicListItem, TrackMusicListItemIndex, TrackMusicListItemHeader, TrackMusicListItemTitle, TrackMusicListItemSubtitle, TrackMusicListItemDuration } from "./style";

import Svg, { Circle, Path } from 'react-native-svg';

import { mdiPlay } from '@mdi/js';

const Capa = ({ image, title, subtitle })=>{
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
			<CapaButtonPlay>
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
    const { params } = route;

    if(params.browseId !== browseId){
      setBrowseId(params.browseId);
      setContent([]);
      PlaylistHelper.getPlaylistForBrowseId(params.browseId).then((result)=>{
      	console.log(JSON.stringify(result, null, 2));
      	setContent(result);
      }).catch(console.log);
    }

    return ()=>{
    	setContent([]);
    };
  }, [route]);

  return <ContainerScreen scroll={true} statusbarSize={false} GeneralStatusBar={{
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    barStyle: "light-content"
  }}>
  	<Capa image={thumbnail} title={params?.title} subtitle={params?.subtitle}/>

  	{content.length < 1 && <Loading size="large" color="#FFFFFF" />}

  	<TrackMusicList>
	  	{content.length > 0 && content.map((t, i)=>{
	  		t = t instanceof TrackMusic ? t : new TrackMusic().parse(null, t);
	  		let {title, subtitle, duration} = t;
	  		duration = t.getDuration();

	  		return <TrackMusicListItem key={"TrackMusicListItem_"+i} style={{
	  			borderBottomWidth: (i < (content.length-1) ? 1 : 0)
	  		}}>
	  			<TrackMusicListItemIndex>{((i+1) <= 9 ? "0" : "")+(i+1)}</TrackMusicListItemIndex>
	  			<TrackMusicListItemHeader>
	  				{typeof title === "string" && <TrackMusicListItemTitle numberOfLines={2}>{title}</TrackMusicListItemTitle>}
	  				{typeof subtitle === "string" && <TrackMusicListItemSubtitle numberOfLines={1}>{subtitle}</TrackMusicListItemSubtitle>}
	  			</TrackMusicListItemHeader>
	  			{typeof duration === "string" && <TrackMusicListItemDuration>{duration}</TrackMusicListItemDuration>}
	  		</TrackMusicListItem>
	  	})}
  	</TrackMusicList>

	</ContainerScreen>
}