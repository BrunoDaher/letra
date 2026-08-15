//bibliotecas/classes
import Api from "./acesso/classApi.js";
import Tela from "./aux/classTela.js";
import Letra from "./view/viewLetra.js";
import Dao from "./acesso/classDao.js";
import User from "./classUser.js"
import Aux from "./aux/classAux.js"


import viewHeader   from "./view/viewHeader.js";
import viewAlbuns from "./view/viewAlbuns.js"
import viewListas from "./view/viewListas.js"


const api = new Api();

const user = new User();

const header = new viewHeader();
const albuns = new viewAlbuns(api,user);
const listas = new viewListas(user);   
const objLetra = new Letra(user);


const tela = new Tela(new Dao(api));

tela.getSizes();

//service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Ajuste o caminho do service-worker.js conforme onde ele está no projeto
    navigator.serviceWorker
      .register('js/service-worker.js') // caminho absoluto da raiz do site
      .then((registration) => {
        console.log('Service Worker registrado com sucesso:', registration);
      })
      .catch((error) => {
        console.error('Falha ao registrar o Service Worker:', error);
      });
  });
}

  
   