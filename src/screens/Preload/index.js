import React, { useState, useEffect, useContext } from 'react';
import { LoadingIcon, LogoApp, Hidden } from './styles';
import Svg, { Path, Circle } from 'react-native-svg';
import { mdiMusicCircle } from '@mdi/js';
import { useNavigation } from '@react-navigation/native';

import { YoutubeMusicConfig, ContainerScreen, GeneralNavigationBarColor } from '../../components';

import { UserHelper, MultiStorager } from '../../utils';

export default () => {
  const navigation = useNavigation();
  const [acquiredSettings, setAcquiredSettings] = useState(false);
  const [wasRestoration, setWasRestoration] = useState(false);

  const checkUser = ()=>{
    let ytcfg = MultiStorager.DataStorager.get("initialYoutubeConfig");
    console.log('Key: ', ytcfg.INNERTUBE_API_KEY);
    console.log('YTMUSIC_INITIAL_DATA: ', Array.isArray(ytcfg.YTMUSIC_INITIAL_DATA));

    setTimeout(()=>{
      UserHelper.getUser().then((user)=>{
        navigation.reset({
          routes:[{name:'MainTab'}]
        });
      }, (e)=>{
        navigation.reset({
          routes:[{name:'SignIn'}]
        });
      });
    }, 1000);
  }

  const updateYoutubeMusicConfig = ()=>{
    checkUser();
    return null;
  }

  const containsYoutubeConfig = ()=>{
    return MultiStorager.DataStorager.hasKey("initialYoutubeConfig") && MultiStorager.DataStorager.hasKey("containsYoutubeConfig") && MultiStorager.DataStorager.get("containsYoutubeConfig") === true;
  }

  if(wasRestoration === false){
    MultiStorager.restore().then(()=>{
      setWasRestoration(true);
    }).catch((err)=>{
      console.log(err);
      setWasRestoration(true);
    });
  }

  return (
    <ContainerScreen GeneralStatusBar={{
      backgroundColor: "transparent",
      barStyle: "light-content"
    }} backgroundColor="#212121">
      <LogoApp viewBox="0 0 24 24">
        <Path fill="rgba(255, 255, 255, .2)" d={mdiMusicCircle}/>
      </LogoApp>

      {wasRestoration && acquiredSettings === false ? <Hidden>
        <YoutubeMusicConfig
          onChange={(config) => {
            MultiStorager.DataStorager.set("initialYoutubeConfig", config, true);
            MultiStorager.DataStorager.set("containsYoutubeConfig", true, true);
            checkUser();
            setAcquiredSettings(true);
          }}
        />
      </Hidden> : null}

      <GeneralNavigationBarColor 
        backgroundColor="transparent"
        barStyle="light-content"
      />
    </ContainerScreen>
  );
};
