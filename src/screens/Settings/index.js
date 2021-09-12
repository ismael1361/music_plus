import React, { useState, useEffect } from 'react';
import { Container, HeaderText, HeaderTitle, ButtonContainer, ButtonText, LabelContainer, LabelText, LabelValue } from './styles';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';

import { Dialog, UserHelper } from "../../utils";

import { ContainerScreen } from "../../components";

import { mdiLogout } from '@mdi/js';

const Title = ({label, ...props})=>{
  return <HeaderTitle {...props}><HeaderText>{label || ""}</HeaderText></HeaderTitle>
}

const Button = ({icon, label, color, ...props})=>{
  color = typeof color === "string" ? color : "#eceff1";
  return <ButtonContainer {...props}>
    {(typeof label === "string" && icon) && <Svg viewBox="0 0 24 24" width="30" height="30" fill={color} style={{
      marginRight: 15
    }}><Path d={icon || ""}/></Svg>}
    <ButtonText color={color}>{label || ""}</ButtonText>
  </ButtonContainer>
}

const Label = ({icon, label, value, color, ...props})=>{
  color = typeof color === "string" ? color : "#eceff1";
  return <LabelContainer>
    {(typeof label === "string" && icon) && <Svg viewBox="0 0 24 24" width="30" height="30" fill={color} style={{
      marginRight: 15
    }}><Path d={icon || ""}/></Svg>}
    <LabelText color={color}>{label || ""}</LabelText>
    <LabelValue color={color}>{value || ""}</LabelValue>
  </LabelContainer>
}

export default ()=>{
  const navigation = useNavigation();

  const logout = ()=>{
    UserHelper.signOut().then(()=>{
      navigation.reset({
        routes: [{name:'SignIn'}]
      });
    }).catch(console.log);
  }

  return <ContainerScreen scroll={true} GeneralStatusBar={{
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    barStyle: "light-content"
  }}>
    <Container>
      <Title label="Conta"/>
      <Button icon={mdiLogout} label="Sair" onPress={logout}/>
      <Title label="Informações"/>
      <Label label="Versão do aplicativo" value="1.00"/>
      <Label label="Versão de recursos" value="0.25"/>
    </Container>
  </ContainerScreen>
}