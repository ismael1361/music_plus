//import AsyncStorage from '@react-native-async-storage/async-storage';
import AsyncStorage from '@react-native-community/async-storage';

//import { AsyncStorage } from 'react-native';
import { Result } from '../Models';

const isJson = (str) => {
  try {
    if (typeof str === 'object') {
      JSON.parse(JSON.stringify(str));
    } else if (typeof str === 'string') {
      JSON.parse(str);
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
  return true;
};

const getItemAsyncStorage = async (key)=>{
  try {
    await AsyncStorage.flushGetRequests();
    const value = await AsyncStorage.getItem('@MultiStoragerDataStorager:'+key);
    let v = JSON.parse(value);
    return v["value"];
  } catch (error) {
    return undefined;
  }
}

const setItemAsyncStorage = async (key, data)=>{
  return await AsyncStorage.setItem('@MultiStoragerDataStorager:'+key, JSON.stringify({"key": key, "value": data, "date": (new Date().toISOString())}));
}

const removeItemAsyncStorage = async (key)=>{
  try {
    await AsyncStorage.removeItem('@MultiStoragerDataStorager:'+key)
    return true;
  } catch (error) {
    return undefined;
  }
}

const eraseAllAsyncStorage = async ()=>{
  try {
    let keys = await  AsyncStorage.getAllKeys();
    for (let key of keys) {
      if(key.search("@MultiStoragerDataStorager:") === 0){
        await AsyncStorage.removeItem(key);
      }
    }
  } catch (error) {
    return undefined;
  }
}

class DataStorager {
  constructor() {
    this.data = {};
    this.listeners = {};
  }
  get(key) {
    if(key in this.data){
      return this.data[key];
    }
  }
  set(key, data, isAsyncStorage) {
    let isIguals = false;

    let value = key in this.data ? this.data[key] : null;

    if (value !== null && isNaN(value) !== true) {
      if (
        data === value ||
        (isJson(data) &&
          isJson(value) &&
          JSON.stringify(data) === JSON.stringify(value))
      ) {
        isIguals = true;
      } else if (
        isJson(data) === false &&
        typeof data.toString === 'function' &&
        typeof value.toString === 'function'
      ) {
        isIguals = data.toString() === value.toString();
      }
    }

    if(isAsyncStorage === true){
      setItemAsyncStorage(key, data);
    }

    this.data[key] = data;

    if (this.listeners[key]) {
      for (let i = 0; i < this.listeners[key].length; i++) {
        if (typeof this.listeners[key][i] === 'function') {
          this.listeners[key][i](data);
        }
      }
    }
  }
  hasKey(key) {
    return Object.keys(this.data).includes(key);
  }
  delete(key) {
    removeItemAsyncStorage(key);
    delete this.data[key];
    if (this.listeners[key]) {
      for (let i = 0; i < this.listeners[key].length; i++) {
        if (typeof this.listeners[key][i] === 'function') {
          this.listeners[key][i](undefined);
        }
      }
    }
  }
  eraseAll() {
    eraseAllAsyncStorage();
    this.data = {};
    for (let key in this.listeners) {
      for (let i = 0; i < this.listeners[key].length; i++) {
        if (typeof this.listeners[key][i] === 'function') {
          this.listeners[key][i](undefined);
        }
      }
    }
  }
  /**
   *
   * @param {string} key
   * @param {function(any)} callback
   */
  addListener(key, callback) {
    if (!callback || typeof callback !== 'function') return;
    if (!this.listeners[key]) this.listeners[key] = [];
    let indexFunction = null;
    this.listeners[key].forEach((f, i) => {
      if (callback === f) {
        indexFunction = i;
        this.listeners[key][i] = callback;
      }
    });
    if (indexFunction !== null) return indexFunction;
    indexFunction = this.listeners[key].length;
    this.listeners[key].push(callback);
    return indexFunction;
  }

  deleteListener(key, callback) {
    if (!(key && key in this.listeners)) {
      return;
    }

    if (typeof callback === 'function') {
      this.listeners[key].forEach((f, i) => {
        if (f === callback) {
          delete this.listeners[key][i];
        }
      });
    } else if (
      typeof callback === 'number' &&
      callback >= 0 &&
      callback < this.listeners[key].length
    ) {
      delete this.listeners[key][callback];
    } else {
      delete this.listeners[key];
    }
  }

  deleteListeners() {
    for (let k in this.listeners) {
      delete this.listeners[k];
    }
  }
}

class MultiStorager {
  constructor() {
    this.DataStorager = new DataStorager();
  }

  restore(){
    return new Promise(async (resolve, reject)=>{
      try {
        let keys = await AsyncStorage.getAllKeys();
        keys = keys.filter((k)=>{
          return k.search("@MultiStoragerDataStorager:") === 0
        });

        AsyncStorage.multiGet(keys, (err, stores) => {
          if(stores){
            stores.forEach((result, i, store) => {
              let key = (store[i][0] || "").replace("@MultiStoragerDataStorager:", "");
              let value = JSON.parse(store[i][1]);
              this.DataStorager.set(key, value["value"]);
            });
          }

          resolve(this.DataStorager);
        });
      } catch (error) {
        reject(new Result(-1, 'Algo deu errado ao recuperar os dados!', null, {}));
      }
    });
  }

  getDataStorager(key) {
    key = typeof key === 'string' ? 'DataStorager_key_' + key : null;
    if (!key) {
      return;
    }
    if (!this[key]) {
      this[key] = new DataStorager();
    }
    return this[key];
  }
}

const multiStorager = new MultiStorager();
export default multiStorager;
