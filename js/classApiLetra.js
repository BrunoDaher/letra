

//const url = 
export default class apiLetra {

    constructor(){
      //api livre de apiKey
    }

    getArtMusic(art,mus){       


        //devido a falha do vagalume
        let path = `https://api.lyrics.ovh/v1/${encodeURIComponent(art)}/${encodeURIComponent(mus)}`;
        
        return path;  

            //let path = `${urlApi}/search.php?${this.apiKey}&art=${art}&mus=${mus}`;
        //console.log(path);
        //return path;
    }

    


 }

