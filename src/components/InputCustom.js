import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components/native';
import { MultiStorager, Color } from "../utils";
import Svg from 'react-native-svg';
import Modal from 'react-native-modal';

import { Button } from 'react-native-paper';

const dataStorager = MultiStorager.DataStorager;

const InputArea = styled.View`
  width: 100%;
  height: 55px;
  background-color: ${props => typeof props.bgColor === "string" ? props.bgColor : "#fafafa"};
  flex-direction: row;
  border-radius: 30px;
  padding-left: 15px;
  align-items: center;
  margin: 10px 0px;
  padding: 5px 10px;
  border: 3px solid ${props => props.error !== true ? "transparent" : "#d50000"};
  opacity: ${props => props.disabled !== true ? "1" : "0.8"};
`;

const InputTouch = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  align-items: center;
  height: 55px;
  opacity: ${props => props.isPlaceholder !== true ? "1" : "0.8"};
`;

const InputReadOnly = styled.Text`
  font-size: 16px;
  color: ${props => typeof props.color === "string" ? props.color : "#212121"};
  margin-left: 10px;
`;

const Input = styled.TextInput`
  flex: 1;
  font-size: 16px;
  color: ${props => typeof props.color === "string" ? props.color : "#212121"};
  margin-left: 10px;
  height: 55px;
`;

const mask_cnpj = {
  mask: [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/],
  mountMask: true
};
const mask_telephone = {
  mask: ['(', /\d/, /\d/, ')', ' ', /\d/, ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
  mountMask: true
};
const mask_email = {
  mask: [new RegExp("[a-z0-9!#$%&\.'*+/=?^_`{|}~-]+"), /@/, /(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+/, /[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/],
  mountMask: false
};
const mask_password = {
  mask: [new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]{8,}")],
  mountMask: false
};

