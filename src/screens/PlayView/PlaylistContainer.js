import React, { useState, useEffect } from 'react';

import { PlaylistView, PlaylistElement, PlaylistTrackCapa, PlaylistTrackCapaBackground, PlaylistTrackTitle, PlaylistTrackTitleText, PlaylistTrackSubtitleText, PlaylistCapaMusicLoadingIcon } from './styles';

import { Color, PlaylistHelper } from '../../utils';

import TrackPlayer from 'react-native-track-player';

/*{
	index: i, 
	title: t.title,
	subtitle: t.subtitle,
	videoId: t.videoId,
	playlistId: t.playlistId,
	thumbnails: t.thumbnails,
	loaded: false
}*/

export default (props)=>{
	const { track, previewList } = PlaylistHelper.useMusicPlaying();

	return <PlaylistView>
		{(Array.isArray(previewList) ? previewList : []).map((t, i)=>{
			let image = "";
			let title = (t && t.title) || "";
			let subtitle = (t && t.subtitle) || "";
			let isLoading = !t.loaded;

			if(t && Array.isArray(t.thumbnails) && t.thumbnails.length > 0){
				image = t.thumbnails[0]["url"];
			}

			return <PlaylistElement 
				key={"PlaylistElement_"+i} 
				playing={i === track.index}
				loaded={t.loaded}
				disabled={!t.loaded}
				onPress={()=>{
					if(isLoading){return;}
					TrackPlayer.skip(i);
					TrackPlayer.play();
				}}
			>

				<PlaylistTrackCapa>
					<PlaylistTrackCapaBackground source={{uri: image}} resizeMode="cover"/>
					{isLoading ? <PlaylistCapaMusicLoadingIcon size={30} color="#FFFFFF"/> : null}
				</PlaylistTrackCapa>

		    <PlaylistTrackTitle>
		      <PlaylistTrackTitleText numberOfLines={1}>{title}</PlaylistTrackTitleText>
		      <PlaylistTrackSubtitleText numberOfLines={1}>{subtitle}</PlaylistTrackSubtitleText>
		    </PlaylistTrackTitle>

			</PlaylistElement>
		})}
	</PlaylistView>
}