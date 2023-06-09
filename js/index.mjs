
import Api from "./classApi.js";
import Letra from "./classLetra.js";
import Tela from "./classTela.js";
import Dao from "./classDao.js";

const letra = new Letra();
const api = new Api();
const tela = new Tela();
const dao = new Dao();


const h = document.querySelector("header");
const discos = document.getElementById('discog')
const listaArtistas = document.getElementById('listaArtistas')
const trackMus = document.getElementById('trackMus');
const trackSugestion = document.getElementById('trackSugestions');
const listaMusicas = document.getElementById('listaMusicas');
const btnSetList = document.getElementById('btnSetList');
const btnConfig = document.getElementById('btnConfig');
const btnNextSong = document.getElementById("btnNextSong");
const btnLastSong = document.getElementById("btnLastSong");
const titulo = document.getElementById('titulo')

tela.nodeMenu(h);

pesquisa();

discos.addEventListener('click',tela.modal);
discos.addEventListener('click',tela.Parents);
    
btnSetList.addEventListener('click',tela.modal)
btnConfig.addEventListener('click',tela.modal)

btnLastSong.addEventListener('click',changeSong);
btnNextSong.addEventListener('click',changeSong);


function changeSong(){

    let t = titulo.getAttribute('idSong').replace("_","");
    let tLoc = document.getElementById(t);

    tela.nodeMenu(listaMusicas)

    if(this.value == "Go"){
        tLoc.nextElementSibling.click();
    }
   
    if(this.value == "Back"){
        tLoc.previousElementSibling.click();
    }
    
}

montaLista()

function montaLista(){
    if(dao.getLocalJSON('listaLocal')){
        let listaLocal = dao.getLocalJSON('listaLocal'); 
        
        //limpa lista;
        listaMusicas.innerHTML = '';
        //verifica se existe
            listaLocal.forEach(element => {
                
                element = element[Object.keys(element)];

                let el =  {name:element.musica, id:element.id}

                //listaMusicas.append(element);
                
                tela.addToDiv('li',el,listaMusicas,getLocalMusic);
                
            });
    }
}

function inputClean(event){
    event.target.value = ''
}

function pesquisa(){
    let arrPesq = document.querySelectorAll('.inputPesquisa');
   
    arrPesq.forEach(element => {
        element.addEventListener('keypress',searchArtist);   
        element.addEventListener('click',inputClean);     
    });

    trackMus.addEventListener('keypress',searchTrackInfo);
    trackMus.addEventListener('change',searchTrackInfo);
    trackMus.addEventListener('click',inputClean);

    //monta lista de bandas
    //event - evento gerador - neste caso keypress
    //this = input de pesquisa
    function searchArtist(){

    //exibe lista
    listaArtistas.classList.add('active');
   //let returnArt = document.getElementById('listaArtistas');

    //busca na api
        api.getArt(this.value).then((response) => response.json())
            .then((data) => {                              
            let artistas = data.response.docs;
          
            //returnArt.innerText = '';
            listaArtistas.innerText = '';
            
            artistas.forEach(element => {
                let el = document.createElement('li');
                el.id = element.band;
                el.classList.add('banda');
                el.innerText = el.id;
                el.addEventListener('click',getArtInfo); 
                el.addEventListener('click',()=>{tela.actBtn(discos)});
                
                listaArtistas.append(el);
            });
        }); 
    }

    function searchTrackInfo(){
        //exibe lista
        trackSugestion.classList.add('active');
       //let returnArt = document.getElementById('listaArtistas');
    
        //busca na api
            api.searchTrack(this.value).then((response) => response.json())
                .then((data) => {                        
                   // console.log(data.response.docs);      
                let dados = data.response.docs;
              
               //limpa container destino
                trackSugestion.innerText = '';
                
                //itera array de resposta  -- loop
                dados.forEach(element => {
                    let el = document.createElement('li');
                    el.id = element.id;
                    el.classList.add('banda');
                    el.innerText = `${element.band} ${element.title}`;

                    //busca por id
                    el.addEventListener('click',getMusById); 
                    el.addEventListener('click',addToList); 
                    
                    //el.addEventListener('click',()=>{tela.actBtn(discos)});
                    //preenche destino
                    trackSugestion.append(el);
                });
                
            }); 
    }
}

