import React, { Component } from "react";
import { StatusBar, Platform, Dimensions, PanResponder, LayoutAnimation, UIManager, StyleSheet, Text, Image, View, ScrollView, TouchableOpacity, Animated } from "react-native";
import styled from 'styled-components/native';

import images from '../assets/swipe_playlist';

import LinearGradient from 'react-native-linear-gradient';

import { Color, Simplify } from '../utils';

const MARGIN_TOP = Platform.OS === "ios" ? 20 : StatusBar.currentHeight;
const DEVICE_HEIGHT = Dimensions.get("screen").height - MARGIN_TOP;

const SCREEN_HEIGHT = Dimensions.get('screen').height;
const WINDOW_HEIGHT = Dimensions.get('window').height;
const NAVBAR_HEIGHT = Math.round(SCREEN_HEIGHT - WINDOW_HEIGHT);

if(Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental){
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default class SwipePlaylist extends Component{
	static defautProps = {
    disablePressToShow: false
  };

  constructor(props){
    super(props);
    this.state = {
      collapsed: true
    };

    this.SWIPE_HEIGHT = props.swipeHeight || 60;
    this.SPACE_TOP_HEIGHT = props.topHeight || 0;
    this._panResponder = null;
		this.top = (DEVICE_HEIGHT-this.SWIPE_HEIGHT);
    this.height = DEVICE_HEIGHT-this.SPACE_TOP_HEIGHT;
    this.backgroundColor = Color(props.backgroundColor || "#263238");

    this.customStyle = {
      style: {
        top: this.top,
        height: this.height,
        backgroundColor: `rgba(${this.backgroundColor.rgb.join(", ")}, 0.0)`
      }
    };
    this.checkCollapsed = true;

    this.showMini = this.showMini.bind(this);
    this.showFull = this.showFull.bind(this);

    this.points = [];
    this.scrollY = 0;
    this.isScrolling = false;
    this.opacity = 0;
  }

  componentWillMount(){
    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => false,
      onMoveShouldSetPanResponderCapture: () => false,
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (e, gestureState) => {
        if(this.checkCollapsed === false){
          return gestureState.moveY < (MARGIN_TOP+this.SPACE_TOP_HEIGHT+50);
        }

        return !(this.isScrolling || (Math.abs(gestureState.dx) < 5 && Math.abs(gestureState.dy) < 5));
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: this._onPanResponderMove.bind(this),
      onPanResponderRelease: this._onPanResponderRelease.bind(this)
    });
  }

  componentDidMount(){
    this.props.hasRef && this.props.hasRef(this);
    this.swipeIconRef && this.swipeIconRef.setState({ icon: images.arrow_up, showIcon: true });
  }

  componentDidUpdate(){
    const { onShowFull, backgroundColor } = this.props;

    this.backgroundColor = Color(backgroundColor || "#263238");
    this.customStyle.style.backgroundColor = `rgba(${this.backgroundColor.rgb.join(", ")}, ${this.opacity})`;

    this.updateNativeProps();
    //this.setState({});
  }

  updateNativeProps(callback, error){
    let animation = null;

    switch (this.props.animation){
      case "linear":
        animation = LayoutAnimation.Presets.linear;
        //LayoutAnimation.linear();
        break;
      case "spring":
        animation = LayoutAnimation.Presets.spring;
        //LayoutAnimation.spring();
        break;
      case "easeInEaseOut":
        animation = LayoutAnimation.Presets.easeInEaseOut;
        //LayoutAnimation.easeInEaseOut();
        break;
      case "none":
        break;
      default:
        animation = LayoutAnimation.Presets.easeInEaseOut;
        //LayoutAnimation.easeInEaseOut();
        break;
    }

    if(!animation){
      callback && callback();
    }else{
      LayoutAnimation.configureNext(animation);
    }

    this.opacity = ((MARGIN_TOP+this.SPACE_TOP_HEIGHT+45) > this.customStyle.style.top) ? 1 : this.opacity;

    this.viewRef && this.viewRef.setNativeProps(this.customStyle);
    this.scrollRef && this.scrollRef.setNativeProps({
      style: {opacity: this.opacity}
    });

    this.linearGradientRef && this.linearGradientRef.setNativeProps({
      style: {opacity: (this.opacity >= 1 ? 1 : 0)},
      colors: [`rgba(${this.backgroundColor.rgb.join(", ")}, 1)`, `rgba(${this.backgroundColor.rgb.join(", ")}, 0.0)`]
    });

    setTimeout(()=>{
      callback && callback();
    }, 300);
  }

  _onPanResponderMove(event, gestureState){
    if(this.isScrolling){return;}
  	this.points.push({x: gestureState.moveX, y: gestureState.moveY});

  	if (gestureState.dy > 0 && !this.checkCollapsed) {
      // SWIPE DOWN

      this.customStyle.style.top = Math.min(DEVICE_HEIGHT - this.SWIPE_HEIGHT, Math.max(this.top + gestureState.dy, MARGIN_TOP+this.SPACE_TOP_HEIGHT));

  		this.swipeIconRef && this.swipeIconRef.setState({ icon: images.minus, showIcon: true });

      //this.scrollRef && this.scrollRef?.setNativeProps({scrollEnabled: false});

      !this.state.collapsed && this.setState({ collapsed: true });
    }else if(this.checkCollapsed && gestureState.dy < -60){
      // SWIPE UP
      this.top = 0;
      this.customStyle.style.top = Math.min(DEVICE_HEIGHT - this.SWIPE_HEIGHT, Math.max(DEVICE_HEIGHT + gestureState.dy, MARGIN_TOP+this.SPACE_TOP_HEIGHT));

      if (this.customStyle.style.top <= DEVICE_HEIGHT / 2) {
        this.swipeIconRef &&
          this.swipeIconRef.setState({
            icon: images.arrow_down,
            showIcon: true
          });
      }else{
      	this.swipeIconRef && this.swipeIconRef.setState({ icon: images.minus, showIcon: true });
      }

      //this.scrollRef && this.scrollRef?.setNativeProps({scrollEnabled: true});

      this.state.collapsed && this.setState({ collapsed: false });
    }

  	this.opacity = Number(Math.max(0, Math.min(
  		((DEVICE_HEIGHT - this.SWIPE_HEIGHT) - this.customStyle.style.top)
  		/((DEVICE_HEIGHT - this.SWIPE_HEIGHT)*0.25)
  		, 1)).toFixed(2));

    this.backgroundColor = Color(this.props.backgroundColor || "#263238");

  	this.customStyle.style.backgroundColor = `rgba(${this.backgroundColor.rgb.join(", ")}, ${this.opacity})`;

    this.updateNativeProps();
  }

  _onPanResponderRelease(event, gestureState){
    if(this.points.length < 2){return;};

  	let s = Simplify(this.points, 4, false),
  			end = s.length-1;

  	this.points = [];

  	if(s[end]?.y > s[end-1]?.y){
	  	this.showMini();
	  }else{
	  	this.showFull();
	  }
  }

  showFull(){
    const { onShowFull, backgroundColor } = this.props;
    this.backgroundColor = Color(backgroundColor || "#263238");
  	this.opacity = 1;
  	this.customStyle.style.backgroundColor = `rgba(${this.backgroundColor.rgb.join(", ")}, 1)`;
    this.customStyle.style.top = MARGIN_TOP+this.SPACE_TOP_HEIGHT;
    this.swipeIconRef && this.swipeIconRef.setState({ icon: images.arrow_down, showIcon: true });

    this.scrollRef && this.scrollRef?.setNativeProps({scrollEnabled: true});
    this.scrollY = 0;
    this.scrollRef && this.scrollRef?.scrollTo({y: 0});

    this.state.collapsed && this.setState({ collapsed: false });
    this.checkCollapsed = false;

    this.updateNativeProps();
    onShowFull && onShowFull();
  }

  showMini(){
    const { onShowMini, backgroundColor } = this.props;
    //this.SWIPE_HEIGHT = 150; //Avoid hiding when swiping down.
    this.backgroundColor = Color(backgroundColor || "#263238");
    this.customStyle.style.top = DEVICE_HEIGHT - this.SWIPE_HEIGHT;
    this.swipeIconRef && this.swipeIconRef.setState({ icon: images.arrow_up, showIcon: true });

    this.scrollRef && this.scrollRef?.setNativeProps({scrollEnabled: false});
    this.scrollY = 0;
    this.scrollRef && this.scrollRef?.scrollTo({y: 0});

    !this.state.collapsed && this.setState({ collapsed: true });
    this.checkCollapsed = true;

    this.updateNativeProps(()=>{
      this.opacity = 0;
      this.customStyle.style.backgroundColor = `rgba(${this.backgroundColor.rgb.join(", ")}, 0)`;
      this.updateNativeProps();
    });

    //setTimeout();

    onShowMini && onShowMini();
  }

  render(){
  	const { itemFull, style, container } = this.props;
    const { collapsed } = this.state;
  	return <View
  		ref={ref => (this.viewRef = ref)}
  		{...this._panResponder.panHandlers}
			style={[
				styles.wrapSwipe,
				style,
				{
	        top: this.top,
	        height: this.height,
        	backgroundColor: `rgba(${this.backgroundColor.rgb.join(", ")}, 0.0)`
	      }
			]}
  	>
  		<TouchableOpacity onPress={()=>{
    			if(collapsed){
    				this.showFull();
    			}else{
    				this.showMini();
    			}
    		}}
        style={{
          height: 40,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
	  		<SwipeIcon
	        hasRef={ref => (this.swipeIconRef = ref)}
	      />
      </TouchableOpacity>
      <Gradient 
        style={{
          opacity: 0
        }}
        ref={ref => (this.linearGradientRef = ref)}
        colors={[`rgba(${this.backgroundColor.rgb.join(", ")}, 1)`, `rgba(${this.backgroundColor.rgb.join(", ")}, 0.0)`]}
        start={{x: 0, y: 0}} end={{x: 0, y: 1}}
      />
      <ScrollView
      	style={[
      		styles.wrapScroll,
      		{
      			opacity: this.opacity
      		}
      	]}
      	ref={ref => (this.scrollRef = ref)}
      	scrollEnabled={!collapsed}
				onScroll={({nativeEvent})=>{
          clearTimeout(this.timeoutScrolling);
					let y = nativeEvent.contentOffset.y;
					this.scrollY = y;
          this.isScrolling = true;
          this.timeoutScrolling = setTimeout(()=>{
            this.isScrolling = false;
          }, 300);
				}}
				contentContainerStyle={{paddingBottom: (NAVBAR_HEIGHT+15)}}
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
      >
      	{container}
      </ScrollView>
      <View style={styles.navbarView}/>
  	</View>
  }
}

class SwipeIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      icon: images.minus,
      showIcon: false
    };
  }
  componentDidMount() {
    this.props.hasRef && this.props.hasRef(this);
  }

  toggleShowHide(val) {
    this.setState({ showIcon: val });
  }

  render() {
    const { style } = this.props;
    const { icon, showIcon } = this.state;
    return (
      <View style={[{ alignItems: 'center', height: 10, marginBottom: 5 }, style]}>
        {showIcon && (
          <Image
            source={icon}
            style={{ width: 35, height: icon === images.minus ? 5 : 10 }}
          />
        )}
      </View>
    );
  }
}

class Gradient extends Component{
  constructor(props) {
    super(props);
    this.state = {...this.props};
  }

  componentDidMount(){
    this.props.hasRef && this.props.hasRef(this);
  }

  setNativeProps(props){
    this.setState({...props});
  }

  render(){
    const {style, colors, start, end} = this.state;

    return <LinearGradient 
      style={[styles.linearGradient, style]}
      colors={colors}
      start={start} end={end}
    />
  }
}

const styles = StyleSheet.create({
  wrapSwipe: {
    padding: 0,
    backgroundColor: "#ccc",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    position: "absolute",
    left: 0,
    right: 0
  },
  wrapScroll: {
  	flex: 1,
    zIndex: 1
  },
  linearGradient: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    height: 20,
    zIndex: 9
  },
  navbarView : {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, .7)",
    bottom: 0,
    left: 0,
    right: 0,
    height: NAVBAR_HEIGHT,
    zIndex: 9
  }
});