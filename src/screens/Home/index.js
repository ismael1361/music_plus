import React, { useState, useEffect } from 'react';
import { LoadingIcon, SpaceView } from './styles';
import { useNavigation } from '@react-navigation/native';

import { YoutubeMusic, MultiStorager, PlaylistHelper } from '../../utils';

import { ContainerScreen, GeneralNavigationBarColor, GenresItens, MusicItens } from "../../components";

const dataStorager = MultiStorager.DataStorager;

let dataToHome = ()=>{
  return dataStorager.hasKey("DataToHome") ? dataStorager.get("DataToHome") : {content: [], genres: []};
}

export default ()=>{
  const navigation = useNavigation();

  const [loading, setloading] = useState(true);
  const [dataHome, setDataHome] = useState(dataToHome());
  /*YoutubeMusic.getStreaming("Kx7B-XvmFtE").then((result)=>{
    console.log(result);
  }).catch(console.log);*/

  if(loading){
    YoutubeMusic.getToHome().then((result)=>{
      setloading(false);
      setDataHome(result);
      //console.log(result.content[0]);
    }).catch(console.log);
  }

  const goToMusic = (a)=>{
    /*YoutubeMusic.getAlbum(a.browse.browseId).then((result)=>{
      console.log(JSON.stringify(result.tracks, null, 2));
    }).catch(console.log);*/

    //console.log(JSON.stringify(a, null, 2));

    PlaylistHelper.playPlaylist(navigation, a.browse.browseId, "ALBUM");
  }

  const genresItens = (g)=>{
    console.log(g);
    YoutubeMusic.getGenresCategoryList(g.browse.params, g.browse.clickTrackingParams).then(()=>{});
  }

  return <ContainerScreen scroll={true} GeneralStatusBar={{
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    barStyle: "light-content"
  }}>
    {loading && <LoadingIcon size="large" color="#FFFFFF" />}

    <GenresItens genres={dataHome.genres || []} onPress={genresItens}/>

    <MusicItens list={dataHome.content || []} onPress={goToMusic}/>

    <SpaceView />
  </ContainerScreen>
}

