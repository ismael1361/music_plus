import React, { useState, useEffect } from 'react';

import { Actions, ActionsButton, ActionsButtonPlayPause } from './styles';

import TrackPlayer, { useTrackPlayerEvents, Event, State, RepeatMode } from 'react-native-track-player';

import { mdiSkipPrevious, mdiSkipNext, mdiPlay, mdiRepeat, mdiRepeatOnce, mdiRepeatOff, mdiShuffle, mdiShuffleDisabled, mdiPause } from '@mdi/js';

import Svg, { Path } from 'react-native-svg';

export default ({ disabled, onNext, onPrevious, onShuffled, onLooped })=>{
	const [isPlaying, setIsPlaying] = useState(false);
	const [isShuffled, setIsShuffled] = useState(false);
	const [typeLoop, setTypeLoop] = useState(0);

	useTrackPlayerEvents([Event.PlaybackTrackChanged, Event.PlaybackState], async event => {
		if(event.type === Event.PlaybackState && (event.state === State.Playing || event.state === State.Paused)){
			let isPlaying_ = event.state === State.Playing;
			if(isPlaying_ !== isPlaying){
				setIsPlaying(isPlaying_);
			}
		}
    //console.log(JSON.stringify(event, null, 2));
  });

	const onButtonPressed = ()=>{
		if(disabled === true){return;}
		if (!isPlaying) {
			TrackPlayer.play();
			setIsPlaying(true);
		} else {
			TrackPlayer.pause();
			setIsPlaying(false);
		}
	};

	const goNext = async ()=>{
		let index = await TrackPlayer.getCurrentTrack();
		let queue = await TrackPlayer.getQueue();
		let currentIndex = index;

		if(index >= (queue.length - 1)){
			TrackPlayer.skip(0);
			currentIndex = 0;
		}else{
			currentIndex += 1;
			TrackPlayer.skipToNext();
		}

		if(typeof onNext === "function"){
			onNext(currentIndex);
		}
	}

	const goPrevious = async ()=>{
		let index = await TrackPlayer.getCurrentTrack();
		let currentIndex = index;

		if(index <= 0){
			let queue = await TrackPlayer.getQueue();
			currentIndex = queue.length - 1;
			TrackPlayer.skip(queue.length - 1);
		}else{
			currentIndex -= 1;
			TrackPlayer.skipToPrevious();
		}

		if(typeof onPrevious === "function"){
			onPrevious(currentIndex);
		}
	}

	const shuffled = ()=>{
		let v = !isShuffled;
		setIsShuffled(v);
		if(typeof onShuffled === "function"){
			onShuffled(v);
		}
	}

	const loop = ()=>{
		let v = (typeLoop + 1) % 3;
		let modeList = [RepeatMode.Off, RepeatMode.Track, RepeatMode.Queue];
		TrackPlayer.setRepeatMode(modeList[v]);
		setTypeLoop(v);
		if(typeof onLooped === "function"){
			onLooped(v);
		}
	}

	useEffect(()=>{
		let start = async ()=>{
			let v = await TrackPlayer.getRepeatMode();
			setTypeLoop(v);

			let p = await TrackPlayer.getState();
			setIsPlaying(p === State.Playing);
		}
		start();
	}, []);

	return <Actions disabled={disabled}>
  	<ActionsButton onPress={shuffled} disabled={disabled}>
  		<Svg viewBox="0 0 24 24" width="24" height="24" fill="#f5f5f5"><Path d={isShuffled ? mdiShuffle : mdiShuffleDisabled}/></Svg>
  	</ActionsButton>
  	<ActionsButton onPress={goPrevious} disabled={disabled}>
  		<Svg viewBox="0 0 24 24" width="40" height="40" fill="#f5f5f5"><Path d={mdiSkipPrevious}/></Svg>
  	</ActionsButton>
  	<ActionsButtonPlayPause onPress={onButtonPressed} disabled={disabled}>
  		<Svg viewBox="0 0 24 24" width="45" height="45" fill="#f5f5f5"><Path d={isPlaying ? mdiPause : mdiPlay}/></Svg>
  	</ActionsButtonPlayPause>
  	<ActionsButton onPress={goNext} disabled={disabled}>
  		<Svg viewBox="0 0 24 24" width="40" height="40" fill="#f5f5f5"><Path d={mdiSkipNext}/></Svg>
  	</ActionsButton>
  	<ActionsButton onPress={loop} disabled={disabled}>
  		<Svg viewBox="0 0 24 24" width="24" height="24" fill="#f5f5f5"><Path d={typeLoop === 0 ? mdiRepeatOff : typeLoop === 1 ? mdiRepeatOnce : mdiRepeat}/></Svg>
  	</ActionsButton>
  </Actions>
}