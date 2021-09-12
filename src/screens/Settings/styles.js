import React from 'react';
import styled from 'styled-components/native';

export const Container = styled.ScrollView`
  background-color: #424242;
  width: 100%;
`;

export const HeaderText = styled.Text`
  color: #eceff1;
  font-size: 16px;
`;

export const HeaderTitle = styled.ScrollView`
  background-color: rgba(255, 255, 255, .1);
  padding: 5px 10px;
  border-style: solid;
  border-width: 1px;
  border-left-width: 0px;
  border-right-width: 0px;
  border-width: 1px;
  border-top-color: rgba(255, 255, 255, 0.2);
  border-bottom-color: rgba(255, 255, 255, 0.2);
`;

export const ButtonContainer = styled.TouchableOpacity`
  padding: 10px 15px;
  flex-direction: row;
  border-style: solid;
  border-bottom-color: rgba(0, 0, 0, 0.1);
  border-bottom-width: 1px;
  align-items: center;
`;

export const ButtonText = styled.Text`
  color: ${(props)=>{return (typeof props.color === "string" ? props.color : "#eceff1")}};
  font-size: 20px;
  flex: 1;
`;

//LabelContainer, LabelText, LabelValue

export const LabelContainer = styled.View`
  padding: 5px 15px;
  flex-direction: row;
  border-style: solid;
  border-bottom-color: rgba(0, 0, 0, 0.1);
  border-bottom-width: 1px;
  align-items: center;
`;

export const LabelText = styled.Text`
  color: ${(props)=>{return (typeof props.color === "string" ? props.color : "#eceff1")}};
  font-size: 18px;
  flex: 1;
`;

export const LabelValue = styled.Text`
  color: ${(props)=>{return (typeof props.color === "string" ? props.color : "#eceff1")}};
  font-size: 18px;
  padding-left: 15px;
  font-weight: bold;
`;
