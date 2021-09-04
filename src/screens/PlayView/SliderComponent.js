import React, { useState, useEffect } from 'react';

import { SliderContainer, Slider, SliderLabelContainer, SliderLabelText } from './styles';

import TrackPlayer, { useProgress } from 'react-native-track-player';

export default ({ disabled })=>{
	//the value of the slider should be between 0 and 1
	const [sliderValue, setSliderValue] = useState(0);
	const [sliderValueLabel, setSliderValueLabel] = useState(0);

	//flag to check whether the use is sliding the seekbar or not
	const [isSeeking, setIsSeeking] = useState(false);

	//useProgress is a hook which provides the current position and duration of the track player.
	//These values will update every 250ms 
	const {position, duration} = useProgress(250);

	const slidingStarted = () => {
		setIsSeeking(true);
	};

	const valueChange = value =>{
		if(!isSeeking){return;}
		setSliderValueLabel(value);
	}

	const slidingCompleted = async value => {
		await TrackPlayer.seekTo(value * duration);
		setSliderValueLabel(value);
		setSliderValue(value);
		setIsSeeking(false);
	};

	const getFormatTime = (timeDiff)=>{
		timeDiff = typeof timeDiff === "number" ? timeDiff : 0;
		let hours = Math.floor(timeDiff / 3600);
		let minutes = Math.floor((timeDiff - (hours * 3600)) / 60);
		let seconds = Math.floor((timeDiff - (hours * 3600) - (minutes * 60)));

		let isHour = Math.floor(duration / 3600) > 0;

		let getDecimalStr = (n)=>{
			return String(n <= 9 ? "0"+n : n);
		}

		return `${isHour ? getDecimalStr(hours)+':' : ''}${getDecimalStr(minutes)}:${getDecimalStr(seconds)}`;
	}

	useEffect(() => {
		if (!isSeeking && position && duration) {
			setSliderValue(position / duration);
		}
	}, [position, duration]);

	return <SliderContainer>
		<Slider
			disabled={disabled}
			minimumValue={0}
			maximumValue={1}
			value={sliderValue}
			minimumTrackTintColor="#eeeeee"
			maximumTrackTintColor="#bdbdbd"
			thumbTintColor="#f5f5f5"
			onSlidingStart={slidingStarted}
			onValueChange={valueChange}
			onSlidingComplete={slidingCompleted}
		/>
		<SliderLabelContainer>
			<SliderLabelText>{getFormatTime(isSeeking ? (sliderValueLabel * duration) : (sliderValue * duration))}</SliderLabelText>
			<SliderLabelText>{getFormatTime(duration)}</SliderLabelText>
		</SliderLabelContainer>
	</SliderContainer>
}