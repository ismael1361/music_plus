import React, { useState, useEffect } from 'react';
import { Result, TrackMusic } from '../Models';

import YoutubeMusic from "./YoutubeMusic";
import MultiStorager from "./MultiStorager";

import TrackPlayer, { useProgress, useTrackPlayerEvents, Event, Capability, State } from 'react-native-track-player';

const dataStorager = MultiStorager.DataStorager;

const react1 = require('react');

const _ = require('lodash');

const getAllColorThemeBy = (listMusics, callback)=>{
	return new Promise((resolve, reject) => {
		Promise.all(listMusics.map(async (music, i)=>{
			music = new TrackMusic().parse(null, music);

			await music.getColorTheme();

			callback(music, i);

      return music;
    })).then((list)=>{
      resolve(list);
    }).catch(reject);
	});
}

export default class PlaylistHelper{
	static getPlaylistForBrowseId(browseId){
		return new Promise((resolve, reject)=>{
			if(dataStorager.hasKey("Playlist_"+browseId)){
				let r = dataStorager.get("Playlist_"+browseId).map(t => new TrackMusic().parse(null, t));

				resolve(r);
				return;
			}

			let list = [];

			const byResult = (r)=>{
				dataStorager.set("Playlist_"+browseId, r.map(t => t.toJson()));
				resolve(r);
			}

			YoutubeMusic.getPlaylist(browseId, 60).then((result)=>{
				try{
					result?.content.forEach((t)=>{
						let {videoId, duration, name, author, thumbnails} = t;
						let subtitle = Array.isArray(author) ? author.map(v=>v.name).join(" • ") : (author.name || "");

						list.push(new TrackMusic(null, browseId, videoId, null, null, name, subtitle, duration, (Array.isArray(thumbnails) ? thumbnails : [thumbnails])));
					});

					byResult(list);
				}catch(error){
					reject(new Result(-1, error.message, null, {}));
				}
      	setContent(result);
      }).catch(reject);
		});
	}

	static getPlaylistForAlbum(browseId){
		return new Promise((resolve, reject)=>{
			if(dataStorager.hasKey("Playlist_"+browseId)){
				let r = dataStorager.get("Playlist_"+browseId).map(t => new TrackMusic().parse(null, t));

				resolve(r);
				return;
			}

			let list = [];

			const byResult = (r)=>{
				dataStorager.set("Playlist_"+browseId, r.map(t => t.toJson()));
				resolve(r);
			}

			YoutubeMusic.getAllPlaylistId(browseId).then((playlistId)=>{
				YoutubeMusic.getPlaylistById(playlistId[0]).then((result)=>{
					result.forEach((t)=>{
						let {videoId, playlistId, params, title, subtitle, thumbnails} = t;

						list.push(new TrackMusic(null, browseId, videoId, playlistId, params, title, subtitle, null, thumbnails));
					});

					let last = list[list.length-1] && "videoId" in list[list.length-1] ? list[list.length-1]["videoId"] : null;

					if(!last){
						byResult(list);
						return;
					}

					YoutubeMusic.getNext(last, list[list.length-1]["playlistId"]).then((c)=>{
						try{
							c.content.forEach((t)=>{
								let {videoId, playlistId, params, title, subtitle, thumbnails} = t;

								list.push(new TrackMusic(null, browseId, videoId, playlistId, params, title, subtitle, null, thumbnails));
							});

							byResult(list);
						} catch (error) {
		          reject(new Result(-1, error.message, null, {}));
		        }
					}).catch(reject);
				}).catch(reject);
			}).catch(reject);
		});
	}

	static getPlaylistBy(browseId){
		if(_.startsWith(browseId, 'VL') || _.startsWith(browseId, 'PL')){
			return this.getPlaylistForBrowseId(browseId);
		}else if(_.startsWith(browseId, 'MPREb')){
			return this.getPlaylistForAlbum(browseId);
		}else{
			return Promise.resolve([]);
		}
	}

	static playPlaylist(navigation, browseId, list, skipTo){
		return new Promise(async (resolve, reject)=>{
			if(Array.isArray(list) !== true){
	    	resolve();
	    	return;
			}

			const isValidList = Array.isArray(list) ? list.map(t => t instanceof TrackMusic).every(Boolean) : false;

			if(!isValidList){
				list = list.map(t => new TrackMusic().parse(null, t));
			}

			navigation.navigate("PlayView", {
	      type: "loading"
	    });

	    const pList = dataStorager.get("PreviewPlayerList");

	    let indexNow = await TrackPlayer.getCurrentTrack();

	    if(Array.isArray(pList) && pList.length > 0 && pList[pList.length-1]?.browseId === browseId){
				if(typeof skipTo === "number" && skipTo !== indexNow){
					await TrackPlayer.skip(skipTo%pList.length);
				}
				await TrackPlayer.play();
	    	resolve();
	    	return;
	    }

	    await this.trackPlayerInit();

    	dataStorager.set("PlayerListId", list[0]["browseId"], true);

    	YoutubeMusic.getStreamingList(list.map(v => v.videoId)).then((streamings)=>{
    		let result = [];

    		for(let i=0; i<list.length; i++){
    			if(streamings[i].every(t=>{return t.url !== ""})){
	    			list[i].streamings = streamings[i];
	    			result.push(new TrackMusic().parse(null, list[i]));
	    		}
    		}

    		dataStorager.set("Playlist_"+browseId, result.map(t => t.toJson()));

				let previewPlayerList = result.map((t, i) => {
					return {
						index: i, 
						title: t.title,
						subtitle: t.subtitle,
						videoId: t.videoId,
						playlistId: t.playlistId,
						thumbnails: t.thumbnails,
						browseId: browseId,
						loaded: false
					}
				});

	    	dataStorager.set("PreviewPlayerList", previewPlayerList);

				this.playByPlayList(result, skipTo);
				resolve();
    	}).catch(()=>{
    		navigation.goBack();
    	});
		});
	}

