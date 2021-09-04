import React, { useState, useEffect } from 'react';
import { Container } from './styles';

import { ContainerScreen } from "../../components";

export default ()=>{

  return <ContainerScreen scroll={true} GeneralStatusBar={{
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    barStyle: "light-content"
  }}></ContainerScreen>
}