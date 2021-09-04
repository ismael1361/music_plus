import FirestoreObject from './FirestoreObject';
import Result from './Result';
import { YoutubeMusic } from '../utils';

import ImageColors from 'react-native-image-colors';

export default class TrackMusic extends FirestoreObject {
  constructor(path, videoId, playlistId, params, title, subtitle, thumbnails, streamings) {
    super(path);
    this.videoId = videoId || '';
    this.playlistId = playlistId || '';
    this.params = params || '';
    this.title = title || '';
    this.subtitle = subtitle || '';
    this.thumbnails = thumbnails || [];
    this.streamings = streamings || [];

    this.colorTheme = {"muted": "#263238", "darkMuted": "#263238", "lightVibrant": "#263238", "vibrant": "#607d8b", "average": "#37474f", "darkVibrant": "#263238", "lightMuted": "#263238", "dominant": "#78909c"};
    this.colorThemeRequired = false;
  }

  getColorTheme(){
    return new Promise((resolve, reject)=>{
      try {
        if(this.colorThemeRequired === true){
          resolve(this.colorTheme);
          return;
        }

        let uri = this.thumbnails[0] && "url" in this.thumbnails[0] ? this.thumbnails[0]["url"] : null;

        if(!uri){
          reject(new Result(-1, "Erro ao adquirir as cores!", null, {}));
          return;
        }

        const colorsKeys = ["muted", "darkMuted", "lightVibrant", "vibrant", "average", "darkVibrant", "lightMuted", "dominant"];

        ImageColors.getColors(uri, {cache: false, key: this.videoId}).then((colors)=>{
          colorsKeys.forEach((k)=>{
            this.colorTheme[k] = colors[k] || this.colorTheme[k];
          });

          this.colorThemeRequired = true;
          resolve(this.colorTheme);
        }).catch(reject);
      } catch (error) {
        reject(new Result(-1, "Erro ao adquirir as cores!", null, {}));
      }
    });
  }

  getColorThemeArray(){
    return new Promise(async (resolve, reject)=>{
      try {
        await this.getColorTheme();

        let colors = ["muted", "darkMuted", "lightVibrant", "vibrant", "average", "darkVibrant", "lightMuted", "dominant"].map((k)=>{
          return (this.colorTheme[k] || "#212121");
        });

        colors.sort();
        resolve(colors);
      } catch (error) {
        reject(new Result(-1, error.message, null, {}));
      }
    });
  }

  getStreamings(){
    return new Promise((resolve, reject)=>{
      try {
        if(Array.isArray(this.streamings) && this.streamings.length > 0){
          resolve(this.streamings);
          return;
        }

        YoutubeMusic.getStreaming(this.videoId).then((result)=>{
          this.streamings = Array.isArray(result) ? result : [result];
          resolve(this.streamings);
        }).catch(reject);
      } catch (error) {
        reject(new Result(-1, "Erro ao adquirir streamings!", null, {}));
      }
    });
  }
}