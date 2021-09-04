import React, { useState } from 'react';
import styled from 'styled-components/native';
import { ImageBackground } from "react-native";

const HeaderArea = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
`;

const TitleText = styled.Text`
  width: 100%;
  font-size: 24px;
  font-weight: bold;
  color: #FFF;
`;

const ScrollMusics = styled.ScrollView`
  width: 100%;
`;

const MusicContainer = styled.SafeAreaView`
  flex-direction: row;
  padding: 5px 0px 5px 16px;
  margin-bottom: 15px;
`;

const ItemMusic = styled.TouchableOpacity`
  width: 150px;
  margin-right: 16px;
`;

const CapaMusic = styled.SafeAreaView`
  width: 100%;
  height: 150px;
  overflow: hidden;
  border-radius: 5px;
`;

const CapaMusicBackground = styled(ImageBackground)`
  background: rgba(0, 0, 0, 0.3);
  flex: 1;
`;

const TitleMusic = styled.Text`
  width: 100%;
  font-size: 14px;
  font-weight: bold;
  color: #fafafa;
  margin: 2px 2px 5px 2px;
`;

const SubtitleMusic = styled.Text`
  width: 100%;
  font-size: 10px;
  font-weight: bold;
  color: #bdbdbd;
  margin: 0px 2px;
`;

export default (props)=>{
  if(Array.isArray(props.list) !== true || props.list.length <= 0){
    return null;
  }

  const onClick = (index)=>{
    return ()=>{
      if(typeof props.onPress === "function"){
        props.onPress(props.list[index]);
      }
    }
  }

  let components = [];

  components.push(<HeaderArea key="MusicItens_HeaderArea">
    <TitleText>{`Novos álbuns e singles`}</TitleText>
  </HeaderArea>);

  let rows = 3;
  let cols = Math.floor(props.list/rows);
  let itens = [];

  for(let i=0; i<props.list.length; i++){
    let r = i%rows;
    if(Array.isArray(itens[r]) !== true){
      itens[r] = [];
    }

    let image = props.list[i].thumbnails[0].url;
    itens[r].push(
    <ItemMusic onPress={onClick(i)} key={("MusicItens_CapaMusics_"+i)}>
      <CapaMusic>
        <CapaMusicBackground source={{uri: image}} resizeMode="cover"></CapaMusicBackground>
      </CapaMusic>
      <TitleMusic numberOfLines={2} ellipsizeMode='tail'>{props.list[i].title || ""}</TitleMusic>
      <SubtitleMusic numberOfLines={2} ellipsizeMode='tail'>{props.list[i].subtitle || ""}</SubtitleMusic>
    </ItemMusic>);
  }

  for(let r=0; r<itens.length; r++){
    components.push(<ScrollMusics key={("MusicItens_ScrollMusics_"+r)} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} horizontal={true}>
      <MusicContainer>
        {itens[r]}
      </MusicContainer>
    </ScrollMusics>);
  }

  return components;
}