const ComponentInputText = ({showInDialog, IconSvg, iconPosition="left", placeholder, bgColor, textColor, value_="", onChangeText, type, disabled=false, readOnly=false, mask, maskValidation, mountMask=true, inputRef, autoFocus, selection, onSelectionChange, ...props})=>{
  const [value, setValue] = useState(value_);
  const password = type === "password";

  const maskList = {
    "cnpj" : mask_cnpj,
    "telephone" : mask_telephone,
    "email" : mask_email,
    "password" : mask_password
  };

  const validMask = (mask)=>{
    if((mask && Array.isArray(mask)) !== true){return false;}
    var l = mask.reduce(function(accumulator, currentValue){
      if(typeof currentValue === "string" || currentValue instanceof RegExp){
        return accumulator + 1;
      }
      return accumulator;
    }, 0);
    return l === mask.length;
  }

  if(validMask(mask) !== true && type in maskList && maskList[type].mountMask){
    mask = maskList[type].mask;
  }

  let inputRef_ = useRef();

  const [inputSelection, setInputSelection] = useState(selection || {start: 0, end: 0});

  const getBackgroundColor = ()=>{
    let color = Color(bgColor);
    if(color.isValidColor){
      return bgColor;
    }
    return "#fafafa";
  }

  const getColorText = ()=>{
    let color = Color(textColor);
    if(color.isValidColor){
      return textColor;
    }
    
    color = Color(getBackgroundColor());
    if(color.isValidColor){
      let hsl = color.hsl;
      let rgb = color.rgb;

      return ((rgb[0] + rgb[1] + rgb[2]) / 3) / 255 > 0.5 ? "#212121" : "#fafafa";
    }

    return "#212121";
  }

  const getPlaceholderColorText = ()=>{
    let color = Color(getColorText());
    if(color.isValidColor){
      color = color.lighten(35);
      return 'rgb('+color[0]+', '+color[1]+', '+color[2]+')';
    }
    return "#616161";
  }

  const setSelection = (start, end)=>{
    start = typeof start === "number" ? start : value.length;
    end = typeof end === "number" ? end : start;

    if(inputRef_ !== null){
      inputRef_.setNativeProps({
        selection: {start, end}
      });
      if(typeof inputRef_.focus === "function"){
        inputRef_.focus();
      }
    }
  }

  const convertMask = (value)=>{
    if(validMask(mask) !== true){return value;}
    let temp = String(value), result = "";

    mask.forEach((m, i)=>{
      if(typeof m === "string" && temp.length >= 1){
        result += m;
      }else if(m instanceof RegExp){
        let str = temp.match(m);
        if(!str || str.length < 1){
          return;
        }
        str = str[0];
        if(temp.search(str) === 0){
          temp = temp.substring(str.length, temp.length);
          result += str;
        }
      }
    });

    return result;
  }

  const invertMask = (value)=>{
    if(validMask(mask) !== true){return value;}
    let temp = String(value), result = "";

    mask.forEach((m)=>{
      if(m instanceof RegExp){
        let str = temp.match(m);
        if(!str || str.length < 1){
          return;
        }
        str = str[0];
        if(temp.search(str) >= 0){
          temp = temp.substring(temp.search(str) + str.length, temp.length);
          result += str;
        }
      }
    });

    return result;
  }

  const valueMaskValid = (value)=>{
    let mask_ = [];
    if(validMask(maskValidation)){
      mask_ = maskValidation;
    }else if(validMask(mask) !== true && type in maskList){
      mask_ = maskList[type].mask;
    }else if(validMask(mask) !== true){
      return true;
    }else{
      mask_ = mask;
    }

    let temp = String(value), valid = true, i;

    mask_.forEach((m)=>{
      if(valid !== true || temp.length <= 0){valid = false; return valid;}
      if(typeof m === "string"){
        if(temp.indexOf(m) === 0){
          temp = temp.substring(m.length, temp.length);
          return;
        }
      }else if(m instanceof RegExp){
        let str = temp.match(m);
        if(str && str.length > 0){
          str = str[0];
          if(temp.search(str) === 0){
            temp = temp.substring(str.length, temp.length);
            return;
          }
        }
      }
      valid = false;
    });

    return valid;
  }

  const seValue = (t)=>{
    setValue(t);
    let value = convertMask(invertMask(t)),
        start = inputSelection.start;

    start = start > value.length || (start >= t.length) ? value.length : start;

    //console.log(value);
    setValue(value);

    if(typeof onChangeText === "function"){
      let result = typeof mountMask === "boolean" && mountMask === true ? value : invertMask(value);
      onChangeText(result, valueMaskValid(value));
    }

    /*setSelection(start, start);*/
  }

  let isInitialDialog = 0;

  const setSelectionState = ({ nativeEvent: { selection } }) => {
    if(isInitialDialog > 1 && showInDialog !== false){return;}
    setInputSelection(selection);
    if(typeof onSelectionChange === "function"){
      onSelectionChange(selection);
    }
  }

  const showDialog = ()=>{
    if(showInDialog !== true){ return; }
    isInitialDialog += 1;

    let config = {show: true};

    config.props = {
      IconSvg, iconPosition, placeholder, bgColor, textColor, value_: value, type, disabled, mask, maskValidation, mountMask, ...props
    };

    config.inputSelection = inputSelection;

    config.onChangeText = seValue;
    config.onInputSelection = (selection) => setInputSelection(selection);

    dataStorager.set("__dialogInput", config);
  }

  const hideDialog = ()=>{
    if(showInDialog !== false){ return; }
    isInitialDialog = 0;
    let config = {show: false};

    dataStorager.set("__dialogInput", config);
  }

  useEffect(()=>{
    if(autoFocus){
      //inputRef_.current.focus();
    }

    if(typeof inputRef === "function"){
      inputRef(inputRef_);
    };
  });

  return (<InputArea disabled={disabled} bgColor={getBackgroundColor()} error={value.length > 0 ? valueMaskValid(value) !== true : false}>
    {IconSvg}
    {readOnly ? <InputTouch
      isPlaceholder={value.length <= 0}
    ><InputReadOnly numberOfLines={1}
      color={value.length > 0 && valueMaskValid(value) !== true ? "#b71c1c" : getColorText()}
    >
      {value.length > 0 ? value : placeholder}
    </InputReadOnly></InputTouch> : <Input 
      ref={inputRef_}
      editable={!disabled} selectTextOnFocus={!disabled}
      blurOnSubmit={false}
      autoFocus={autoFocus}
      placeholder={placeholder}
      placeholderTextColor={getPlaceholderColorText()}
      color={value.length > 0 && valueMaskValid(value) !== true ? "#b71c1c" : getColorText()}
      value={value}
      secureTextEntry={password}
      onChangeText={seValue}
      selection={inputSelection}
      onSelectionChange={setSelectionState}
      onFocus={showDialog}
      onPressIn={showDialog}
      onBlur={hideDialog}
      onEndEditing={hideDialog}
    />}
  </InputArea>)
}

