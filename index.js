/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import TrackPlayer, { Capability } from 'react-native-track-player';

TrackPlayer.setupPlayer({
    maxBuffer: 50,
    maxCacheSize: 4096,
    waitForBuffer: true
});

TrackPlayer.updateOptions({
    stopWithApp: true,
    capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.JumpForward,
        Capability.JumpBackward
    ],
    compactCapabilities: [
        Capability.Play, 
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious
    ]
});

TrackPlayer.reset();

AppRegistry.registerComponent(appName, () => App);

TrackPlayer.registerPlaybackService(() => require('./service'));