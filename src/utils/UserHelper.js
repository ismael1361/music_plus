import * as firebase from 'firebase';

import { Result, User } from '../Models';

import MultiStorager from "./MultiStorager";

export default class UserHelper{
  static getUser() {
    return new Promise(async (resolve, reject) => {
      let user = MultiStorager.DataStorager.get("user");

      if(user instanceof User){
        resolve(user);
        return;
      }

      user = MultiStorager.DataStorager.get("userId");
      const currentUser = firebase.auth().currentUser;
      let uid = user ? user : currentUser ? currentUser.uid : null;

      if(typeof uid === "string"){
        uid = uid.split("/").pop();

        const ref = await firebase.database().ref("Users").once('value');

        if (ref.hasChild(uid)) {
          let snap = await firebase.database().ref('Users').child(uid).once('value').catch((err) => {
            console.log("Error");
            reject(new Result(-1, 'Erro na tentativa de buscar o usuário!', null, {}));
          });

          if (snap) {
            let usuario = new User().parse(snap.ref.path.toString(), snap.val());
            MultiStorager.DataStorager.set("userId", usuario.path, true);
            resolve(usuario);
            return;
          } else {
            console.log(uid);
            reject(new Result(-1, 'Erro na tentativa de buscar o usuário!', null, {}));
            return;
          }
        } else {
          firebase.auth().onAuthStateChanged(async (user) => {
            uid = user.uid.split("/").pop();

            if (ref.hasChild(uid) && user) {
              let snap = await firebase.database().ref('Users').child(uid).once('value').catch((err) => {
                console.log(err);
              });

              if (snap) {
                let usuario = new User().parse(
                  snap.ref.path.toString(),
                  snap.val()
                );
                MultiStorager.DataStorager.set("userId", usuario.path, true);
                resolve(usuario);
                return;
              }
            }
          });
        }
      }

      await this.signOut().catch(err=>{
        console.log(err);
      });

      reject(new Result(-1, 'Erro na tentativa de buscar o usuário!', null, {}));
    });
  }

  static signUp(props){
    return new Promise(async (resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(props.email, props.password).then(userRec=>{
        let uid = userRec.user.uid;
        let user = new User(uid, props.name, props.email, "", new Date().getTime(), new Date().getTime());

        firebase.database().ref("Users").child(uid).set(user.toJson()).then(async ()=>{
            await this.signOut().catch(err=>{
              console.log(err);
            });
            resolve(user);
        }).catch(err=>{
          reject(new Result(-1, "Erro ao salvar dados do usuário.", err));
        })
      }).catch(err=>{
        reject(new Result(-1, "Erro ao criar usuário.", err));
      })
    });
  }

  static signIn(props){
    return new Promise(async (resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(props.email, props.password).then(async (result)=>{
        this.getUser().then(resolve).catch(()=>{
          this.logout();
        });
			}).catch((err)=>{
				let errMss = "E-mail ou senha incorretos!";
				if(err.code.search("invalid-email") >= 0){
				  errMss = "E-mail incorreto, tente novamente!";
				}else if(err.code.search("wrong-password") >= 0){
				  errMss = "Senha incorreta, tente novamente!";
				}else if(err.code.search("user-disabled") >= 0){
				  errMss = "Esse e-mail se encontra desativado!";
				}else if(err.code.search("user-not-found") >= 0){
				  errMss = "Esse e-mail não existe, tente novamente!";
				}
	        reject(new Result(-1, errMss, null, {email: props.email, senha: props.password}));
			});
    });
  }

  static signOut(){
    return new Promise(async (resolve, reject) => {
      MultiStorager.DataStorager.delete("userId");
      MultiStorager.DataStorager.delete("user");
      await firebase.auth().signOut().catch(err=>{
        console.log(err);
      });
      resolve();
    });
  }
}
