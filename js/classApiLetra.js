

import webFinder from "./classWebfinder.js";

//const url = 
export default class apiLetra {

    constructor(){
      //api livre de apiKey
        this.audb   = 'c2acfd5d40d1d1870ad0d45f9b8cfc71';

        this.webFinder = new webFinder();
      
    }

     getArtMusicAlt(art,mus){
        

        art = encodeURIComponent(art);
        mus = encodeURIComponent(mus);

        const url = `https://www.vagalume.com.br/${art}/${mus}.html`
        //  const resultado = document.getElementById('resultado');
         
        return this.webFinder.getText(url)
    }

    getArtMusic(art,mus){       


        art = encodeURIComponent(art);
        mus = encodeURIComponent(mus);
        
        //let path = `https://private-amnesiac-d3d77b-lyricsovh.apiary-proxy.com/v1/${art}/${mus}`;
        //devido a falha do vagalume
        let path = `https://api.lyrics.ovh/v1/${encodeURIComponent(art)}/${encodeURIComponent(mus)}`;
        
        return path;  
            //let path = `${urlApi}/search.php?${this.apiKey}&art=${art}&mus=${mus}`;
        //console.log(path);
        //return path;
    }

    


 }

