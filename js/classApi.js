import ApiLastFM from "./classApiLastFM.js";
import ApiVagalume from "./classApiVagalume.js";

const apiLastFM = new ApiLastFM();
const apiVagalume = new ApiVagalume();

//const url = 
export class Api {

    //toDo
    
    constructor(){
        this.apiKey = 'apiKey=660a4395f992ff67786584e238f501aa'; // Vagalume
    }

    //api last//
    getTracks(art,album){
      return apiLastFM.getTracks(art,album);
    }

     //api lastFM
    getAlbum(art,alb){
       return apiLastFM.getAlbum(art,alb);
    }
    
     //vagalume
    getArtMusic(art,mus){       

       // console.log(art)
        art = this.normalizeInput(art);
        mus = this.normalizeInput(mus);
        mus = mus.replace('-live','');
     
        return apiVagalume.getArtMusic(art,mus);
    }

    getMusLocal(busca){
        let mus = this.dao.getSessionJSON('artist').lyrics.item;   
        let slim = [];
        
        mus.forEach(function (element) {                                                
            if(element.desc.toLowerCase().startsWith(busca.toLowerCase()))
            {                                
                slim.push(element);                
            }
        });        
        return slim;        
    }

    //lastFM
    searchTrack(string){
        string = string.replaceAll('-',' '); 

        return  apiVagalume.searchTrack(string);  
    }

    //aux
    checkUrl(string) {
            
             let img = new Image();
             img.src = string;
        
             return img.height > 0? true:false;
    }

    //vagalume
    getFoto(band){
        band = this.normalizeInput(band);
        return apiVagalume.getFoto(band);
    }

    //vagalume
    getCurrentFoto(){
       //console.log(this.dao.getSessionJSON('artist').pic_small)
        return  apiVagalume.getCurrentFoto();
    }

    //vagalume
    getMusicById(musId){          
        return apiVagalume.getMusicById(musId);
     }
    
     //vagalume
     getArt(art){        
        art = this.normalizeInput(art);      
        return apiVagalume.getArt(art);
    }
    //vagalume
    getArtSync(art){        
        art = this.normalizeInput(art);      
        return apiVagalume.getArtSync(art);
    }
  
    //vagalume
        getArtInfo(art){                
        art = this.normalizeInput(art);
        art = art.replaceAll('.','-');
        art = art.replace('-/','/');

        return apiLastFM.getArtInfo(art);       
    }
    
   //aux
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

    //aux
    fetchApi(path){            
        fetch(path)
        .then( function(response)   {        
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
        });
    }

 }

export default Api;