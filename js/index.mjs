//bibliotecas/classes
import Api from "./classApi.js";
import Tela from "./classTela.js";
import Letra from "./classLetra.js";
import Dao from "./classDao.js";
import User from "./classUser.js"
import Aux from "./classAux.js"
import DragAndDrop from "./classDragDrop.js";
import Gestos from "./classGestos.js";

//impedir xss
import * as DOMPurify from 'https://cdn.jsdelivr.net/npm/dompurify@2.0.9/dist/purify.min.js';
import apiLetra from "./classApiLetra.js";

const objLetra = new Letra();

//service worker
// main.js ou seu arquivo principal JS

const container = document.getElementById('letraAtual'); // Alvo para o gesto de pinça
const gesto = new Gestos(container); // Crie uma nova instância da classe Gestos
gesto.start();
//crie um servico de consulta ao firebase


//service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Ajuste o caminho do service-worker.js conforme onde ele está no projeto
    navigator.serviceWorker
      .register('js/service-worker.js') // caminho absoluto da raiz do site
      .then((registration) => {
        console.log('Service Worker registrado com sucesso:', registration);
      })
      .catch((error) => {
        console.error('Falha ao registrar o Service Worker:', error);
      });
  });
}

  

//service worker

// Variaveis

    const user = new User(1);
        const aux = new Aux();
    const api = new Api();
    const tela = new Tela();
    const dao = new Dao();


    const infoMus = document.getElementById('infoMus');

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

    const divArtistas = document.getElementById('divArtistas');
    const listaArtistas = document.getElementById('listaArtistas');
    const trackMus = document.getElementById('trackMus'); // pesquisa por musica e artista
    
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
    montaLista();

    setTimeout(() => btnMenuB.click(), 1000); // Abre o menu B após 1 segundo

    new DragAndDrop('listaMusicas', {
        onDragStart: (event) => {
          console.log(`Início do drag para o item: ${event.target.textContent}`);
        },
        onDrop: (event, item) => {
          console.log(`Item "${item.textContent}" foi solto.`);
        },
      });

    function loadCloud(){
        console.log("LoadCloud")
        tela.animateBar();
        dao.loadCloud(1);
        //setTimeout(function(){location.reload()},1200)
    }

    function updateCloud(){

            //console.log('saveCloud');
        //let nome =  document.getElementById('nomeArquivo').value;
        

        tela.animateBar();
         dao.updateCloud();
         setTimeout(function(){location.reload()},1200)
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
        this.classList.toggle('active');
    }

    function changeSong(){


    //   console.log(titulo)

        let t = titulo.getAttribute('idSong').replace("_","");
        let tLoc = document.getElementById('div'+t);
       
        let nodes = listaMusicas.childNodes;
       

        nodes.forEach(function(element) {
            element.childNodes[0].classList.remove('active')
        });

        

        let no ;


        if(this.value == "Go" && tLoc.nextElementSibling){

            no = tLoc.nextElementSibling.childNodes[1];
            slideTarget = true;
            no.click();
        }
    
        if(this.value == "Back" && tLoc.previousElementSibling){
            no = tLoc.previousElementSibling.childNodes[1];
            slideTarget = false;
            no.click();
        }

       
     //   no.classList.add('active')
        
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
                    
                    tela.addToDiv('span',el,listaMusicas,getLocalMusic);
                    
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
        
        trackMus.addEventListener('input',searchTrackInfo);
        trackMus.addEventListener('change',searchTrackInfo);
        trackMus.addEventListener('click',inputClean);
    

        arrPesq.forEach(function(element){
            element.addEventListener('input',searchArtist);   
            element.addEventListener('click',inputClean);     
        });

        //LastFM
        function searchArtist(){
            //exibe lista
            divArtistas.classList.add('active');

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
               
                    if(data ){
    
                        trackSugestion.classList.add('active');
                    //limpa container destino
                        trackSugestion.innerText = '';
                        
                        //itera array de resposta  -- loop
                      data.forEach(function(element)  {
                            //verificar se é o mesmo artista de antes

                            let valido = (element.name.includes(element.artist));

                            if(valido){
                                    //console.log(element.name, '-> '+ element.artist);
                                    let mus = element.name.replace(element.artist,'');
                                        mus = aux.normalize(mus);
                                
                                    let art = aux.normalize(element.name);
                                    if(art.includes(mus)){
                                       art = art.replace(mus,''); 
                                    }

                                    //console.log(element)
                                    let el = document.createElement('div');
                                    el.name = element.mbid || element.artist;
                                    el.setAttribute('artInfo',art.trim());
                                    el.setAttribute('artMus',mus.trim());
                                    el.classList.add('banda');
                                    el.innerText = `${element.name}`;
                                    
                                    //busca info das letras

                                  //    el.onclick = this.getLocalSong(btn)

                                    el.addEventListener('click',getMusicInfo); 
                                
                                    
                                    //preenche destino
                                    trackSugestion.append(el);

                                    

                                    
                            }

                          
                        });

                    }
                        
            }); 
        }
    }

    //LAST FM
    function getArtInfo(event) {    
        
        //console.log("API artInfo - vagalume")

        divArtistas.classList.remove('active');
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

    //vindo do
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

     async function getArtistMusic(item){

        item.classList.add('active')

        console.log("trilhoA Buscando pela Discografia")

        let artista = item.parentNode.getAttribute('band');
        let musica = item.innerText; //titulo da musica

      
        let letra =  await api.getArtMusic(artista,musica);

        if(letra){
            plotaLetra(letra, artista, musica);
            fastGo();
        }
       
            
   }

   
    function plotaLetra(letra, artista, musica){
            
        
                    let id = 'l' + artista + musica;
                        id = id.trim().toLowerCase();
             
                    let obj = {
                        [id]:{'letra':letra,"id":id,'musica':musica,'artista':artista}
                    };
                
                    let listaLocal = dao.getLocalJSON('listaLocal') || new Array();

                       if(!aux.intoArray(listaLocal,id)){
                            //plota e persiste
                            setTimeout(
                                function(){ 
                                    //console.log('plotando letra e salvando')
                                    infoLetra.innerHTML = letra;
                                    //console.log('via getArtMusic') 
                                    appendMusica(obj,listaLocal);},100
                                );
                        } 
                    
                    setTimeout(function(){
                        console.log('plotando letra')
                        infoLetra.classList.remove('active');
                        //if(letra.includes('<'))
                        //infoLetra.innerHTML = letra;
                    },200);
                    
                    infoLetra.classList.add('active');

                    titulo.innerText = musica;
                    titulo.style = 'text-transform:capitalize';
                    titulo.setAttribute('idSong',id);
                        
                    //se opção tiver ativada
                    //busca rapida
                    if(btnBolt.value == 1 || btnBolt2.value == 1){
                       
                        setTimeout(function(){
                            btnMenuA.click();
                        })
            
                    }
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
            item.classList.remove('selected');
        }

        this.classList.add('selected')

        /* --------- */
    //    let listaLocal = dao.getLocalJSON('listaLocal');

        let listaLocal = dao.getLocalJSON('listaLocal') || new Array();

        if(!aux.intoArray(listaLocal,this.id)){
             //plota e persiste
             setTimeout(
                 function(){ appendMusica(obj,listaLocal);},100);
         } 

        let arr = new Array();
            listaLocal.forEach(function(element) {
            
            let values = Object.values(element);
            arr[values[0].id] = values[0];
        });  

   

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
                infoLetra.innerHTML = curSong;
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

        // -- hide parents
                // inativa elementos irmaos
                //ativa elemento atual

            let m = this.parentNode.parentNode.childNodes;

            m.forEach(element => {
                element.childNodes[1].classList.remove('active');

            });

            this.classList.add('active');
        // -- hide parents


        //omitir menu
        //se estiver ativo
        if(btnSetList.classList.contains('active')){
            btnSetList.click();
        }
        
      
    }

    async function getMusicInfo(e){


         console.log('trilhoB buscando via pesquisa composta')

        let item = this?this : e.target;

        let art = item.getAttribute('artInfo');
        let mus = item.getAttribute('artMus');


           console.log('verificando localStorage', item);

        let local = api.getMusLocal(mus);

        let letra = '';

        if(local.existe){
            console.log('via Local')
             letra = local.doc.letra;
        }
        else{
            console.log('via API')
           letra =  await api.getArtMusic(art,mus);
        }
        
        if(letra){
            console.log('letra encontrada')
          
               infoLetra.innerHTML = local.doc.letra;
                        titulo.innerText = local.doc.musica;
                    titulo.style = 'text-transform:capitalize';
                    titulo.setAttribute('idSong',local.doc.id);
                //fastGo();
                //plotaLetra(local.doc.letra, local.doc.artista, local.doc.musica);
                
                if(btnBolt.value == 1 || btnBolt2.value == 1){
                    setTimeout(function(){
                        btnMenuA.click();
                    }, 300)
                }

           //fastGo();
        }
        else{
            console.log('trilhoB falhou, buscando via getArtMusicAlt')
        }
     
        

    }

    function fastGo(){
        
        if(btnBolt.classList.contains('active')){
                       
                setTimeout(function(){
                    btnMenuA.click();
                })
            
        }
    }

    function addToList(obj){
    
  
        let listaLocal = dao.getLocalJSON('listaLocal') || new Array();
       

        let id = (Object.values(obj)[0].id);   

       // console.log(obj)

        if(!aux.intoArray(listaLocal,id))
            {
              appendMusica(obj,listaLocal);
        }
    
    }
 
    function appendMusica(obj, lista){


        lista.push(obj);

        //persiste via busca geral
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
                               musContainer.innerHTML = DOMPurify.sanitize(`<li class="getLyric bi-activity">${faixas.name}</li>`);
                            }
                            else{
                                musContainer.innerHTML = "";
                                faixas.forEach(function(faixa) {

                                        // Exemplos de uso:
                                            const duracaoEmSegundos = faixa.duration;
                                            
                                            // Converter para minutos e segundos:
                                         // Converter para minutos e segundos:
                                    const resultadoMinutosSegundos = aux.converterDuracaoEmSegundos(duracaoEmSegundos, 'minutosSegundos');
                                    console.log(`${faixa.name}[${duracaoEmSegundos}]  ${resultadoMinutosSegundos.minutos}m:${resultadoMinutosSegundos.segundos} seg`);
                                    // Saída: 4 minutos e 46 segundos

                                    // Converter para número real em minutos:
                                    const resultadoRealEmMinutos = aux.converterDuracaoEmSegundos(duracaoEmSegundos, 'real');
                                    //console.log(`${resultadoRealEmMinutos} minutos`);
                                    // Saída: 4.766666666666667 minutos

                                     musContainer.innerHTML += `<li class="getLyric bi-activity">${faixa.name}</li>`;
                                });
                            }
                        
                                
                                infoMus.innerText = alb.name;

                              

                                document.getElementById('infoAlb').src = alb.image[2]['#text']

                             //   console.log(alb.image[2]['#text'])

                            //tela.typing(alb.name,infoMus);

                            albSongEvent();

                            function cback(){
                                btnAlbSongsA.click();
                            }

                            function albSongEvent(){
                                let getLyric = document.querySelectorAll('.getLyric');
                                setTimeout(cback,200);
                                //pra cada letra
                                getLyric.forEach(btn => {
                                    
                                    btn.onclick = this.getLocalSong()
                                      
                                });
                            }
                        });
                        
                        thumbDiv.append(img);

        return thumbDiv;
    }

    function getLocalSong(btn){
          
                                            
            console.log('verificando localStorage');

            let local = api.getMusLocal(btn.innerText);

            
            if(local.existe){
                console.log('letra existe no storage local, plotando');
                
                    infoLetra.innerHTML = local.doc.letra;
                        titulo.innerText = local.doc.musica;
                    titulo.style = 'text-transform:capitalize';
                    titulo.setAttribute('idSong',local.doc.id);
                //fastGo();
                //plotaLetra(local.doc.letra, local.doc.artista, local.doc.musica);
                
                if(btnBolt.value == 1 || btnBolt2.value == 1){
                    setTimeout(function(){
                        btnMenuA.click();
                    }, 300)
                }
                

            }
                else{
                    getArtistMusic(btn)
                }
            
            
        
    }

  