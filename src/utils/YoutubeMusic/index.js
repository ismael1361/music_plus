import MultiStorager from '../MultiStorager';
import axios from 'axios';

const querystring = require('querystring');

const utils = require('./utils');
const parsers = require('./parsers');
const _ = require('lodash');

import { Result } from '../../Models';

import ytdl from "react-native-ytdl";

const dataStorager = MultiStorager.DataStorager;

const axiosMain = axios.default;

const axiosClient = axios.create({
  baseURL: 'https://music.youtube.com/',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.5',
  },
  withCredentials: true
});

export default class YoutubeMusic{
  static getConfig(){
    return new Promise(async (resolve, reject) => {
      let contains = dataStorager.get("containsYoutubeConfig") || false;
      if(contains){
        resolve(dataStorager.get("initialYoutubeConfig"));
        return;
      }

      reject(new Result(-1, 'Erro na tentativa de buscar as configurações necessárias para acessar a API!', null, {}));
    });
  }

  static _createApiRequest(endpointName, inputVariables, inputQuery = {}){
    return new Promise(async (resolve, reject) => {
      const ytcfg = await this.getConfig().catch((err)=>{
        reject(new Result(-1, 'Erro na tentativa de acessar a API!', null, {}));
      });

      if(!ytcfg){return;}

      const headers = Object.assign({
          'x-origin': axiosClient.defaults.baseURL,
          'X-Goog-Visitor-Id': ytcfg.VISITOR_DATA || '',
          'X-YouTube-Client-Name': ytcfg.INNERTUBE_CONTEXT_CLIENT_NAME,
          'X-YouTube-Client-Version': ytcfg.INNERTUBE_CLIENT_VERSION,
          'X-YouTube-Device': ytcfg.DEVICE,
          'X-YouTube-Page-CL': ytcfg.PAGE_CL,
          'X-YouTube-Page-Label': ytcfg.PAGE_BUILD_LABEL,
          'X-YouTube-Utc-Offset': String(new Date().getTimezoneOffset()*(-1))
      }, axiosClient.defaults.headers);

      axiosClient.post(`youtubei/${ytcfg.INNERTUBE_API_VERSION}/${endpointName}?${querystring.stringify(Object.assign({alt:'json',key:ytcfg.INNERTUBE_API_KEY}, inputQuery))}`, Object.assign(inputVariables, utils.createApiContext(ytcfg)), {
        responseType: 'json',
        headers: headers
      }).then(res => {
        if(res.data.hasOwnProperty('responseContext')) {
          resolve(res.data);
          return;
        }

        reject(new Result(-1, 'Erro na tentativa de acessar a API!', null, {}));
      }).catch(err => {
        reject(new Result(-1, 'Erro na tentativa de acessar a API!', null, {}));
      })
    });
  }

  static getToHome(){
    return new Promise((resolve, reject) => {
      this._createApiRequest('browse', {"browse_id": "FEmusic_explore"}).then(content => {
        try{
          let data = parsers.parseExplorePage(content);
          dataStorager.set("DataToHome", data, true);
          resolve(data);
        }catch(error){
          reject(new Result(-1, 'Erro na tentativa de acessar a API!', null, {}));
        }
      }).catch(error => reject(new Result(-1, 'Erro na tentativa de acessar a API!', null, {})))
    })
  }

  static getSearchSuggestions(query){
    return new Promise((resolve, reject) => {
      this._createApiRequest('music/get_search_suggestions', {input: query}).then(content => {
        try{
          resolve(utils.fv(content, 'searchSuggestionRenderer:navigationEndpoint:query'));
        }catch(error){
          reject(new Result(-1, 'Erro ao pesquisar sugestões!', null, {}));
        }
      }).catch(error => reject(new Result(-1, 'Erro ao pesquisar sugestões!', null, {})))
    })
  }

