
import Api from "./classApi.js";
import Letra from "./classLetra.js";
import Tela from "./classTela.js";

const letra = new Letra();
const api = new Api();
const tela = new Tela();


const h = document.querySelector("header");
const discos = document.getElementById('discog')
const listaArtistas = document.getElementById('listaArtistas')
const trackMus = document.getElementById('trackMus');
const trackSugestion = document.getElementById('trackSugestions')

tela.nodeMenu(h);

pesquisa();

discos.addEventListener('click',tela.modal);
discos.addEventListener('click',tela.Parents);


function pesquisa(){
    let arrPesq = document.querySelectorAll('.inputPesquisa');
   
    arrPesq.forEach(element => {
        element.addEventListener('keypress',searchArtist);        
    });
    

    trackMus.addEventListener('keypress',searchTrackInfo);
    trackMus.addEventListener('change',searchTrackInfo);

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

                console.log(data)

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
                    let li = document.createElement('li');
                        li.innerText = element.name;
                        li.id= element.id
                        li.addEventListener('click',getArtMusic);
                    div.append(li);
                    });
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
        document.getElementById('scroll-text').innerText = texto;
    });  

    //document.getElementById('scroll-text').innerText = texto;
}

function getMusById(){

    api.getMusicById(this.id).then((response) => response.json())
    .then((data) => {       
                        
    let texto = data.mus[0].text;  
        document.getElementById('scroll-text').innerText = texto;
    });  

    //document.getElementById('scroll-text').innerText = texto;
}