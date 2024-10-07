const urlApi =  "https://api.vagalume.com.br";
const urlHttp =  "https://www.vagalume.com.br";

//const url = 
export default class apiVagalume {

    constructor(){
        this.apiKey = 'apiKey=154b4603a98cc875d8e46606cd2585ba'; // Vagalume
    }

    getArtMusic(art,mus){       
        let path = `${urlApi}/search.php?${this.apiKey}&art=${art}&mus=${mus}`;
        //console.log(path);
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
        const path = `${urlApi}/search.php?${this.apiKey}&musid=${musId}`;    
       
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

