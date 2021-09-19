import React, { useState, useEffect } from 'react';

import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Loading, SpaceView, ContentItem, GradientTitle, Title, TitleList, ContentList, ContentListItem, ContentListItemThumbnail, ContentListItemThumbnailImage, ContentListItemTitle, ContentListItemSubtitle } from './styles';

import { ContainerScreen } from "../../components";

import { YoutubeMusic, Color } from '../../utils';

export default ({ navigation, route })=>{
  //const navigation = useNavigation();
  const [id, setId] = useState("");
  const [content, setContent] = useState([]);

  const { params } = route;

  const toPlaylist = (playlist)=>{
    //console.log(JSON.stringify(playlist, null, 2));

    navigation.navigate("Playlist", playlist);
  }

  useEffect(() => {
    const { params } = route;
    let oldId = [params.browse.params, params.browse.clickTrackingParams].join("_");

    if(oldId !== id){
      setId(oldId);
      setContent([]);
      YoutubeMusic.getGenresCategoryList(params.browse.params, params.browse.clickTrackingParams).then((result)=>{
        setContent(result);
      });
    }

    return ()=>{
      setContent([]);
    };
  }, [route]);

	return <ContainerScreen scroll={true} statusbarSize={false} GeneralStatusBar={{
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    barStyle: "light-content"
  }}>
  	<GradientTitle
  		colors={[Color((params?.color) || "rgba(255, 255, 255, 1)").darken(50).string, "rgba(0, 0, 0, 0)"]}
			start={{x: 0, y: 0}} end={{x: 0, y: 1}}
		>
  		<Title>{(params?.title) || ""}</Title>
  	</GradientTitle>

    {content.length < 1 && <Loading size="large" color="#FFFFFF" />}

    {content.length > 0 && content.map((props, i)=>{
    	return <ContentItem kay={"ContentItem_"+i}>
    		<TitleList>{props.title}</TitleList>
    		<ContentList>
    			{(Array.isArray(props.list) && props.list.length > 0) && props.list.map((item, i)=>{
    				const image = item?.thumbnails[0].url;

    				return <ContentListItem kay={"ContentListItem_"+i} onPress={()=>toPlaylist(item)}>
    					<ContentListItemThumbnail>
    						<ContentListItemThumbnailImage source={{uri: image}} resizeMode="cover"/>
    					</ContentListItemThumbnail>
    					<ContentListItemTitle numberOfLines={2}>{item?.title}</ContentListItemTitle>
    					<ContentListItemSubtitle numberOfLines={2}>{item?.subtitle}</ContentListItemSubtitle>
    				</ContentListItem>
    			})}
    			{(Array.isArray(props.list) && props.list.length%2 > 0) && <ContentListItem/>}
    		</ContentList>
    	</ContentItem>
    })}

    <SpaceView />
	</ContainerScreen>
}