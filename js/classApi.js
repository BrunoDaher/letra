const url =  "https://api.vagalume.com.br";
//const url = 
export class Api {

    constructor(){
        this.apiKey = 'apiKey=660a4395f992ff67786584e238f501aa';
   
        //this.apiKey = '2651bc07e2240e60ef358c833cc84169';
      //  this.dao = _dao;
    }

    getTracks(art,album){
       art = art.replaceAll('-',' '); 
       album =  album.replaceAll('-',' ');
       
       let path = `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=2651bc07e2240e60ef358c833cc84169&artist=${art}&album=${album}&format=json`;

       return fetch(path);  
    }

    //last fm
    getAlmbum(art,alb){

        art = art.replaceAll('-','%20'); 

        //album =  album.replaceAll('-',' ');
        let path = `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=2651bc07e2240e60ef358c833cc84169&artist=${art}&album=${alb}&format=json`;
 
        path = path.replaceAll('-','%20');
 
        return fetch(path);  
     }
     
    
     //vagalume
    getArtMusic(art,mus){       
        art = this.normalizeInput(art);
        mus = this.normalizeInput(mus);
        mus = mus.replace('-live','');
        let path = `${url}/search.php?${this.apiKey}&art=${art}&mus=${mus}`;
     
        return fetch(path);
    }


    getMusLocal(busca){
        let mus = this.dao.getSessionJSON('artist').lyrics.item;   
        let slim = [];
        
        mus.forEach(element => {                                                
            if(element.desc.toLowerCase().startsWith(busca.toLowerCase()))
            {                                
                slim.push(element);                
            }
        });        
        return slim;        
    }

    //vagalume
    searchTrack(string){
         string = string.replaceAll('-',' '); 
        let path = `https://api.vagalume.com.br/search.excerpt?apikey=${this.apiKey}&q=${string}`;
 
         //console.log(path)
 
        return fetch(path);  
    }

    checkUrl(string) {
            
             let img = new Image();
             img.src = string;
        
             return img.height > 0? true:false;
    }

    getFoto(band){
        band = this.normalizeInput(band);
     //   console.log(`${url}/${band}/images/profile.jpg`);
        return `${url}/${band}/images/profile.jpg`
    }

   getCurrentFoto(){
       //console.log(this.dao.getSessionJSON('artist').pic_small)
        return  `${url}${this.dao.getSessionJSON('artist').pic_small}`;
    }
  
    getMusicById(musId){          
        const path = `${url}/search.php?${this.apiKey}&musid=${musId}&extra=alb`;       
        return fetch(path);
     }
    
     getArt(art){        
        art = this.normalizeInput(art);      
        let path = `${url}/search.art?${this.apiKey}&q=${art}%20&limit=10`;
        return fetch(path);  
    }

    getArtSync(art){        
        art = this.normalizeInput(art);      
        let path = `${url}/search.art?${this.apiKey}&q=${art}%20&limit=10`;      
        return fetch(path);  
    }
    
    normalizeInput(str){
        str = str.toLowerCase();
        str = str.replaceAll(':',''); 
        str = str.replaceAll(' ','-');  
        str = str.replaceAll('/','-');  
        str = str.replaceAll('!','');
        //str = str.replaceAll('.','');
        str = str.replaceAll('--','*');
        str = str.replaceAll('*','');
        str = str.replaceAll('+','');
        str = str.replaceAll(',','');
        str = str.replaceAll('?','');
        str = str.replaceAll("'s",'s');
        str = str.replaceAll("'m",'m');
        str = str.replaceAll("&",'');

        //removeacentos
        str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
       
        return str;
    }

    getArtInfo(art){                
        art = this.normalizeInput(art);
        
        art = art.replaceAll('.','-');
        art = art.replace('-/','/');
        
        let path = `https://www.vagalume.com.br/${art}/index.js`; 
        
        path = path.replace('-/','/');
        
        //console.log(path);          
        return fetch(path);        
    }
 
    fetchApi(path){            
        fetch(path)
        .then( response =>   {        
            return response.ok ? response.text() : false; 
         })
        .then( function response(responseHtml)
            { 
              let key = Object.keys(JSON.parse(responseHtml))[0];              
              let r = JSON.parse(responseHtml)[key];
              key ? sessionStorage.setItem(key,JSON.stringify(r)):"";    
            } )
        .catch(function (e) {       
            return 'erro' ;
            console.log(e);                
        });
    }

 }

export default Api;