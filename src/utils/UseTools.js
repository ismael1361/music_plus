import { useEffect, useState } from 'react';
import { Keyboard, KeyboardEvent } from 'react-native';

export const useKeyboard = ()=>{
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const onKeyboardDidShow = (e)=>{
    setKeyboardHeight(e.endCoordinates.height);
    console.log(e.endCoordinates.height);
  }

  const onKeyboardDidHide = ()=>{
    setKeyboardHeight(0);
    console.log("onKeyboardDidHide");
  }

  useEffect(()=>{
    Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
    Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
  });

  return [keyboardHeight];
};