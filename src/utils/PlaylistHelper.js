import React, { useState, useEffect } from 'react';
import { Result, TrackMusic } from '../Models';

import YoutubeMusic from "./YoutubeMusic";
import MultiStorager from "./MultiStorager";

import TrackPlayer, { useProgress, useTrackPlayerEvents, Event, Capability, State } from 'react-native-track-player';

const dataStorager = MultiStorager.DataStorager;

const react1 = require('react');

export default class PlaylistHelper{
	static getPlaylistForAlbum(browseId){
		return new Promise((resolve, reject)=>{
			let list = [];
			YoutubeMusic.getAllPlaylistId(browseId).then((playlistId)=>{
				YoutubeMusic.getPlaylistById(playlistId[0]).then((result)=>{
					result.forEach((t)=>{
						let {videoId, playlistId, params, title, subtitle, thumbnails} = t;

						list.push(new TrackMusic(null, videoId, playlistId, params, title, subtitle, thumbnails));
					});

					let last = list[list.length-1] && "videoId" in list[list.length-1] ? list[list.length-1]["videoId"] : null;

					if(!last){
						resolve(list);
						return;
					}

					YoutubeMusic.getNext(last, list[list.length-1]["playlistId"]).then((c)=>{
						try{
							c.content.forEach((t)=>{
								let {videoId, playlistId, params, title, subtitle, thumbnails} = t;

								list.push(new TrackMusic(null, videoId, playlistId, params, title, subtitle, thumbnails));
							});

							resolve(list);
						} catch (error) {
		          reject(new Result(-1, error.message, null, {}));
		        }
					}).catch(reject);
				}).catch(reject);
			}).catch(reject);
		});
	}

	static playPlaylist(navigation, browseId, type){
		return new Promise(async (resolve, reject)=>{
			const typeList = ["ALBUM"];
			const promiseForType = ["getPlaylistForAlbum"];

			if(typeList.includes(type) !== true){return;}

			navigation.navigate("PlayView", {
	      type: "loading"
	    });

	    await this.trackPlayerInit();

	    let r = null, i = typeList.indexOf(type);

	    if(i >= 0 && i < promiseForType.length){
	    	r = this[promiseForType[i]](browseId);
	    }else{
	    	return;
	    }

			r.then(async (result)=>{
				//console.log(JSON.stringify(result[0], null, 2));
	    	dataStorager.set("PlayerListId", result[0]["playlistId"], true);
				//console.log(result.length);

				//result[0].getStreamings().then(console.log).catch(console.log);
				let previewPlayerList = result.map((t, i) => {
					return {
						index: i, 
						title: t.title,
						subtitle: t.subtitle,
						videoId: t.videoId,
						playlistId: t.playlistId,
						loaded: false
					}
				});

	    	dataStorager.set("PreviewPlayerList", previewPlayerList);

				this.playByPlayList(result).then(resolve).catch(reject);

				return;

	      navigation.navigate("PlayView", {
	        type: "normal",
	        indexPlay: 0
	      });

	      resolve();
	    }).catch(console.log);
		});
	}

	static trackPlayerInit(listMusics){
		return new Promise(async (resolve, reject)=>{
			await TrackPlayer.reset();
		  if(Array.isArray(listMusics) && listMusics.length > 0){
				TrackPlayer.add(listMusics);
		  }
	    dataStorager.set("IndexMusicPlayerList", 0, true);
	    dataStorager.set("MusicPlayerList", [], true);
	    dataStorager.set("PreviewPlayerList", []);
			resolve(true);
		});
	};

