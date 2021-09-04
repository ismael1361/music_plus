import FirestoreObject from './FirestoreObject';

export default class User extends FirestoreObject {
  constructor(path, nome, email, telefone, dataCriacao, dataModificacao) {
    super(path);
    this.nome = nome || '';
    this.email = email || '';
    this.telefone = telefone || '';
    this.dataCriacao = dataCriacao || new Date().getTime();
    this.dataModificacao = dataModificacao || new Date().getTime();
  }
}
