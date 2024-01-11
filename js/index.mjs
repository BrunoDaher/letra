//bibliotecas/classes
import Api from "./classApi.js";
import Letra from "./classLetra.js";
import Tela from "./classTela.js";
import Dao from "./classDao.js";
import User from "./classUser.js"
import Drop from "./classDrop.js"
import Slider from "./classSlider.js";

//inicio



// Variaveis
    const objLetra = new Letra();
    const api = new Api();
    const tela = new Tela();
    const dao = new Dao();
    const nav = window.navigator;
    const user = new User(1);
    const drop = new Drop();
    //login
    //let person = prompt("Digite a senha");
    //seg.log(person);

    //painéis do header
    const h = document.querySelector("header");

    //Discografia
    const discos = document.getElementById('discog')
    const listaArtistas = document.getElementById('listaArtistas')
    const trackMus = document.getElementById('trackMus');
    //triggers
    discos.addEventListener('click',tela.modal);
    discos.addEventListener('click',tela.Parents);


    //busca avançada
    const trackSugestion = document.getElementById('trackSugestions');
    const listaMusicas = document.getElementById('listaMusicas');
    const btnBolt = document.getElementById('btnBolt');
    const infoLetra = document.getElementById('scroll-text');
    //triggers
    btnBolt.addEventListener('click',toggleLogic);

    //Letra
    const btnSetList = document.getElementById('btnSetList');
    const btnConfig = document.getElementById('btnConfig');
    const btnNextSong = document.getElementById("btnNextSong");
    const btnLastSong = document.getElementById("btnLastSong");
    const titulo = document.getElementById('titulo')
    //triggers
    btnSetList.addEventListener('click',tela.modal);
    btnLastSong.addEventListener('click',changeSong);
    btnNextSong.addEventListener('click',changeSong);

    //config
    const btnExport = document.getElementById('btnExport');
    const btnUpload = document.getElementById('btnUpload');
    const inputFile = document.getElementById('inputFile');
    const btnSaveCloud = document.getElementById('btnSaveCloud');
    const btnLoadCloud = document.getElementById('btnLoadCloud');
    //triggers
    inputFile.addEventListener('change',dao.upload);
    btnConfig.addEventListener('click',tela.modal)
    btnConfig.addEventListener('dblclick',adm)   
    btnSaveCloud.addEventListener('click',updateCloud);
    btnLoadCloud.addEventListener('click',loadCloud);

    //----------------Buildings---------------
    tela.nodeMenu(h);
    pesquisa();
    montaLista()

    drop.init(drop);

    let listObserver = document.getElementById('listObserver');
        listObserver.addEventListener('click',function ()
        {
            //montaLista();
            drop.init(drop,getMusById,tela.removeIt)
        });
        //console.log(listObserver)

    function loadCloud(){
        console.log("LoadCloud")
        tela.animateBar();
        dao.loadCloud(1);
    }

    function adm(){
    document.getElementById('save').classList.toggle('off')
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

    function toggleLogic(){
        let valor =  this.value;
        this.value = valor == 0 ? 1:0;
        this.childNodes[1].classList.toggle('active');
    }

    function changeSong(){

        let t = titulo.getAttribute('idSong').replace("_","");
        let tLoc = document.getElementById('div'+t);
        //  tLoc = tLoc.parentNode;

        //tela.nodeMenu(listaMusicas)

        let nodes = listaMusicas.childNodes;

        nodes.forEach(function(element) {
            element.childNodes[0].classList.remove('active')
        });

        let no ;

        if(this.value == "Go"){
            no = tLoc.nextElementSibling.childNodes[0];
        }
    
        if(this.value == "Back"){
            no = tLoc.previousElementSibling.childNodes[0];
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
                    
                    element = element[Object.keys(element)];
                //  console.log(element)

                    let el =  {name:element.artista + ' ' + element.musica, id:element.id}

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

        //Vagalume
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
                        let artistas = data.response.docs;

                        //limpa lista
                        listaArtistas.innerText = '';
                        
                        artistas.forEach(function(element) {
                            //element build
                            let el = document.createElement('div');
                            el.id = element.band;
                            el.classList.add('banda');
                            el.innerText = el.id;
                            el.addEventListener('click',getArtInfo); 
                            el.addEventListener('click',function(){tela.actBtn(discos)});
                            //plot
                            listaArtistas.append(el);
                        });
                            /*verifica retorno da promisse
                            let key = Object.keys(data)[0];              
                            let r = data[key];
                            console.log(key ? true:false)
                    
                            //caso positivo grava na sessão - em formato string
                            //caso contrario nao faz nada
                            key ? sessionStorage.setItem(key,JSON.stringify(r)):"";  */  
                    } )
                .catch(function (e) {       
                    return 'erro' ;
                    console.log(e);                
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
                    //modela Json
                    let data = JSON.parse(responseHtml);
                        let dados = data.response.docs;
                    
                    //limpa container destino
                        trackSugestion.innerText = '';
                        
                        //itera array de resposta  -- loop
                        dados.forEach(function(element)  {
                            let el = document.createElement('li');
                            el.id = element.id;
                            el.classList.add('banda');
                            el.innerText = `${element.band} ${element.title}`;

                            //busca por id
                            el.addEventListener('click',getMusById); 
                            el.addEventListener('click',addToList); 
                          
                            //preenche destino
                            trackSugestion.append(el);
                        });
                        
                    }); 
        }
    }

    //LAST FM
    function getArtInfo(event) {
        //console.log("API artInfo - vagalume")

        listaArtistas.classList.remove('active');
        let returnDisco = document.getElementById('listaDiscos');  
        //conversao  pra JSON
        
        fetch(api.getArtInfo(this.id))
        .then( function(response)   {     
            return response.ok ? response.text() : false; 
        })//retorna HTML
        .then( function(responseHtml) 
            { 
                //modela Json
                let data = JSON.parse(responseHtml);
           
                //discos    
                let lps = data.artist.albums.item;
                let cont = document.getElementById('discos');

                //rotulo da banda 
                let leg = document.getElementById('labelDiscos');
                    leg.innerText = this.id;    

                cont.innerText = '';
                //Itera lista de albums
                lps.forEach(function(element) {
                    
                    this.id = api.normalizeInput(this.id);

                    //eliminando o que vem depois de :
                    let pv = element.desc.lastIndexOf(":");
                    let alb = pv < 0 ? element.desc : element.desc.slice(0,pv)
                    
                    fetch(api.getAlbum(this.id,alb))
                    .then( function(response)   {     
                        return response.ok ? response.text() : false; 
                    })
                    .then(function(responseHtml) {//retorna HTML

                        data = JSON.parse(responseHtml);
                        let url = data.album.image[1]['#text'];
                        //modela thumbnail
                        cont.append(getThumb(url,alb,this.id))
                      
                    });
                });

                returnDisco.append(cont);
            });   
    }

    function getTracks(){
        
        fetch(api.getTracks(this.name,this.id))
        .then( function(response)   {     
            return response.ok ? response.text() : false; 
        })//retorna HTML
        .then(function(responseHtml)
            { 
                let data = JSON.parse(responseHtml);
                let msg = data.message ? true : false    
                if(msg){
                    let img = this.childNodes[0];
                    img.src = data.album.image[3]['#text'];  
                }
                try {
                    let tracks = data.album.tracks.track;
                    let div = document.getElementById('musicas');
                        div.setAttribute('alb',this.id);
                        div.setAttribute('band',this.name);
                        div.innerHTML = '';
                            tracks.forEach(function(element) {
                                tela.addToDiv('div',element,div,getArtMusic);
                            }
                    );
                } catch (error) {
                    console.log('Album nao encontrado')
                }
        });   
    }
    //api last fm

    function getArtMusic(){

        console.log("trilhoA Buscando pela Discografia")

        let artista = this.parentNode.getAttribute('band');
        let musica = this.innerText; //titulo da musica

        fetch(api.getArtMusic(artista,musica))
        .then( function(response)    {     
            return response.ok ? response.text() : false; 
        })//retorna HTML
        .then( function(responseHtml)
       {
            //tabulando dados
            let data = JSON.parse(responseHtml);

            let letra = data.mus[0].text;
            //correcao
            let id = 'l' + data.mus[0].id;  
            this.id = id; 
            artista = data.art.name;
          
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
                    if(!intoArray(listaLocal,id)){
                    //plota e persiste
                    setTimeout(
                        function(){
                            appendMusica(obj,listaLocal);
                        }
                        ,
                    400);
                } 
            }

             //plotagem
             infoLetra.innerText = letra;
             titulo.innerText = musica;
             titulo.setAttribute('idSong',id);
                
            //se opção tiver ativada
            //busca rapida
            if(btnBolt.value == 1){
                document.getElementById('btnMenuA').click()    
            }
        });  
    }

    function getLocalMusic(){

        //console.log(this)
        /* seleção de item dentro de menu */
        let div = this.parentNode;
        let collection = div.getElementsByTagName("li");

        //node menu
        for (let item of collection) {
            console.log(item);
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
        
        //view
        infoLetra.innerText = arr[this.id]['letra'];
        titulo.innerText = this.innerText
        
        //logica
        titulo.setAttribute('idSong','_' + this.id);

    }

    function getMusById(){
       // console.log('get by Id')
        fetch(api.getMusicById(this.id))
        .then( function(response)   {     
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
                if( Object.keys(element) == this.id ){
                    
                    //modelagem
                    element[this.id] = 
                    {
                        id:this.id, 
                        'letra':letra,
                        'musica':title, 
                        'artista':artista};
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

            if(!intoArray(listaLocal,this.id))
              {
                appendMusica(obj,listaLocal);
              }
            
        }
        else{
            console.log(2 + ' lista vazia')
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

    function intoArray(array,elemento){
        let cont = 0;

        //verifica se existe
             array.forEach(function(element) {
                if( Object.keys(element) == elemento) {
                    //console.log(0 +  ' ja existe' )
                    cont++;
                }
            });
        
           cont = cont > 0 ? true:false
           return cont 
    
    }

    function getThumb(url,alb,id){
                    
                    let img = document.createElement('img');
                        img.src = url;
                        img.style.width = '64px';
                    
                    let thumbDiv = document.createElement('div');
                        thumbDiv.name = id;  
                        thumbDiv.id = alb;
               
                        //eventos
                        thumbDiv.addEventListener('click',getTracks);
                        thumbDiv.addEventListener('click',function(){
                            //document.getElementById('infoMus').innerText = alb;
                            let infoDiv = document.getElementById('infoMus');
                            tela.typing(alb,infoDiv)
                        });
                        
                        thumbDiv.append(img);

        return thumbDiv;
    }

        // string 
                        /* let _div = `<div name='${this.id}' id='${alb}'><img src='${url}'></div>`;
                         //console.log(_div);
                         let d = document.createElement('div');
                         d.innerHTML = _div;*/
                        //eventos