const ComponentInput = ({type, ...props})=>{
  type = typeof type === "string" ? type : "text";

  if(["text", "password", "email", "search", "telephone", "cnpj"].includes(type)){
    return <ComponentInputText type={type} {...props}/>;
  }

  return null;
}

const DialogContainer = styled(Modal)`
  flex: 1;
  margin: 0px;
  padding: 0px;
  align-items: center;
  justify-content: flex-start;
`;

const DialogMain = styled.SafeAreaView`
  z-index: 9;
  flex: 1;
  width: 100%;
  height: 100%;
  position: absolute;
  background: rgba(0, 0, 0, .7);
  align-items: flex-end;
  justify-content: center;
  padding: 15px;
`;

const DialogButtonsGroup = styled.SafeAreaView`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 5px 15px 10px 15px;
`;

const DialogButtonClose = styled(Button)`
  border-radius: 10px;
  border-width: 2px;
  padding: 0px 10px;
  margin: 0px;
  justify-content: center;
  align-items: center;
`;

const DialogInput = ({show, ...props})=>{
  const [isModalVisible, setIsModalVisible] = useState(show);
  const [inputProps, setInputProps] = useState({});
  const [inputValue, setInputValue] = useState(["", false]);

  const [inputSelection, setInputSelection] = useState({start: 0, end: 0});

  let inputRef = null;

  dataStorager.deleteListener("__dialogInput");
  dataStorager.addListener("__dialogInput", (a)=>{
    if(a && typeof a.show === "boolean"){
      setIsModalVisible(a.show);
      setInputProps(a.props);
      setInputSelection(a.inputSelection);
      if(inputRef && typeof inputRef.focus === "function"){
        inputRef.focus();
      }
    }
  });

  const onClose = ()=>{
    setIsModalVisible(false);
    let config = dataStorager.get("__dialogInput") || {};
    if(typeof config.onClose === "function"){
      config.onClose();
    }
  };

  const onChangeText = (t, v)=>{
    //setInputValue([t, v]);
    let config = dataStorager.get("__dialogInput") || {};
    if(typeof config.onChangeText === "function"){
      config.onChangeText(t, v);
    }
  };

  const onInputSelection = (selection)=>{
    return;
    let config = dataStorager.get("__dialogInput") || {};
    if(typeof config.onInputSelection === "function"){
      config.onInputSelection(selection);
    }
  };

  return (<DialogContainer 
    isVisible={isModalVisible} 
    onBackButtonPress={()=>onClose()}
    onBackdropPress={()=>onClose()}
  >
    <DialogMain>
      {isModalVisible ? <ComponentInput 
        {...inputProps}
        readOnly={false}
        showInDialog={false}
        autoFocus={true}
        inputRef={el => {inputRef = el;}}
        value={inputValue[0]}
        onChangeText={onChangeText}
        selection={inputSelection}
        onSelectionChange={onInputSelection}
      /> : null}
      <DialogButtonsGroup>
        <DialogButtonClose 
          labelStyle={{fontSize: 17}} 
          color={"#2196F3"}
          mode={"contained"} 
          onPress={()=>onClose()}
        >
          {'Ok'}
        </DialogButtonClose>
      </DialogButtonsGroup>
    </DialogMain>
  </DialogContainer>);
}

export default ({isDialog, ...props})=>{
  if(isDialog){
    return <DialogInput {...props}/>;
  }

  return <ComponentInput showInDialog={true} {...props}/>;
}