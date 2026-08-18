import Aux from "./aux/classAux.js";

class User extends Aux{

    #minhasListas = [];
    #meusArtistas= {};
    #meusAlbuns = {};
    #imgs=[];
    #listaAtual = '' //default;
    
    constructor(){
        super();
        this.usuario = 'brunelson';
        this.init();
    }

    init(){
        
        //nome apenas
        this.#listaAtual = sessionStorage.getItem('listaAtual') || 'setlist';
        

        if(!localStorage.getItem('listas')){
            let listaNova = this.criaNovaLista('setlist').then(
                res => {
                    console.log(res)
                });
        }
        else{
            this.#minhasListas = JSON.parse(localStorage.getItem('listas'))
        }

        this.#meusArtistas = JSON.parse(localStorage.getItem(`artistas`)) || {};
        this.#meusAlbuns = JSON.parse(localStorage.getItem('albuns')) || {};
        this.#imgs = [];
    }

    updateListName(nome){
        this.#listaAtual = nome;
        sessionStorage.setItem('listaAtual',nome);
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

    getListaAtual(){
        return this.#listaAtual;
    }

    async criaNovaLista(_nome){

        //0 lista atual
        this.updateListName(_nome);

       // 1. Cria uma nova cópia ou adiciona diretamente ao array existente
        this.#minhasListas.push({ nome: _nome });

        
        // 2. Converte para JSON de forma segura
        const listasString = JSON.stringify(this.#minhasListas);
        // 3. Salva no localStorage (não precisa limpar antes com '', basta sobrescrever)
        setTimeout(
            ()=>{ 
                localStorage.setItem('listas', listasString); 
            },400)
    }

    getSetlist(){
        //trazer setlist dentro da lista corrente
        return JSON.parse(sessionStorage.getItem(this.#listaAtual)) || {};
    }
    
    getArts(){
        return this.isEmpty(this.#meusArtistas) ? false : (this.#meusArtistas);
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

    oldSong(dado){
          let list = this.getSetlist();
            let id = this.chavePadrao(dado.artistName, dado.trackName);

            return list[id] ? true:false;

    }

    updateList(dado){

            let list = this.getSetlist();
            let id = this.chavePadrao(dado.artistName, dado.trackName);

            setTimeout(
                ()=>{
                    list[id] = dado;
                    sessionStorage.setItem(this.#listaAtual,JSON.stringify(list))
                },300
            )
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