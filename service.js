import TrackPlayer from 'react-native-track-player';
 
module.exports = async function() {
	TrackPlayer.addEventListener('remote-play', () => {
		TrackPlayer.play();
	});

	TrackPlayer.addEventListener('remote-pause', () => {
		TrackPlayer.pause();
	});

	TrackPlayer.addEventListener('remote-next', async () => {
		TrackPlayer.skipToNext();

		return;
		let index = await TrackPlayer.getCurrentTrack();
		let queue = await TrackPlayer.getQueue();
		if(index >= (queue.length - 1)){
			TrackPlayer.skip(0);
		}else{
			TrackPlayer.skipToNext();
		}
	});

	TrackPlayer.addEventListener('remote-previous', async () => {
		TrackPlayer.skipToPrevious();

		return;
		let index = await TrackPlayer.getCurrentTrack();
		if(index <= 0){
			let queue = await TrackPlayer.getQueue();
			TrackPlayer.skip(queue.length - 1);
		}else{
			TrackPlayer.skipToPrevious();
		}
	});

	TrackPlayer.addEventListener('remote-jump-forward', async () => {
		let newPosition = await TrackPlayer.getPosition();
		let duration = await TrackPlayer.getDuration();
		newPosition += 10;

		if (newPosition > duration) {
			newPosition = duration;
		}

		TrackPlayer.seekTo(newPosition);
	});

	TrackPlayer.addEventListener('remote-jump-backward', async () => {
		let newPosition = await TrackPlayer.getPosition();
		newPosition -= 10;
		if (newPosition < 0) {
			newPosition = 0;
		}
		
		TrackPlayer.seekTo(newPosition);
	});
};