	static trackPlayerInit(listMusics){
		return new Promise(async (resolve, reject)=>{
			await TrackPlayer.reset();
		  if(Array.isArray(listMusics) && listMusics.length > 0){
				await TrackPlayer.add(listMusics);
		  }
	    dataStorager.set("MusicPlayerList", [], true);
	    dataStorager.set("PlaylistInitialized", true);
	    dataStorager.set("PreviewPlayerList", []);
			resolve(true);
		});
	};

	static async playByPlayList(list, skipTo){
		let browseId = dataStorager.get("PlayerListId");

		if(list[0]["browseId"] !== browseId){
			return;
		}

		const isValidList = Array.isArray(list) ? list.map(t => t instanceof TrackMusic).every(Boolean) : false;

		if(!isValidList){
			return;
		}

		let trackList = list.map((music, i)=>{
			let capa_image = music.thumbnails[music.thumbnails.length-1]["url"];
			let streaming = music.streamings[0]["url"] || "";

			return {
				id: i,
				url: streaming,
				title: music.title,
				album: "",
				artist: music.subtitle,
				artwork: capa_image,
			}
		});

		await list[0].getColorTheme();

		await TrackPlayer.add(trackList);

		getAllColorThemeBy(list, (m, i)=>{
			let playerListNow = dataStorager.get("MusicPlayerList");
			playerListNow = Array.isArray(playerListNow) ? playerListNow : [];

			m = m.toJson();
		  m.index = i;
			playerListNow[i] = m;

	    dataStorager.set("MusicPlayerList", playerListNow, true);
		}).then((r)=>{});

		let previewPlayerList = dataStorager.get("PreviewPlayerList");

		previewPlayerList.forEach((t, i)=>{
			previewPlayerList[i].loaded = true;
		});

		previewPlayerList[previewPlayerList.length-1].loaded = false;

		dataStorager.set("PreviewPlayerList", previewPlayerList);

	  dataStorager.set("MusicPlayerList", list.map((m, i)=>{
	  	m = m.toJson();
	  	m.index = i;
	  	return m;
	  }), true);

	  if(typeof skipTo === "number"){
			await TrackPlayer.skip(skipTo%list.length);
		}
		await TrackPlayer.play();

		previewPlayerList[previewPlayerList.length-1].loaded = true;

		dataStorager.set("PreviewPlayerList", previewPlayerList);
	}

	static useMusicPlaying(){
		const _a = react1.useState({
			track: new TrackMusic().toJson(),
			previewList: [],
			loaded: false,
			initialized: false
		}), 
		state = _a[0], 
		setState = _a[1];

		const [index, setIndex] = react1.useState(-1);
		const indexRef = react1.useRef();
		
		const stateRef = react1.useRef();

		indexRef.current = index;
		stateRef.current = state;

		useTrackPlayerEvents([Event.PlaybackTrackChanged, Event.PlaybackState], async event => {
			if(event.type !== Event.PlaybackTrackChanged){return;}

			let playerListNow = dataStorager.get("MusicPlayerList");
			let index = typeof event.nextTrack === "number" ? event.nextTrack : null;

			if(!playerListNow || index < 0 || index >= playerListNow.length){
				return;
			};

			let track = playerListNow[index];

			if(!track){
				track = new TrackMusic().toJson();
			}

			setState({
				track: track,
				previewList: state.previewList,
				loaded: state.loaded,
				initialized: (dataStorager.get("PlaylistInitialized") === true)
			});
		});

		react1.useEffect(()=>{
			(async ()=>{
				if(indexRef.current >= 0){
					dataStorager.deleteListener("PreviewPlayerList", indexRef.current);
				}

				let a = dataStorager.get("PreviewPlayerList"), 
						isLoaded = stateRef.current.loaded;

				if(Array.isArray(a)){
					let b = a.map(t => t.loaded) || [false];
					isLoaded = a.length > 0 && b.every(Boolean);
				}else{
					isLoaded = false;
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
					loaded: isLoaded,
					initialized: (dataStorager.get("PlaylistInitialized") === true)
				});

				let newIndex = dataStorager.addListener("PreviewPlayerList", async (a)=>{
					if(!Array.isArray(a)){return;}

					let b = a.map(t => t.loaded) || [false];
					let isLoaded = a.length > 0 && b.every(Boolean);

					setState({
						track: stateRef.current.track,
						previewList: a,
						loaded: isLoaded,
						initialized: (dataStorager.get("PlaylistInitialized") === true)
					});
				});

				setIndex(newIndex);
			})();

			return ()=>{
				if(indexRef.current >= 0){
					dataStorager.deleteListener("PreviewPlayerList", indexRef.current);
				}
			}
		}, []);

		return state;
	}
}