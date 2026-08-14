import ApiLastFM from "./classApiLastFM.js";
import ApiLetra from "./classApiLetra.js";
import Dao from "./classDao.js";


const apiLastFM = new ApiLastFM('2651bc07e2240e60ef358c833cc84169');
const apiLetra = new ApiLetra();
const dao = new Dao();


//const url = 
export class Api {

    //toDo
    
    //setar apis
    constructor(){
       
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

        console.log(this.normalizeInput(art))

       // console.log(art)
        art = this.normalizeInput(art);
        mus = this.normalizeInput(mus);
        
        mus = mus.toLowerCase();
        mus = mus.replace('-live','');
        mus = mus.replace('-remastered','');
        mus = mus.replace('-remasterizado','');

        
        let res = await apiLetra.carregarMusica(art,mus);

        
        return res;

     //   return apiLetra.getArtMusic(art,mus);
    }

    getMusLocal(busca){

        const listaLocal = dao.getLocalJSON('listaLocal') || [];
   
        let existe = false;
        let doc = null;
        
        if(listaLocal.length > 0){

            listaLocal.forEach((element) => {
             let obj = Object.values(element)[0];
                let mus = obj['musica'];
            
            if(this.normalizeInput(mus) === this.normalizeInput(busca)){
                existe = true;
                doc = obj;
            } 
            
        });
     }
        return {existe,doc};
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
    
    buscaArtista(art){
        return apiLastFM.searchArtist(art);
    }

    buscaDiscos(art){
        return apiLastFM.getTopAlbums(art);
    }

    buscaFaixas(art,alb ){
        return apiLastFM.getTracks(art,alb);
    }

     //vagalume
    getArt(art){        
        art = this.normalizeInput(art);      
        return apiLastFM.searchArtist(art);
        //return apiLetra.getArt(art);
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

    async fecthData(path) {            
        try {
            const response = await fetch(path);
            
            if (!response.ok) return false;

            const responseHtml = await response.text();
            const data = JSON.parse(responseHtml);
            const key = Object.keys(data)[0];              
            const r = data[key];

            
            return r;
        } catch (e) {       
            console.error(e);
            return 'erro';   
        }
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

              console.log('Resposta da API:', r); // Log da resposta para depuração
              return r;
              //key ? sessionStorage.setItem(key,JSON.stringify(r)):"";    
            } )
        .catch(function (e) {       
            return 'erro' ;   
        });
    }

 }

export default Api;