  static search(query, categoryName, _pageLimit = 1) {
    return new Promise((resolve, reject) => {
      let result = {};
      this._createApiRequest('search', {query: query, params: utils.getCategoryURI(categoryName)}).then(context => {
        //console.log(context);
        try{
          switch (String(categoryName).toUpperCase()) {
            case 'SONG':
              result = parsers.parseSongSearchResult(context);
              break;
            case 'VIDEO':
              result = parsers.parseVideoSearchResult(context);
              break;
            case 'ALBUM':
              result = parsers.parseAlbumSearchResult(context);
              break;
            case 'ARTIST':
              result = parsers.parseArtistSearchResult(context);
              break;
            case 'PLAYLIST':
              result = parsers.parsePlaylistSearchResult(context);
              break;
            default:
              result = parsers.parseSearchResult(context);
              break;
          }
          resolve(result)
        }catch(error) {
          return reject(new Result(-1, error.message, null, {}));
        }
      }).catch(error => reject(new Result(-1, 'Erro ao pesquisar!', null, {})))
    })
  }

  static getAllPlaylistId(browseId){
    return new Promise((resolve, reject) => {
      if(_.startsWith(browseId, 'MPREb')) {
        this._createApiRequest('browse', utils.buildEndpointContext('ALBUM', browseId)).then(context => {
          try {
            let result = utils.fv(context, 'playlistId');

            if(result instanceof Array){
              result = result.filter(function(item, pos, self){
                return self.indexOf(item) == pos && item.length > 20 && _.startsWith(item, 'OLAK5uy_');
              });
            }else{
              result = [];
            }

            resolve(result);
          } catch (error) {
            return reject(new Result(-1, error.message, null, {}));
          }
        }).catch(error => reject(new Result(-1, 'Erro ao adquirir a playlist id!', null, {})));
      } else {
        reject(new Result(-1, 'Erro ao adquirir a playlist id!', null, {}));
      }
    })
  }

  static getPlaylistById(playlistId){
    return new Promise((resolve, reject)=>{
      if(_.startsWith(playlistId, 'OLAK5uy_')) {
        this._createApiRequest('next', {
          enablePersistentPlaylistPanel: true,
          isAudioOnly: true,
          playlistId: playlistId,
          tunerSettingValue: "AUTOMIX_SETTING_NORMAL"
        }).then(context => {
          try {
            let list = utils.fv(context, 'playlistPanelVideoRenderer');
            list = Array.isArray(list) ? list : [list];

            list = list.map((l, i)=>{
              return {
                index: i,
                selected: (i === 0),
                videoId: _.nth(_.at(l, 'videoId'), 0),
                title: utils.fv(_.at(l, 'title'), 'runs:text'),
                subtitle: _.join(_.dropRight(utils.fv(_.at(l, 'longBylineText'), 'text'), 2), ''),
                thumbnails: utils.fv(l, 'thumbnail:thumbnails'),
                playlistId: _.nth(
                  _.at(l, 'navigationEndpoint.watchEndpoint.playlistId'),
                  0
                ),
                params: _.nth(_.at(l, 'navigationEndpoint.watchEndpoint.params'), 0),
              }
            });

            resolve(list);
          } catch (error) {
            reject(new Result(-1, error.message, null, {}));
          }
        }).catch(error => reject(new Result(-1, error.message, null, {})));
      } else {
        reject(new Result(-1, 'Erro ao adquirir a playlist!', null, {}));
      }
    });
  }

  static getAlbum(browseId){
    return new Promise((resolve, reject) => {
      if(_.startsWith(browseId, 'MPREb')) {
          this._createApiRequest('browse', utils.buildEndpointContext('ALBUM', browseId)).then(context => {
            try {
              //console.log(JSON.stringify(context.contents, null, 2));
              const result = parsers.parseAlbumPage(context);
              resolve(result);
            } catch (error) {
              return reject(new Result(-1, error.message, null, {}));
            }
          }).catch(error => reject(new Result(-1, 'Erro ao adquirir o Album!', null, {})));
      } else {
        reject(new Result(-1, 'Erro ao adquirir o Album!', null, {}));
      }
    });
  }


