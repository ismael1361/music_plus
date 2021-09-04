import React from 'react';
import styled from 'styled-components/native';
import Svg from 'react-native-svg';

import { Button } from 'react-native-paper';

export const Scroll = styled.ScrollView`
  flex: 1;
  flex-grow: 1;
`;

export const Container = styled.SafeAreaView`
  background-color: #212121;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 15px;
`;

export const Logo = styled(Svg)`
  width: 100px;
  height: 100px;
  margin-bottom: 50px;
  color: #bdbdbd;
`;

export const ContainerButtons = styled.View`
  width: 100%;
  margin-top: 25px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const ButtonMain = styled(Button)`
  border-radius: 30px;
  padding: 5px 15px;
  border-width: 2px;
  margin-left: 5px;
  justify-content: center;
  align-items: center;
`;