	static playByPlayList(list, index, player){
		return new Promise(async (resolve, reject)=>{
			let playlistId = dataStorager.get("PlayerListId");

			if(list[0]["playlistId"] !== playlistId){
				resolve();
				return;
			}

			const isValidList = Array.isArray(list) ? list.map(t => t instanceof TrackMusic).every(Boolean) : false;

			if(!isValidList || (Array.isArray(list) && index >= list.length)){
				resolve();
				return;
			}

			index = typeof index === "number" ? index : 0;

			this.pushTrackMusic(list[index]).then(()=>{

				let previewPlayerList = dataStorager.get("PreviewPlayerList");

				previewPlayerList[index].loaded = true;

				dataStorager.set("PreviewPlayerList", previewPlayerList);

				if((index/(list.length-1)) >= 0.15 && !player){
					player = true;
					TrackPlayer.play();
				}

				if(index < list.length){
					this.playByPlayList(list, index+1, player).then(()=>{
						resolve();
					}).catch(reject);
				}else{
					resolve();
				}
			}).catch(reject);
		});
	}

	static pushTrackMusic(music){
		return new Promise(async (resolve, reject)=>{
			if(!(music instanceof TrackMusic)){
				reject(new Result(-1, "Erro ao adicionar a música a play-list atual!", null, {}));
				return;
			}

			TrackPlayer.getQueue().then((queue)=>{
				music.getStreamings().then(async (url)=>{
					let capa_image = music.thumbnails[music.thumbnails.length-1]["url"];

					music.getColorTheme().then(async ()=>{
						let inPlayerList = dataStorager.get("PreviewPlayerList");

						if(Array.isArray(inPlayerList) !== true || inPlayerList.length <= 0){
							resolve();
							return;
						}

						inPlayerList = inPlayerList.filter(t => {
							return t.videoId === music.videoId
						}).length >= 1;

						if(inPlayerList !== true){
							resolve();
							return;
						}

						let playerListNow = dataStorager.get("MusicPlayerList");
						playerListNow = Array.isArray(playerListNow) ? playerListNow : [];

						playerListNow.push(music.toJson());

				    dataStorager.set("MusicPlayerList", playerListNow, true);

						TrackPlayer.add({
							id: queue.length,
							url: url[0]["url"],
							title: music.title,
							album: "",
							artist: music.subtitle,
							artwork: capa_image,
						});

						resolve();
					}).catch(reject);
				}).catch(reject);
			}).catch(reject);
		});
	}

	static useMusicPlaying(){
		const _a = react1.useState({
			track: new TrackMusic().toJson(),
			previewList: [],
			loaded: false
		}), 
		state = _a[0], 
		setState = _a[1];

		const [index, setIndex] = react1.useState(-1);
		const stateRef = react1.useRef();

		stateRef.current = state;

		useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
			if(event.type !== Event.PlaybackTrackChanged){return;}

			let playerListNow = dataStorager.get("MusicPlayerList");
			let index = typeof event.nextTrack === "number" ? event.nextTrack : null;

			if(!playerListNow || index < 0 || index >= playerListNow.length){
				return;
			};

			let track = playerListNow[index];

			if(!track){return;}

			setState({
				track: track,
				previewList: state.previewList,
				loaded: state.loaded
			});
		});

		react1.useEffect(()=>{
			(async ()=>{
				if(index >= 0){
					dataStorager.deleteListener("PreviewPlayerList", index);
				}

				let a = dataStorager.get("PreviewPlayerList"), 
						isLoaded = stateRef.current.loaded;

				if(Array.isArray(a)){
					let b = a.map(t => t.loaded) || [];
					isLoaded = (b.filter(Boolean).length / b.length) >= 0.15;
				}

				let i = await TrackPlayer.getCurrentTrack(), 
						trackNow = stateRef.current.track;

				let playerListNow = dataStorager.get("MusicPlayerList");

				if(Array.isArray(playerListNow) && i >= 0 && i < playerListNow.length){
					trackNow = playerListNow[i];
				}

				setState({
					track: trackNow,
					previewList: a,
					loaded: isLoaded
				});

				let newIndex = dataStorager.addListener("PreviewPlayerList", async (a)=>{
					if(!Array.isArray(a)){return;}

					let b = a.map(t => t.loaded) || [];
					let isLoaded = (b.filter(Boolean).length / b.length) >= 0.15;

					setState({
						track: stateRef.current.track,
						previewList: a,
						loaded: isLoaded
					});
				});

				setIndex(newIndex);
			})();
		}, []);

		return state;
	}
}