import React, { useState, useEffect } from 'react';
import { Container, HeaderText, HeaderTitle, ButtonContainer, ButtonText } from './styles';
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
    {typeof label === "string" ? <Svg viewBox="0 0 24 24" width="30" height="30" fill={color}><Path d={icon || ""}/></Svg> : null}
    <ButtonText color={color}>{label || ""}</ButtonText>
  </ButtonContainer>
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
    </Container>
  </ContainerScreen>
}