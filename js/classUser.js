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

    getListas(){
        return this.#minhasListas;
    }

    async criaNovaLista(_nome){
       // 1. Cria uma nova cópia ou adiciona diretamente ao array existente
        this.#minhasListas.push({ nome: _nome });

        // 2. Converte para JSON de forma segura
        const listasString = JSON.stringify(this.#minhasListas);

        // 3. Salva no localStorage (não precisa limpar antes com '', basta sobrescrever)
        
        setTimeout(
            ()=>{ localStorage.setItem('listas', listasString); },400
        )
        

    }

    getSetlist(){
        //trazer setlist dentro da lista corrente
        return JSON.parse(sessionStorage.getItem('setlist')) || {};
    }

    getArts(){
        return this.isEmpty(this.#meusArtistas) ? false : (this.#meusArtistas);
    }

    getUserLists(){
        console.log('retrieving lists')
        //itera objeto do localStorage
        //cria um array com as listas do usuario
        
        return JSON.parse(localStorage.getItem(`listas`)) || [];
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
        
            let lista = this.getSetlist();
            let id = this.chavePadrao(song.artistName, song.trackName);

            lista[id] = song;

            this.#minhasListas[this.usuario] = lista;

            //em vez de setlist, salvar na listaCorrente
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