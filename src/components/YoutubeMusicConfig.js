import * as React from 'react';
import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { WebView } from 'react-native-webview';
import { MultiStorager } from '../utils';

let webview = null;
let isRunning = false;
let config = {};

const handleWebViewNavigationStateChange = (newNavState, webview)=>{
  if(webview === null){return;}
  const { url } = newNavState;
  let newURL = "https://www.google.com/images/nav_logo321.webp";

  if(!url.includes('youtube.com')){
    return;
  }

  if(isRunning){
    return;
  }

  const redirectTo = `(function(){
    setTimeout(function(){
      window.ReactNativeWebView.postMessage(document.title); 
      var __ytcfg = {};
      if(window.ytcfg && typeof ytcfg.d === "function"){
        __ytcfg = ytcfg.d();
      }else{
        var content = document.body.parentElement.innerHTML;
        content.split('ytcfg.set(').map(v => {
          try{
            return JSON.parse(v.split(');')[0])
          }catch(_){}
        }).filter(Boolean).forEach(cfg => (__ytcfg = Object.assign(cfg, __ytcfg)));

        __ytcfg["YTMUSIC_INITIAL_DATA"] = [];

        content.split('initialData.push({path:').forEach(v => {
          if(v.search(/\, data\: [\"\']/) >= 0){
            v.split(/\, data\: [\"\']/).map((c, i) => {
              if(i%2 === 0){return;}
              try{
                return decodeURIComponent(c.split(/[\"\']\}\)\;/)[0]);
              }catch(_){}
            }).filter(Boolean).forEach(data => (__ytcfg["YTMUSIC_INITIAL_DATA"].push(data)));
          }
        });
      }

      window.ReactNativeWebView.postMessage(JSON.stringify(__ytcfg));

      setTimeout(function(){window.location = "${newURL}";}, 200);
    }, 200);
  })();`;

  webview.injectJavaScript(redirectTo);
};

export default (props)=>{
  let {onLoad, onChange, onError} = props;
  if(isRunning){
    if(onChange && typeof onChange === "function"){
      onChange(config, true);
    }
    return null;
  }

  return (<WebView 
    style={styles.web_view} 
    ref={(ref)=>{webview = ref;}}
    onNavigationStateChange={(newNavState)=>{
      handleWebViewNavigationStateChange(newNavState, webview);
    }}
    javaScriptEnabled={true}
    originWhitelist={['*']}
    source={{ uri: 'https://music.youtube.com/' }}
    onMessage={event => {
      if(isRunning){return;}
      try{
        config = JSON.parse(event.nativeEvent.data);
        MultiStorager.DataStorager.set("YoutubeMusicConfig_ytcfg", config, true);
      }catch(_){
        isRunning = false;
        if(onError && typeof onError === "function"){
          onError({error:{
            message: "something went wrong",
            code: 400
          }});
        }
        return;
      }
      
      isRunning = true;
      if(onLoad && typeof onLoad === "function"){
        onLoad(config);
      }
      if(onChange && typeof onChange === "function"){
        onChange(config, false);
      }
    }}
  />);
}

const styles = StyleSheet.create({
  web_view: {
    width: 0,
    height: 0,
    opacity: 0,
    top: 0,
    left: 0,
    display: "none",
    position: "absolute"
  }
});