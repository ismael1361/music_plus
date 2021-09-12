import React from 'react';
import styled from 'styled-components/native';
import { StatusBar, Platform } from 'react-native';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

import { setPropsStatusBar } from './GeneralStatusBarColor';

const Container = styled.View`
  background-color: ${(props)=>{return typeof props.backgroundColor === "string" ? props.backgroundColor : "#424242"}};
  flex: 1;
`;

const ContainerScroll = styled.ScrollView`
  padding-top: ${(props)=>{return props.statusbarSize === true ? STATUSBAR_HEIGHT : 0}}px;
  flex: 1;
`;

const ContainerView = styled.View`
  padding-top: ${(props)=>{return props.statusbarSize === true ? STATUSBAR_HEIGHT : 0}}px;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export default ({GeneralStatusBar, scroll, backgroundColor, statusbarSize, ...props})=>{
	setPropsStatusBar(GeneralStatusBar);

	statusbarSize = typeof statusbarSize !== "boolean" ? true : statusbarSize;

	return (<Container backgroundColor={backgroundColor}>
	  {scroll === true ? (<ContainerScroll statusbarSize={statusbarSize} contentContainerStyle={{flexGrow: 1}}>
			{props.children}
		</ContainerScroll>) : (<ContainerView statusbarSize={statusbarSize}>
			{props.children}
		</ContainerView>)}
	</Container>)
}