import Aux from "./aux/classAux.js";

class User extends Aux{

    #minhasListas = {};
    #meusArtistas= {};
    #meusAlbuns = {};
    #imgs=[];
    
    constructor(){
        super();
        this.usuario = 'brunelson';
        this.init();
    }

    init(){
        this.#minhasListas = this.getUserLists();
        this.#meusArtistas = JSON.parse(localStorage.getItem(`artistas`)) || {};
        this.#meusAlbuns = JSON.parse(localStorage.getItem('albuns')) || {};
        this.#imgs = [];
    }

    getLocalArts(){
        return JSON.parse(localStorage.getItem(`artistas`)) || {};
    }

    getAlbuns(){
        return this.isEmpty(this.#meusAlbuns) ? false : (this.#meusAlbuns);
    }

    getUser(){
        return this.usuario;
    }

    getSetlist(){
        return JSON.parse(sessionStorage.getItem('setlist')) || {};
    }

    getArts(){
        return this.isEmpty(this.#meusArtistas) ? false : (this.#meusArtistas);
    }

    getUserLists(){
        //itera objeto do localStorage
        //cria um array com as listas do usuario
        return JSON.parse(localStorage.getItem(`${this.usuario}_listas`)) || {};
    }

    getFaixa(id){
        return this.getSetlist()[id];
    }

    getImgs(){
        return this.#imgs;
    }
  
    chavePadrao(artName,trackName){
      let chave = `l${artName}${trackName}`;
       chave = chave.replace(/\s/g, '');
       return chave;
    }

    updateArtList(collection){
        this.#meusArtistas[collection.name] = Object.fromEntries(collection);
        localStorage.setItem('artistas', JSON.stringify(this.#meusArtistas));
    }

    updateImgArt(artName,url){
        this.#imgs[artName] = url;
    }

    updateList(song){
        
        console.log(song)
        
            let lista = this.getSetlist();

            let id = this.chavePadrao(song.artistName, song.trackName);

            lista[id] = song;

            this.#minhasListas[this.usuario] = lista;


            sessionStorage.setItem('setlist',JSON.stringify(lista));

    } 

    updateLocalAlbum(resultado) {
        const art = resultado.artist;
        const alb = resultado.name;

        // Normalização garantindo que tracks seja sempre um array
        const tracksRaw = resultado.tracks.track;
        const faixas = Array.isArray(tracksRaw) ? tracksRaw : [tracksRaw];

        if (!this.#meusAlbuns[art]) {
            this.#meusAlbuns[art] = {};
        }

        // Armazena o objeto completo do álbum com as faixas normalizadas
        this.#meusAlbuns[art][alb] = {
            ...resultado,
            tracks: { track: faixas }
        };

        localStorage.setItem('albuns', JSON.stringify(this.#meusAlbuns));
    }

 

  
    
}

export default User;