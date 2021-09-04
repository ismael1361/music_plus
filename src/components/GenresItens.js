import React, { useState } from 'react';
import styled from 'styled-components/native';

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

const ScrollGenres = styled.ScrollView`
  width: 100%;
`;

const ContainerGenres = styled.SafeAreaView`
  flex-direction: column;
  padding: 5px 0px 5px 16px;
`;

const ContainerGenresRow = styled.SafeAreaView`
  flex-direction: row;
  align-items: center;
`;

const GenresButton = styled.TouchableOpacity`
  flex-direction: column;
  width: 180px;
  height: 48px;
  border-style: solid;
  border-width: 1px;
  border-left-width: 6px;
  border-left-color: ${props => (props.color || "#2196F3")};
  border-top-color: rgba(255, 255, 255, 0.1);
  border-right-color: rgba(255, 255, 255, 0.2);
  border-bottom-color: rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.1);
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  padding: 0 12px;
  margin-bottom: 16px;
  margin-right: 16px;
`;

const GenresButtonText = styled.Text`
  width: 100%;
  font-size: 16px;
  font-weight: bold;
  color: #FFF;
`;

export default (props)=>{
  if(Array.isArray(props.genres) !== true || props.genres.length <= 0){
    return null;
  }

  const onClick = (index)=>{
    return ()=>{
      if(typeof props.onPress === "function"){
        props.onPress(props.genres[index]);
      }
    }
  }

  return [
    <HeaderArea key="GenresItens_HeaderArea">
      <TitleText>{`Momentos e gêneros`}</TitleText>
    </HeaderArea>,
    <ScrollGenres showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} horizontal={true} key="GenresItens_ScrollGenres">
      <ContainerGenres>
        <ContainerGenresRow>{props.genres.map((el, i)=>{
          if(i%4 != 0){return null;}
          return <GenresButton color={el.color} key={i} onPress={onClick(i)}>
            <GenresButtonText>{el.title}</GenresButtonText>
          </GenresButton>
        })}</ContainerGenresRow>

        <ContainerGenresRow>{props.genres.map((el, i)=>{
          if(i%4 != 1){return null;}
          return <GenresButton color={el.color} key={i} onPress={onClick(i)}>
            <GenresButtonText>{el.title}</GenresButtonText>
          </GenresButton>
        })}</ContainerGenresRow>

        <ContainerGenresRow>{props.genres.map((el, i)=>{
          if(i%4 != 2){return null;}
          return <GenresButton color={el.color} key={i} onPress={onClick(i)}>
            <GenresButtonText>{el.title}</GenresButtonText>
          </GenresButton>
        })}</ContainerGenresRow>

        <ContainerGenresRow>{props.genres.map((el, i)=>{
          if(i%4 != 3){return null;}
          return <GenresButton color={el.color} key={i} onPress={onClick(i)}>
            <GenresButtonText>{el.title}</GenresButtonText>
          </GenresButton>
        })}</ContainerGenresRow>
      </ContainerGenres>
    </ScrollGenres>
    ]
}