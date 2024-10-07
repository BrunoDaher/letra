export class ApiLastFM {

    constructor(){
        this.apiKey = '2651bc07e2240e60ef358c833cc84169'; // LastFM
    }

    searchArtist(string){
        string = string.replaceAll('-',' '); 
        
        let path = `https://ws.audioscrobbler.com//2.0/?method=artist.search&artist=${string}&api_key=${this.apiKey}&format=json`
        
        console.log(path)
        return path;  
    }

    searchTrack(string){
        string = string.replaceAll('-',' '); 
        string = string.replaceAll("'",''); 
       let path = `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${string}&api_key=${this.apiKey}&limit=7&format=json`
       //console.log(path)
       return path;  
    }

    getTracks(art,album){
       art = art.replaceAll('-',' '); 
       album =  album.replaceAll('-',' ');
       let path = `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${this.apiKey}&artist=${art}&album=${album}&format=json`;
       return path;  
    }

    //nao funciona
    getTrackById(mbid){
       // art = art.replaceAll('-',' '); 
        //album =  album.replaceAll('-',' ');
        let path = ` https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${this.apiKey}&mbid=${mbid}format=json`;
        return path;  
     }
 

    getTrackInfo(art,mus){
         art = art.replaceAll('-',' '); 
         mus =  mus.replaceAll('-',' ');
        let path = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${this.apiKey}&artist=${art}&track=${mus}&format=json`;
        return path;  
     }

    getAlbum(art,alb){
        art = art.replaceAll('-','%20'); 
     
        //console.log(alb)
        let path = `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${this.apiKey}&artist=${art}&${alb.tipo}=${alb.info}&format=json`;
        //path = path.replaceAll('-','%20');
        //usar patch local
        return path;  
     }

     getArtInfo(art){
        art = art.replaceAll('-',' '); 
        let path = `https://ws.audioscrobbler.com//2.0/?method=artist.gettopalbums&artist=${art}&api_key=${this.apiKey}&format=json`;
        return path;  
    }

  
    getMusLocal(busca){
        let mus = this.dao.getSessionJSON('artist').lyrics.item;   
        let slim = [];
        
        mus.forEach(function(element) {                                                
            if(element.desc.toLowerCase().startsWith(busca.toLowerCase()))
            {                                
                slim.push(element);                
            }
        });        
        return slim;        
    }


    getCurrentFoto(){
       //console.log(this.dao.getSessionJSON('artist').pic_small)
        return  `${url}${this.dao.getSessionJSON('artist').pic_small}`;
    }


 }

export default ApiLastFM;