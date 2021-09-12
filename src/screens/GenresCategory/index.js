import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Loading, SpaceView, ContentItem, GradientTitle, Title, TitleList, ContentList, ContentListItem, ContentListItemThumbnail, ContentListItemThumbnailImage, ContentListItemTitle, ContentListItemSubtitle } from './styles';

import { ContainerScreen } from "../../components";

import { YoutubeMusic, Color } from '../../utils';

export default ()=>{
  const navigation = useNavigation();
  const state = navigation.getState();
  const [content, setContent] = useState([]);

  const { params } = state.routes[state.index];

  useFocusEffect(React.useCallback(()=>{
  	const state = navigation.getState();
  	const { params } = state.routes[state.index];

    YoutubeMusic.getGenresCategoryList(params.browse.params, params.browse.clickTrackingParams).then((result)=>{
    	setContent(result);
    });

    return ()=>{
    	setContent([]);
    }
  }, []));

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

    {content.length > 0 && content.map((props)=>{
    	return <ContentItem>
    		<TitleList>{props.title}</TitleList>
    		<ContentList>
    			{(Array.isArray(props.list) && props.list.length > 0) && props.list.map((item)=>{
    				const image = item?.thumbnails[0].url;

    				return <ContentListItem>
    					<ContentListItemThumbnail>
    						<ContentListItemThumbnailImage source={{uri: image}} resizeMode="cover"/>
    					</ContentListItemThumbnail>
    					<ContentListItemTitle numberOfLines={2}>{item?.title}</ContentListItemTitle>
    					<ContentListItemSubtitle numberOfLines={1}>{item?.subtitle}</ContentListItemSubtitle>
    				</ContentListItem>
    			})}
    			{(Array.isArray(props.list) && props.list.length%2 > 0) && <ContentListItem/>}
    		</ContentList>
    	</ContentItem>
    })}

    <SpaceView />
	</ContainerScreen>
}