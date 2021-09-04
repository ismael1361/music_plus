import React, { useState } from 'react';
import {  Text, View, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';
import Svg, { Path } from 'react-native-svg';

import { mdiAlert, mdiAlertCircle, mdiCheckCircle, mdiInformation } from '@mdi/js';

import { Button } from 'react-native-paper';

import { MultiStorager } from '../utils';

const dataStorager = MultiStorager.DataStorager;

const Container = styled(Modal)`
  flex: 1;
  margin: 0px;
  padding: 0px;
  align-items: center;
  justify-content: flex-end;
`;

const Main = styled.SafeAreaView`
  z-index: 9;
  flex: 1;
  width: 100%;
  height: 50%;
  position: absolute;
  background: ${props => props.theme && typeof props.theme.background === "string" ? props.theme.background : "#fafafa"};
`;

export const IconMain = styled.SafeAreaView`
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 20px 15px;
`;

export const Icon = styled(Svg)`
  width: 70px;
  height: 70px;
`;

const Title = styled.Text`
  width: 100%;
  padding: 10px 15px;
  font-size: 25px;
  font-weight: bold;
  color: ${props => props.theme && typeof props.theme.colorSecondary === "string" ? props.theme.colorSecondary : "#263238"};
`;

const Scroll = styled(ScrollView)`
  flex: 1;
  padding: 5px 15px 10px 15px;
`;

const ScrollContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const ButtonsGroup = styled.SafeAreaView`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 5px 15px 10px 15px;
`;

const ButtonClose = styled(Button)`
  border-radius: 10px;
  border-width: 2px;
  padding: 0px 10px;
  margin: 0px;
  justify-content: center;
  align-items: center;
`;

export default ()=>{
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [info, setInfo] = useState({
    "type": "alert",
    "title": "",
    "body": (<Text></Text>)
  });

  dataStorager.deleteListener("__dialog");
  dataStorager.addListener("__dialog", (a)=>{
    if(a && typeof a.show === "boolean"){
      setIsModalVisible(a.show);
      setInfo(a.info);
    }
  });

  const onClose = ()=>{
    setIsModalVisible(false);
    let config = dataStorager.get("__dialog") || {};
    if(config.info && typeof config.info.onClose === "function"){
      config.info.onClose();
    }
  }

  const getColorTheme = ()=>{
    const themes = {
      "default": {
        background: "#fafafa", 
        colorPrimary: "#263238", 
        colorSecondary: "#263238"
      },
      "error": {
        background: "#ffebee",
        colorPrimary: "#b71c1c",
        colorSecondary: "#b71c1c"
      },
      "sucess": {
        background: "#e8f5e9",
        colorPrimary: "#1b5e20",
        colorSecondary: "#1b5e20"
      },
      "warning": {
        background: "#fff3e0",
        colorPrimary: "#e65100",
        colorSecondary: "#e65100"
      }
    }

    return info.type in themes ? themes[info.type] : themes["default"];
  }

  const getHeader = ()=>{
    let icon = {
      "error": mdiAlert,
      "sucess": mdiCheckCircle,
      "warning": mdiAlertCircle,
      "info": mdiInformation
    }

    if(info.type in icon){
      return (<IconMain>
        <Icon viewBox="0 0 24 24" fill={getColorTheme().colorPrimary}>
          <Path d={icon[info.type]}/>
        </Icon>
      </IconMain>);
    }

    return (<Title theme={getColorTheme()}>{info.title}</Title>);
  }

  return (<Container 
    isVisible={isModalVisible} 
    onBackButtonPress={()=>onClose()}
    onBackdropPress={()=>onClose()}
  >
    <Main theme={getColorTheme()}>
      {getHeader()}
      <Scroll contentContainerStyle={{flexGrow: 1}}>
        <ScrollContainer>
          {typeof info.body === "string" ? <Text style={{color: (getColorTheme().colorPrimary), fontSize: 20, textAlign: "center"}}>{info.body}</Text> : info.body}
        </ScrollContainer>
      </Scroll>
      <ButtonsGroup>
        <ButtonClose labelStyle={{fontSize: 17}} color={(getColorTheme().colorPrimary)} mode={"outlined"} onPress={()=>onClose()}>Ok</ButtonClose>
      </ButtonsGroup>
    </Main>
  </Container>)
}