function getArtInfo(event) {
    //console.log(this.id)

    listaArtistas.classList.remove('active');
    let returnDisco = document.getElementById('listaDiscos');
   
    api.getArtInfo(this.id).then((response) => response.json())
            .then((data) => {                    
    
            //discos    
            let lps = data.artist.albums.item;
            let cont = document.getElementById('discos');

            //rotulo da banda dona dos discos    
            let leg = document.getElementById('labelDiscos');
            leg.innerText = this.id;    

            cont.innerText = '';
            //Itera lista de albums
            lps.forEach(element => {
                
                this.id = api.normalizeInput(this.id);
                let img = document.createElement('img');
                
                let li = document.createElement('div');
                 li.id = api.normalizeInput(element.desc);

                //eliminando o que vem depois de :
                let pv = element.desc.lastIndexOf(":");
                let alb = pv < 0 ? element.desc : element.desc.slice(0,pv)
                
                // console.log(alb)

                api.getAlmbum(this.id,alb).then((response) => response.json())
                .then((data) => {   
                    //json busca por album
                    let url = data.album.image[1]['#text'];
                    //let url = (data.results.albummatches.album[0].image[1]['#text']);
    
                    img.src = url;
                    img.style.width = '64px';
                    li.name = this.id;  
                    li.id = alb;

                    // utopia 
                    // let _li = `<li name='${this.id}' id='${alb}'><img src='${url}'></li>`;

                    //eventos
                    li.addEventListener('click',getTracks);
                    li.addEventListener('click',()=>{
                        //document.getElementById('infoMus').innerText = alb;
                        let div = document.getElementById('infoMus');
                        tela.typing(alb,div)
                    });
                    
                    li.append(img);
                    
                    cont.append(li)
                });
            });

            returnDisco.append(cont);
        });   
}

function getTracks(){

    api.getTracks(this.name,this.id).then((response) => response.json())
            .then((data) => {   
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
                        tracks.forEach(element => {
                            tela.addToDiv('li',element,div,getArtMusic);
                        }
                );
            } catch (error) {
                console.log('Album nao encontrado')
            }
    });   
}
//api last fm
//clicados no menu pesquisa
function getArtMusic(){

    
    let band = this.parentNode.getAttribute('band');
    let mus = this.innerText;

    api.getArtMusic(band,mus).then((response) => response.json())
    .then((data) => {       
               
        let texto = data.mus[0].text;
        let id = data.mus[0].id;  

        //corrigindo dado q nao vem na api
        this.id = id;

       // addMusica
       
        let el = {id: mus};

        addMusica(el);

        document.getElementById('scroll-text').innerText = texto;
        titulo.innerText = mus;
        titulo.idSong = id;

        document.getElementById('btnMenuA').click()        

    });  

    //document.getElementById('scroll-text').innerText = texto;
}

function getLocalMusic(){

    /* seleção de item dentro de menu */
    let node = this.parentNode;
    let collection = node.getElementsByTagName("li");

    for (let item of collection) {
        item.classList.remove('selected')
    }

    this.classList.add('selected')

    /* --------- */
 
    let listaLocal = dao.getLocalJSON('listaLocal');

    let arr = new Array();
    listaLocal.forEach(element => {
        let values = Object.values(element);
        arr[values[0].id] = values;
    });

    let letra =  arr[this.id][0].letra;

    //view
    document.getElementById("scroll-text").innerText = letra;
    
    titulo.innerText = this.innerText
    titulo.setAttribute('idSong','_' + this.id);

    //btnSetList.click();

    //console.log(titulo)
}

function getMusById(){
    console.log(2)
    api.getMusicById(this.id).then((response) => response.json())
    .then((data) => {       
       
        let title = data.mus[0].name;  
        titulo.innerText = title;  
       
        let texto = data.mus[0].text;  
        document.getElementById('scroll-text').innerText = texto;

        let artista = data.art.name;

        //salva letra no storage
        //console.log(localStorage.getItem('listaLocal'));

        let ls = JSON.parse(localStorage.getItem('listaLocal'));

        ls.forEach(element => {
          if( Object.keys(element) == this.id ){
            element[this.id] = {
                id:this.id, 'letra':texto,'musica':title, 'artista':artista};
          }
        }
        );

        dao.saveLocalJSON('listaLocal',ls);
    });  

    document.getElementById('btnMenuA').click()
}

function addToList(){
    //append to ul left collumn

    //cria chave e obj
    let obj = {[this.id]:this.innerText}
    
    //persistencia
    let listaLocal = new Array();

    // 2 cria array caso não exista no Dao
    if(dao.getLocalJSON('listaLocal')){
        listaLocal = dao.getLocalJSON('listaLocal'); 
        
        let cont = 0;

        //verifica se existe
            listaLocal.forEach(element => {
                if( Object.keys(element) == this.id) {
                    console.log(0 +  ' ja existe' )
                    cont++;
                }
            });

            console.log(cont)
            if(cont == 0){
                addMusica(obj)
            }
    }
    else{
        console.log(2 + ' banco vazio')
         addMusica(obj)
    }

    
    
  
}

function addMusica(elem){
        


    let listaLocal = dao.getLocalJSON('listaLocal'); 
    console.log('salva array')
    listaLocal.push(elem);
    
    console.log('add HTML')
    let obj = Object.keys(elem);
    let value = Object.values(elem)

    let el =  {name:value, id:obj}

    tela.addToDiv('li',el,listaMusicas,getMusById)
    
    //tela.addToDiv('li',el,listaMusicas,getMusById)

    console.log('salva LocalStorage')
    dao.saveLocalJSON('listaLocal',listaLocal);
}