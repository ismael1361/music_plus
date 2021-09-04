import React from 'react';
import styled from 'styled-components/native';

import Svg from 'react-native-svg';

export const LogoApp = styled(Svg)`
  height: 250px;
  width: 250px;
`;

export const Hidden = styled.SafeAreaView`
  position: absolute;
  height: 1px;
  width: 1px;
  max-height: 1px;
  max-width: 1px;
  opacity: 0;
  display: none;
  background-color: #f44336;
  overflow: hidden;
`;

export const LoadingIcon = styled.ActivityIndicator`
  margin-top: 50px;
`;
