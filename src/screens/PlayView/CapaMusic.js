import React, { useState, useEffect } from 'react';

import { CapaMusic, CapaMusicBackground, CapaMusicActions, CapaMusicActionsBtn, CapaMusicLoadingIcon } from './styles';

import { Color } from '../../utils';

import { mdiThumbDownOutline, mdiThumbUpOutline, mdiArrowCollapseDown, mdiPlaylistPlus, mdiShareOutline } from '@mdi/js';

import Svg, { Path } from 'react-native-svg';

let _showCapaActionsTimeout = null;

export default ({ image, color, disabled, isLoading })=>{
  const [capaActionsVisible, setCapaActionsVisible] = useState(false);

  const showCapaActions = ()=>{
    setCapaActionsVisible(!capaActionsVisible);

    clearTimeout(_showCapaActionsTimeout);
    _showCapaActionsTimeout = setTimeout(()=>{
      setCapaActionsVisible(false);
    }, 7000);
  }

  color = typeof color === "string" ? color : "#212121";

  const colorText = ((Color(color).rgb.reduce((a,b)=>a+b, 0))/3) > 120 ? "#212121" : "#f5f5f5";

	return <CapaMusic disabled={disabled} activeOpacity={1} onPress={showCapaActions}>
    <CapaMusicBackground source={{uri: image}} resizeMode="cover"/>
    {isLoading ? <CapaMusicLoadingIcon size={100} color="#FFFFFF"/> : null}
    <CapaMusicActions
    	colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 1)"]}
			start={{x: 0.5, y: 0}} end={{x: 0.5, y: 1}}
			visible={capaActionsVisible}
    >
    	<CapaMusicActionsBtn backgroundColor={color}>
    		<Svg viewBox="0 0 24 24" width="20" height="20" fill={colorText}><Path d={mdiThumbDownOutline}/></Svg>
    	</CapaMusicActionsBtn>
    	<CapaMusicActionsBtn backgroundColor={color}>
    		<Svg viewBox="0 0 24 24" width="20" height="20" fill={colorText}><Path d={mdiThumbUpOutline}/></Svg>
    	</CapaMusicActionsBtn>
    	<CapaMusicActionsBtn backgroundColor={color}>
    		<Svg viewBox="0 0 24 24" width="20" height="20" fill={colorText}><Path d={mdiArrowCollapseDown}/></Svg>
    	</CapaMusicActionsBtn>
    	<CapaMusicActionsBtn backgroundColor={color}>
    		<Svg viewBox="0 0 24 24" width="20" height="20" fill={colorText}><Path d={mdiPlaylistPlus}/></Svg>
    	</CapaMusicActionsBtn>
    	<CapaMusicActionsBtn backgroundColor={color}>
    		<Svg viewBox="0 0 24 24" width="20" height="20" fill={colorText}><Path d={mdiShareOutline}/></Svg>
    	</CapaMusicActionsBtn>
    </CapaMusicActions>
  </CapaMusic>
}