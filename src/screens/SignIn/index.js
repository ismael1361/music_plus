import React, { useState, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';

import { View } from 'react-native';

import { ContainerScreen, InputCustom } from "../../components";

import { Dialog, UserHelper } from "../../utils";

import { mdiAccountDetails, mdiAccountCircle, mdiAccount, mdiLock } from '@mdi/js';

import { Scroll, Container, Logo, ButtonMain, ContainerButtons } from './styles';

export default () => {
  const navigation = useNavigation();
  const [ keyboardHeight, setKeyboardHeight ] = useState(0);
  
  const [isSignIn, setIsSignIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(["", false]);
  const [email, setEmail] = useState(["", false]);
  const [password, setPassword] = useState(["", false]);
  const [secondPassword, setSecondPassword] = useState(["", false]);

  const cancel = ()=>{
    setLoading(false);
    setIsSignIn(true);
  }

  const signIn = ()=>{
    if(loading){return;}

    if([email[0], password[0]].every(a => a != "") !== true){
      Dialog.warning("Preencha todos os campos!");
      return;
    }else if([email[1], password[1]].every(Boolean) !== true){
      let mss = "";
      if(email[1] !== true){
        mss = "E-mail incorreto!";
      }else if(password[1] !== true){
        mss = "Senha inválida, é preciso de no mínimo 8 (oito) caracteres!";
      }
      Dialog.warning(mss);
      return;
    }

    setLoading(true);
    UserHelper.signIn({email: email[0], password: password[0]}).then((user)=>{
      setLoading(false);
      navigation.reset({
        routes: [{name:'MainTab'}]
      });
      Dialog.sucess("Bem vindo(a) "+(user.nome || "usuário(a)")+"!");
    }).catch((err)=>{
      setLoading(false);
      Dialog.error(err.description);
    });
  }

  const signUp = ()=>{
    if(isSignIn){setIsSignIn(false); return;}
    if(loading){return;}

    if([name[0], email[0], password[0], secondPassword[0]].every(a => a != "") !== true){
      Dialog.warning("Preencha todos os campos!");
      return;
    }else if([name[1], email[1], password[1], secondPassword[1]].every(Boolean) !== true){
      let mss = "";
      if(name[1] !== true){
        mss = "Nome incorreto!";
      }else if(email[1] !== true){
        mss = "E-mail incorreto!";
      }else if(password[1] !== true){
        mss = "Senha inválida, é preciso de no mínimo 8 (oito) caracteres!";
      }else if(password[1] !== true){
        mss = "Segunda senha inválida, verifique-o e tente novamente!";
      }
      Dialog.warning(mss);
      return;
    }else if(password[0] !== secondPassword[0]){
      Dialog.warning("As senhas estão diferentes, verifique-os e tente novamente!");
      return;
    }

    setLoading(true);

    UserHelper.signUp({name: name[0], email: email[0], password: password[0]}).then(()=>{
      setLoading(false);
      setIsSignIn(true);
      Dialog.sucess("Conta criada com sucesso ;)");
    }).catch((err)=>{
      setLoading(false);
      Dialog.error(err.description);
    });
  }

  return (<ContainerScreen scroll={true} GeneralStatusBar={{
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    barStyle: "light-content"
  }}>
    <Container>
      {isSignIn ? <Logo viewBox="0 0 24 24"><Path fill="#bdbdbd" d={mdiAccountCircle}/></Logo> : null}

      {isSignIn ? null :
        <InputCustom 
          disabled={loading}
          IconSvg={<Svg viewBox="0 0 24 24" width="30" height="30" fill="#263238"><Path d={mdiAccountDetails}/></Svg>}
          placeholder="Nome"
          maskValidation={[new RegExp("(.){3,}")]}
          value={name[0]}
          onChangeText={(t, v)=>setName([t, v])}
        />
      }
      
      <InputCustom 
        disabled={loading}
        IconSvg={<Svg viewBox="0 0 24 24" width="30" height="30" fill="#263238"><Path d={mdiAccount}/></Svg>}
        placeholder="E-mail" 
        type="email"
        value={email[0]}
        onChangeText={(t, v)=>setEmail([t, v])}
      />

      <InputCustom 
        disabled={loading}
        IconSvg={<Svg viewBox="0 0 24 24" width="30" height="30" fill="#263238"><Path d={mdiLock}/></Svg>}
        placeholder="Senha" 
        type="password"
        value={password[0]}
        onChangeText={(t, v)=>setPassword([t, v])}
      />

      {isSignIn ? null :
        <InputCustom 
          disabled={loading}
          IconSvg={<Svg viewBox="0 0 24 24" width="30" height="30" fill="#263238"><Path d={mdiLock}/></Svg>}
          placeholder="Repita a senha" 
          type="password"
          value={secondPassword[0]}
          onChangeText={(t, v)=>setSecondPassword([t, v])}
        />
      }

      <ContainerButtons>
        {isSignIn ? <ButtonMain labelStyle={{fontSize: 20}} color="#f44336" mode="contained" loading={loading} onPress={signIn}>Entrar</ButtonMain> : null}
        
        {isSignIn || loading ? null : <ButtonMain labelStyle={{fontSize: 16}} color={"#fafafa"} mode={"outlined"} onPress={cancel}>Voltar</ButtonMain>}

        {loading && isSignIn ? null : <ButtonMain labelStyle={{fontSize: 16}} color={isSignIn ? "#fafafa" : "#2196F3"} mode={isSignIn ? "outlined" : "contained"} loading={loading} onPress={signUp}>Cadastar</ButtonMain>}
      </ContainerButtons>
    </Container>
  </ContainerScreen>)
}

