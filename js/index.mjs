//bibliotecas/classes
import Api from "./classApi.js";
import Letra from "./classLetra.js";
import Tela from "./classTela.js";
import Dao from "./classDao.js";
import User from "./classUser.js"
import Aux from "./classAux.js"


//previne o zoom com dois touchs ou dois cliques
document.addEventListener('dblclick', function(event) {
    event.preventDefault();
});

//service worker

// Verifica se o navegador suporta Service Workers
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('./js/service-worker.js').then(function(registration) {
        console.log('ServiceWorker registrado com sucesso: ', registration);
      }).catch(function(error) {
        console.log('Falha ao registrar o ServiceWorker: ', error);
      });
    });
  }
  

// Variaveis
    const objLetra = new Letra();
    const api = new Api();
    const tela = new Tela();
    const dao = new Dao();
    const aux = new Aux();
    const nav = window.navigator;
    const user = new User(1);
    const infoMus = document.getElementById('infoMus');

    const header = document.querySelector("header");

    //Discografia
    const discos = document.getElementById('discog')
    const btnAlbSongsA = document.getElementById('btnAlbSongs');
    const btnListaArt = document.getElementById('btnListaArt');

        //Letra
    const btnSetList = document.getElementById('btnSetList');
    const btnConfig = document.getElementById('btnConfig');
            btnConfig.addEventListener('dblclick',adm);   
     
    const btnMenuA = document.getElementById('btnMenuA');
    const btnMenuB = document.getElementById('btnMenuB');
    const btnMenuC = document.getElementById('btnMenuC');

    let slideTarget = true;


    //listeners de menu modal
     [btnMenuA,btnMenuB,btnMenuC,discos,btnAlbSongsA,btnListaArt,btnSetList,btnConfig].forEach(function(item) {
        item.addEventListener('click',tela.newModalGroup);
     });

    const listaArtistas = document.getElementById('listaArtistas');
    const trackMus = document.getElementById('trackMus');
    
    //busca avançada
    const trackSugestion = document.getElementById('trackSugestions');
    const listaMusicas = document.getElementById('listaMusicas');
    
    //listeners logic
    const btnBolt = document.getElementById('btnBolt');
    const btnBolt2 = document.getElementById('btnBolt2');

    [btnBolt,btnBolt2].forEach(function(btn) {
        btn.addEventListener('click',toggleLogic);
    });
    
    const infoLetra = document.getElementById('infoLetra');
  
    //listeners navegacao
    const btnNextSong = document.getElementById("btnNextSong");
    const btnLastSong = document.getElementById("btnLastSong");

        [btnLastSong,btnNextSong].forEach(function(item) {
            item.addEventListener('click',changeSong);
        });
          
    const titulo = document.getElementById('titulo')
    
    const inputFile = document.getElementById('inputFile');
          inputFile.addEventListener('change',dao.upload);

    const btnSaveCloud = document.getElementById('btnSaveCloud');
          btnSaveCloud.addEventListener('click',updateCloud);
   
    const btnLoadCloud = document.getElementById('btnLoadCloud');
          btnLoadCloud.addEventListener('click',loadCloud);
  

    //----------------Buildings---------------
    //tela.nodeMenu(header);
  
    pesquisa();
    montaLista()

    function loadCloud(){
        console.log("LoadCloud")
        tela.animateBar();
        dao.loadCloud(1);
    }

    function updateCloud(){
            //console.log('saveCloud');
        //let nome =  document.getElementById('nomeArquivo').value;

         dao.updateCloud();
        /*
        if(!nome){
            //toDO
            //verificar registro de sessao
            //console.log('Insira um nome no arquivo');
            dao.updateCloud();
        }
        else{
        //dao.updateCloud();
        dao.updateBin();
        }
        */

    }

    function adm(){
     document.getElementById('save').classList.toggle('off')
    }

    function toggleLogic(){
        let valor =  this.value;
        this.value = valor == 0 ? 1:0;
        this.childNodes[1].classList.toggle('active');
    }

    function changeSong(){

        let t = titulo.getAttribute('idSong').replace("_","");
        let tLoc = document.getElementById('div'+t);
       
        let nodes = listaMusicas.childNodes;

        nodes.forEach(function(element) {
            element.childNodes[0].classList.remove('active')
        });

        let no ;

        if(this.value == "Go"){
            no = tLoc.nextElementSibling.childNodes[0];
            slideTarget = true;
        }
    
        if(this.value == "Back"){
            no = tLoc.previousElementSibling.childNodes[0];
            slideTarget = false;
        }

        no.click();
        no.classList.add('active')
        
    }

    function montaLista(){
        if(dao.getLocalJSON('listaLocal')){
            let listaLocal = dao.getLocalJSON('listaLocal'); 
            
            //limpa lista;
            listaMusicas.innerHTML = '';
            //verifica se existe
                listaLocal.forEach(function(element) {

                   // console.log(element);

                    element = element[Object.keys(element)];
                //  console.log(element)


                    let el =  {name:element.artista + ' ' + element.musica, id:element.id,'song':element.musica}

                    //listaMusicas.append(element);
                    
                    tela.addToDiv('div',el,listaMusicas,getLocalMusic);
                    
                });
        }
    }

    function inputClean(event){
        event.target.value = ''
    }

    function pesquisa(){
        let arrPesq = document.querySelectorAll('.inputPesquisa');
    
        //pelo fato de serem funcoes privadas da pesquisa
        //o que provavalmente cadastra o evento a cada vez que o trigger é chamado
        trackMus.addEventListener('keypress',searchTrackInfo);
        trackMus.addEventListener('change',searchTrackInfo);
        trackMus.addEventListener('click',inputClean);
    

        arrPesq.forEach(function(element){
            element.addEventListener('keypress',searchArtist);   
            element.addEventListener('click',inputClean);     
        });

        //LastFM
        function searchArtist(){
            //exibe lista
            listaArtistas.classList.add('active');

            fetch(api.getArt(this.value))
                .then( function(response)  {        
                    
                    return response.ok ? response.text() : false; 
                })//retorna HTML
                .then( function(responseHtml)

                    { 
                     
                        //modela Json
                        let data = JSON.parse(responseHtml);
                       
                        let artistas = data.results.artistmatches.artist //data.response.docs; <- old vagalume

                        //limpa lista
                        listaArtistas.innerText = '';
                        
                        artistas.forEach(function(element) {
                            //element build
                            let el = document.createElement('div');
                            el.id = element.name;
                            el.classList.add('banda');
                            el.innerText = el.id;
                            el.addEventListener('click',getArtInfo); 
                            el.addEventListener('click',function(){tela.actBtn(discos)});
                            //plot
                            listaArtistas.append(el);
                        });
                    } )
                .catch(function (e) {       
                    return 'erro' ;
                });
            }   



        //Vagalume    
        function searchTrackInfo(){
            //exibe lista
            trackSugestion.classList.add('active');
        //let returnArt = document.getElementById('listaArtistas');

            fetch(api.searchTrack(this.value))
            .then( function(response)  {        
                return response.ok ? response.text() : false; 
            })//retorna HTML
            .then( function(responseHtml)
                { 
                    //console.log(responseHtml.length)
                    //modela Json
                    let data = responseHtml.length > 2 ? JSON.parse(responseHtml).results.trackmatches.track : false;

                    console.log(data)
                   
                    if(data){
    
                    //limpa container destino
                        trackSugestion.innerText = '';
                        
                        //itera array de resposta  -- loop
                      data.forEach(function(element)  {
                            //verificar se é o mesmo artista de antes

                            console.log(element)

                            let el = document.createElement('div');
                            el.id = element.mbid;
                            el.setAttribute('artInfo',element.artist);
                            el.setAttribute('artMus',element.name);
                            el.classList.add('banda');
                            el.innerText = `${element.artist} ${element.name}`;
                            
                            //busca info das letras
                            el.addEventListener('click',getMusicInfo); 
                            el.addEventListener('click',addToList); 
                          
                            //preenche destino
                            trackSugestion.append(el);
                        });

                    }
                        
            }); 
        }
    }

    //LAST FM
    function getArtInfo(event) {
        //console.log("API artInfo - vagalume")

        listaArtistas.classList.remove('active');
        let returnDisco = document.getElementById('listaDiscos');  
       
        //lastFM - busca pelo nome do artista
        fetch(api.getArtInfo(this.id))
            .then( function(response)   {     
                return response.ok ? response.text() : false; 
            })//retorna HTML
            .then( function(responseHtml) 
                {  
                    let data = JSON.parse(responseHtml);
                    let lps = data.topalbums.album;
                    let divDiscos = document.getElementById('discos');
                    let leg = document.getElementById('labelDiscos');

                    let art = (data.topalbums["@attr"].artist);

                    document.getElementById('albSongs').setAttribute('band',art);
                        leg.innerText = art;    
                        divDiscos.innerText = '';

                    let map = new Map(); 

                    lps.forEach( function(key) {
                        map.set([key.name+ key.mbid ?key.mbid:''],key);
                    });
                  
                    for (const [chave, valor] of map.entries()) {
                       //filtra os singles
                       //cds de edicao especial e etc
                        if(valor.mbid){
                            fetchLP(api.getAlbum(art,{'tipo':'mbid','info':valor.mbid}));
                        }
                        else{
                            fetchLP(api.getAlbum(art,{'tipo':'album','info':valor.name}));
                        }
                    }

                    returnDisco.append(divDiscos);
                });   
    }

    //to DO, tentar buscar tudo na Last

    function fetchLP(url){
        
            fetch(url)
            .then( function (response){
                return checkJson(response)
            })
            .then(function(response) {//retorna HTML
                success(response);
            })

            function success(response){
               
                if(response != null && !response.message){
                  
                    let alb = response.album;
                    
                    let getLyric = document.querySelectorAll('.getLyric');
    
                        getLyric.forEach(function(track) {
                            track.removeEventListener('click',getArtMusic);
                        });

                    if(alb.tracks){
                        let faixas = alb.tracks.track;
                        let urlImg = alb.image[2]['#text'];
                        let albuns = document.getElementById('discos');

                        //monta imagem do album
                        if(urlImg){
                            albuns.append(getThumb(urlImg,alb,faixas));
                        }   
                    }
                }
            }
    
            function checkJson(response){
                let contentType = response.headers.get('Content-Type');
                if (contentType && contentType.includes('application/json')) {
                    return response.json();
                }
                else{
                    return null;
                }
            }
    }

    function getArtMusic(e){

        console.log("trilhoA Buscando pela Discografia")

        let artista = this.parentNode.getAttribute('band');
        let musica = this.innerText; //titulo da musica

        fetch(api.getArtMusic(artista,musica))
                .then(function(response){  
                    return response.ok ? response.text() : false; 
                })//retorna HTML
                .then(function(responseHtml){
                    //tabulando dados
                    let data = JSON.parse(responseHtml);
                    let letra = data.mus[0].text;
                    let id = 'l' + data.mus[0].id;
                 
                    e.target.id = id; 
                    artista = data.art.name;
                
                    console.log(data);
                    // modelagem
                    let obj = {
                        [id]:{'letra':letra,"id":id,'musica':musica,'artista':artista}
                    };
                
                    let listaLocal = dao.getLocalJSON('listaLocal');

                    //pra caso de lista zerada
                    if(!listaLocal){
                        listaLocal = new Array();
                    }
                    else{
                            if(!aux.intoArray(listaLocal,id)){
                            //plota e persiste
                            setTimeout(
                                function(){ appendMusica(obj,listaLocal);},400);
                        } 
                    }

                    //plotagem
                    
                    setTimeout(function(){
                        infoLetra.classList.remove('active');
                        infoLetra.innerText = letra;
                    },700);
                
                    
                    infoLetra.classList.add('active');

                    titulo.innerText = musica;
                    titulo.setAttribute('idSong',id);
                        
                    //se opção tiver ativada
                    //busca rapida
                    if(btnBolt.value == 1 || btnBolt2.value == 1){
                        document.getElementById('btnMenuA').click()    
                    }
                });  
    }

    function getLocalMusic()
    {
      //  console.log(event.target)
        /* seleção de item dentro de menu */
        let div = this.parentNode;
        let collection = div.getElementsByTagName("div");

        //node menu
        for (let item of collection) {
           // console.log(item);
            item.classList.remove('selected')
        }

        this.classList.add('selected')

        /* --------- */
        let listaLocal = dao.getLocalJSON('listaLocal');

        let arr = new Array();
        listaLocal.forEach(function(element) {
        //  console.log(element)
            let values = Object.values(element);
            arr[values[0].id] = values[0];
        });  

      console.log(collection)

        //view
       
        //som anterior
        let prevSong = arr[this.id]['letra'];
        let curSong =  arr[this.id]['letra'];

        //infoLetra.innerText = prevSong;

        let back = slideTarget ? 'goingout':'active';
        let fwd = slideTarget ? 'active':'goingout';

        //desliza esquerda
            setTimeout(function(){
                    infoLetra.classList.add(back);
            },100);

            setTimeout(function(){
            //  console.log('remove esquerda')
                infoLetra.classList.add('off');

                infoLetra.classList.remove(back);
                infoLetra.innerText = curSong;
            },150);

            //inativa
            setTimeout(function(){

                    infoLetra.classList.add(fwd);
                    infoLetra.classList.remove('off');
            },200);

            //normaliza
            setTimeout(function(){
                infoLetra.classList.remove(fwd);
            },250);

        //desliza direita
//        infoLetra.innerText = arr[this.id]['letra'];
        titulo.innerText = this.innerText
        
        //logica
        titulo.setAttribute('idSong','_' + this.id);

        //omitir menu
        listaMusicas.classList.remove('active');
      
    }

    function getMusicInfo(e){

        let item = this?this : e.target;

        //console.log(item)

        let art = item.getAttribute('artInfo');
        let mus = item.getAttribute('artMus');

       // console.log('get by Id')
        //fetch(api.getMusicById(item.id))
        fetch(api.getArtMusic(art,mus)).then( function(response)   {     
            //console.log(response)
            return response.ok ? response.text() : false; 
        })//retorna HTML
        .then( function(responseHtml)
        {
       
            //tabula os dados
            let data = JSON.parse(responseHtml); 

            let title = data.mus[0].name;  
            let letra = data.mus[0].text;
            let artista = data.art.name;

            //plota titulo
            titulo.innerText = title;  
           
            //plota a letra
            infoLetra.innerText = letra;

            //dao
            let ls = dao.getLocalJSON('listaLocal');
            if(!ls){
                ls = new Array();
            }
            
            //modelagem de elemento - populator
            ls.forEach(function(element)  {
                if( Object.keys(element) == item.id ){
                
              //      console.log(element)
                    //modelagem
                    element[item.id] = 
                    {
                        id:item.id, 
                        'letra':letra,
                        'musica':title, 
                        'artista':artista
                    };
                }
                else{
                   // console.log(item.id)
                }
            }
            );

            //persiste
            dao.saveLocalJSON('listaLocal',ls);
        });  
        
        //funcao de header
        if(btnBolt.value == 1){
            document.getElementById('btnMenuA').click()
        }
    }


    function addToList(){
        
    
    //cria chave e obj
        let obj = {[this.id]:this.innerText}
        let listaLocal = new Array();

        // 2 cria array caso não exista no Dao
        if(dao.getLocalJSON('listaLocal')){
            listaLocal = dao.getLocalJSON('listaLocal'); 
            if(!aux.intoArray(listaLocal,this.id))
              {
                appendMusica(obj,listaLocal);
              }
        }
        else{
            appendMusica(obj,listaLocal)
        }
    
    }
 
    function appendMusica(obj, lista){

        lista.push(obj);

        console.log(obj)
     
        dao.saveLocalJSON('listaLocal',lista);
        //refreash lista
        setTimeout(montaLista,800);
        
    }

    //apenas itera e plota o item, e associa a funcao de buscar as tracks
    function getThumb(url,alb,faixas){

                    let img = document.createElement('img');
                        img.src = url;
                       // img.style.width = "calc(12vw + 4vh)";
                    
                    let thumbDiv = document.createElement('li');
                        thumbDiv.name = alb.artist;  
                        thumbDiv.id = alb.name;
                        let musContainer = document.getElementById('albSongs');
                        

                       //eventos
                        thumbDiv.addEventListener('click',function(){
                            if(faixas.name){
                               musContainer.innerHTML = `<li class="getLyric">${faixas.name}</li>`;
                            }
                            else{
                                musContainer.innerHTML = "";
                                faixas.forEach(function(faixa) {
                                     musContainer.innerHTML += `<li class="getLyric">${faixa.name}</li>`;
                                });
                            }
                        
                                infoMus.innerText = alb.name;
                            tela.typing(alb.name,infoMus);

                            albSongEvent();

                            function cback(){
                                btnAlbSongsA.click();
                            }

                            function albSongEvent(){
                                let getLyric = document.querySelectorAll('.getLyric');
                                setTimeout(cback,200);
                                //pra cada letra
                                getLyric.forEach(function(track) {
                                    track.addEventListener('click',getArtMusic);
                                });
                            }
                        });
                        
                        thumbDiv.append(img);

        return thumbDiv;
    }

  