  static getPlaylist(browseId, contentLimit = 100) {
    return new Promise((resolve, reject) => {
      if (_.startsWith(browseId, 'VL') || _.startsWith(browseId, 'PL')) {
        _.startsWith(browseId, 'PL') && (browseId = 'VL' + browseId);

        this._createApiRequest('browse', utils.buildEndpointContext('PLAYLIST', browseId)).then(context => {
          try {
            let result = parsers.parsePlaylistPage(context);
            const getContinuations = params => {
              this._createApiRequest('browse', {}, {
                ctoken: params.continuation,
                continuation: params.continuation,
                itct: params.continuation.clickTrackingParams
              }).then(context => {
                const continuationResult = parsers.parsePlaylistPage(context);
                if (Array.isArray(continuationResult.content)) {
                  result.content = _.concat(result.content, continuationResult.content);
                  result.continuation = continuationResult.continuation;
                }
                if (!Array.isArray(continuationResult.continuation) && result.continuation instanceof Object) {
                  if (contentLimit > result.content.length) {
                    getContinuations(continuationResult.continuation);
                  } else {
                    return resolve(result);
                  }
                } else {
                  return resolve(result);
                }
              })
            }

            if (contentLimit > result.content.length && (!Array.isArray(result.continuation) && result.continuation instanceof Object)) {
              getContinuations(result.continuation);
            } else {
              return resolve(result);
            }
          } catch (error) {
            return reject(new Result(-1, error.message, null, {}));
          }
        }).catch(error => reject(new Result(-1, error.message, null, {})));
      } else {
        reject(new Result(-1, 'Erro ao adquirir a playlist!', null, {}));
      }
    });
  }

  static getArtist(browseId) {
    return new Promise((resolve, reject) => {
      if (_.startsWith(browseId, 'UC')) {
        this._createApiRequest('browse', utils.buildEndpointContext('ARTIST', browseId)).then(context => {
          try {
            const result = parsers.parseArtistPage(context);
            resolve(result);
          } catch (error) {
            reject(new Result(-1, error.message, null, {}));
          }
        }).catch(error => reject(new Result(-1, error.message, null, {})));
      } else {
        reject(new Result(-1, 'Erro ao adquirir o artista!', null, {}));
      }
    });
  }

  static getAutomixPlaylist(videoId, playlistId){
    return new Promise((resolve, reject) => {
      this._createApiRequest('next', {
        enablePersistentPlaylistPanel: true,
        isAudioOnly: true,
        playlistId: playlistId,
        tunerSettingValue: "AUTOMIX_SETTING_NORMAL",
        videoId: videoId
      }).then(context => {
        try {
          const result = parsers.parseAutomixPlaylist(context);
          resolve(result);
        } catch (error) {
          reject(new Result(-1, error.message, null, {}));
        }
      }).catch(error => reject(new Result(-1, error.message, null, {})));
    })
  }

  static getNext(videoId, playlistId, paramString) {
    return new Promise((resolve, reject) => {
      this.getAutomixPlaylist(videoId, playlistId).then(context => {
        try {
          let { playlistId, params } = context;
          this._createApiRequest('next', {
            enablePersistentPlaylistPanel: true,
            isAudioOnly: true,
            params: params,
            playlistId: playlistId,
            tunerSettingValue: "AUTOMIX_SETTING_NORMAL"
          }).then(context => {
            try {
              const result = parsers.parseNextPanel(context);
              resolve(result);
            } catch (error) {
              reject(new Result(-1, error.message, null, {}));
            }
          }).catch(error => reject(new Result(-1, error.message, null, {})));
        } catch (error) {
          reject(new Result(-1, error.message, null, {}));
        }
      }).catch(error => reject(new Result(-1, error.message, null, {})));
    })
  }

  static getStreaming(videoId){
    return new Promise((resolve, reject) => {
      try {
        ytdl('https://music.youtube.com/watch?v='+videoId, { quality: 'highestaudio' })
        .then(resolve)
        .catch(error => reject(new Result(-1, error.message, null, {})));
      } catch (error) {
        reject(new Result(-1, "Erro ao adquirir streaming de áudio!", null, {}));
      }
    })
  }
}