import MultiStorager from './MultiStorager';

const dataStorager = MultiStorager.DataStorager;

export default class Dialog{
  static show(title, body, onClose){
    let d = dataStorager.get('__dialog') || {};
    let info = d.info || {};
    info = Object.assign(info, {type: "alert", title: title, body: body, onClose: onClose});
    dataStorager.set('__dialog', Object.assign(d, {show: true, info: info}));
  }

  static hidden(){
    let d = dataStorager.get('__dialog') || {};
    dataStorager.set('__dialog', Object.assign(d, {show: false}));
  }

  static error(body, onClose){
    let d = dataStorager.get('__dialog') || {};
    let info = d.info || {};
    info = Object.assign(info, {type: "error", title: "Mensagem de falha:", body: body, onClose: onClose});
    dataStorager.set('__dialog', Object.assign(d, {show: true, info: info}));
  }

  static sucess(body, onClose){
    let d = dataStorager.get('__dialog') || {};
    let info = d.info || {};
    info = Object.assign(info, {type: "sucess", title: "Mensagem:", body: body, onClose: onClose});
    dataStorager.set('__dialog', Object.assign(d, {show: true, info: info}));
  }

  static warning(body, onClose){
    let d = dataStorager.get('__dialog') || {};
    let info = d.info || {};
    info = Object.assign(info, {type: "warning", title: "Mensagem de aviso:", body: body, onClose: onClose});
    dataStorager.set('__dialog', Object.assign(d, {show: true, info: info}));
  }
}