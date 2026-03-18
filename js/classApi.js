import ApiLastFM from "./classApiLastFM.js";
import ApiLetra from "./classApiLetra.js";


const apiLastFM = new ApiLastFM();
const apiLetra = new ApiLetra();


//const url = 
export class Api {

    //toDo
    

    //setar apis
    constructor(){
       // this.apiKey = 'apiKey=660a4395f992ff67786584e238f501aa'; // Vagalume

        //console.log(apiMusixMatch)
    }

    //api last//
    getTracks(art,album){
      return apiLastFM.getTracks(art,album);
    }


    //musicxmatch
    getTrackById(id)
    {
        return apiMusicxMatch.getTrackById(id);
    }
     //api lastFM
    getAlbum(art,alb){
       return apiLastFM.getAlbum(art,alb);
    }

 
     //vagalume
     async getArtMusic(art,mus){       

       // console.log(art)
        art = this.normalizeInput(art);
        mus = this.normalizeInput(mus);
        
        mus = mus.toLowerCase();
        mus = mus.replace('-live','');
        mus = mus.replace('-remastered','');
        mus = mus.replace('-remasterizado','');

    
        
        let res = await  apiLetra.carregarMusica(art,mus)

        return res

     //   return apiLetra.getArtMusic(art,mus);
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
        return apiLastFM.searchTrack(string);
        //return  apiLetra.searchTrack(string);  
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
        return apiLetra.getFoto(band);
    }

    //vagalume
    getCurrentFoto(){
       //console.log(this.dao.getSessionJSON('artist').pic_small)
        return  apiLetra.getCurrentFoto();
    }

    //lastFM
    getTrackInfo(art,mus){
        return apiLastFM.getTrackInfo(art,mus);
    }

    //vagalume
    getMusicById(musId){          
       
       return apiLetra.getMusicById(musId);
        // return apiLetra.getMusicById(musId);
     }
    
     //vagalume
     getArt(art){        
        art = this.normalizeInput(art);      
        return apiLastFM.searchArtist(art);
        return apiLetra.getArt(art);
    }
    //vagalume
    getArtSync(art){        
        art = this.normalizeInput(art);      
        return apiLetra.getArtSync(art);
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