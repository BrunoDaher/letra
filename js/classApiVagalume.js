const urlApi =  "https://api.vagalume.com.br";
const urlHttp =  "https://www.vagalume.com.br";

//const url = 
export class apiVagalume {

    constructor(){
        this.apiKey = 'apiKey=660a4395f992ff67786584e238f501aa'; // Vagalume
    }

    getArtMusic(art,mus){       
        let path = `${urlApi}/search.php?${this.apiKey}&art=${art}&mus=${mus}`;
        return path;
    }

    searchTrack(string){
        let path = `${urlApi}/search.excerpt?apikey=${this.apiKey}&q=${string}`;
        return path;  
    }
 
    getFoto(band){
        return `${url}/${band}/images/profile.jpg`
    }

    getMusicById(musId){          
        const path = `${urlApi}/search.php?${this.apiKey}&musid=${musId}&extra=alb`;       
        return path;
    }

     getArt(art){        
        let path = `${urlApi}/search.art?${this.apiKey}&q=${art}%20&limit=10`;
        return path;  
    }

    getArtSync(art){        
        let path = `${urlApi}/search.art?${this.apiKey}&q=${art}%20&limit=10`;      
        return path;  
    }

    getArtInfo(art){                
        let path = `${urlHttp}/${art}/index.js`; 
        path = path.replace('-/','/');
        return path;        
    }


 }

export default apiVagalume;