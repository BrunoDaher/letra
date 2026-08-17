import Tela from "../aux/classTela.js";

export default class viewAlbuns extends Tela {

    constructor(api,user){

        
        super();
        this.api = api;
        this.user = user;
        
        let classe = this;
        this.viewName = 'menuB'
        
        this.garbageCollector(classe);
    }

    
    init(){
        
        
        this.seletores();
        this.triggers();
    }

    destroy(){
        this.menuB.innerHTML ='';
        //remover todos os listeners
        this.menuB.removeEventListener('click', this.triggers);
        this.btnDiscog.removeEventListener('click', this.triggers);
        this.btnAlbSongs.removeEventListener('click', this.triggers);
        this.btnListaArt.removeEventListener('click', this.triggers);
        this.inputPesquisaArtista.removeEventListener('keyup', this.triggers);
        
    }

    seletores(){

        //menu
        this.menuB = document.getElementById('menuB');
        this.menuB.innerHTML = this.renderTemplate();

        //botoes
        this.btnDiscog = document.getElementById('btnDiscog');
        this.btnAlbSongs = document.getElementById('btnAlbSongs');
        this.btnListaArt = document.getElementById('btnListaArt');

        //
        this.listaArtistas = document.getElementById('listaArtistas');
        this.infoAlb = document.getElementById('infoAlb');
        this.nomeAlb = document.getElementById('nomeAlb');

        this.inputPesquisaArtista = document.getElementById('inputPesquisaArtista');
        this.listaModal = document.getElementById('listaModal')
        
    }

    triggers(){

        this.inputPesquisaArtista.addEventListener('change',async ()=>{
            let buscaArtista =  await this.buscaArtista();

            let artName = this.inputPesquisaArtista.value;

            if(artName){
                document.getElementById(artName).click();   
                let arts = this.user.getArts()
                let art = (arts[artName]);
                
                if(art){
                    const alb = Object.entries(art)[0];
                    const url = alb[1].foto;
                    document.getElementById(artName).style.backgroundImage = `url(${url})`; 
                }
            }
        });

         document.addEventListener('artista', (evento)=> { // Nome corrigido aqui
            this.inputPesquisaArtista.value = evento.detail.artista;
            this.buscaArtista();
        });

        //evento de clique pros menus
        document.querySelectorAll('.btnToggle').forEach(btn => {
            btn.addEventListener('click',this.newModalGroup);
        });

        //this.actBtn(this.btnListaArt);
        this.btnListaArt.onclick = ()=>
        {

            this.refresh();
        }
        this.refresh();
        
    }

    refresh(){
        //retornar ultimo album visitado
        this.listaArtistas.innerHTML = ''
        console.log('refresh album');
    
        Object.entries(this.user.getArts()).map(([nome, artista]) => {
            const img = this.urlArt(nome);
            this.updateListaArtistas(this.modelArtista(nome,img));
        });
    }

    //Renders
    renderTemplate(){

        return `
            <section class='flex col'>
                ${this.renderSecaoPesquisa()}
                <article id='secaoDiscos' class="wrapper flex col justBetween">
                    ${this.renderPainelDiscog()} 
                    ${this.renderSecaoArtistas()}
                    ${this.renderSecaoDisco()}
                    ${this.renderSecaoFaixas()}
                    ${this.renderModal()}
                </article>
            </section>   
        `
    }   

    renderSecaoPesquisa (){
        
        return `
          <section class="box-pesquisa">
                    <input id='inputPesquisaArtista' target = 'divArtistas' class="inputPesquisa rad2" type="text" placeholder="artista">
                    <input hidden class="inputPesquisa" id="musica" type="text" placeholder="artista musica"> 
            </section>
        `
    }

    renderPainelDiscog(){
        return `<article id="painelDiscog" class="flex justEven p1 gap1">
               
                    <button  class="btnToggle"target="divArtistas" id="btnListaArt">
                        <i class="bi bi-person ">Artistas</i>
                    </button> 
                    <button class="btnToggle"target="listaDiscos" id="btnDiscog">
                        <i class="bi bi-vinyl "> Discos</i>
                    </button>
                    <button class="btnToggle"target="discoBox" id="btnAlbSongs">
                        <i class="bi bi-music-note ">Faixas</i>
                    </button>
                </article>`
    }

    renderSecaoArtistas(){
        return `
            <article id="divArtistas" class=" accord  p0">
                <legend class="off w100 bi sombra bi-magic flex  a1 "> Artistas</legend>
                <div id="listaArtistas" class="">

                </div>
            </article>
        `
    }

    renderSecaoDisco() {
     
        return `
               <article id="listaDiscos" class="accord" >
                        <legend class="w100 off  bi bi-vinyl sombra flex gap1 a1" id="labelDiscos"> Discos</legend>
                       <div id="discos" class="p2 rad1">
                       </div>
                </article>
                `
    }

    renderSecaoFaixas(){
        return `
            <article id="discoBox" class="accord discoBox">
                <div id='contain' class="flex p2 gap justAround ">
                        <div class='grid central gap' style='height:fit-content'>
                                <img src="" class="off miniEncarte sombra" id="infoAlb" lazy="loading"/>    
                                <span id='nomeAlb'><span/>    
                        </div>
                    <div id="albSongs" class=" discoBox"></div>    
                        
                    </div>
                    
                </div>
                
            </article>
            
        `
    }

    getListas(){
        
        let userList = '';

        Object.values(this.user.getListas()).forEach(lista => {
            const obj = {'nome':lista.nome, 'btnTarget':'', 'fn':''}
            userList += this.modelBtnLista(obj);
        });


        return userList;
    }

    renderModal(){
    
        const modal = `
            <article id='listaModal' class='modal justCenter flex '>
                ${ this.getListas() }
            </article>
            `
        return modal;
        
    }

    //Logica

    //----Faixas
    async buscaFaixas(el){

        if(!this.btnAlbSongs.classList.contains('active')){
            this.actBtn(this.btnAlbSongs);
        }    

            let art = this.inputPesquisaArtista.value;
            let alb = el.id;


            
            let url = this.api.buscaFaixas(art,alb);

            console.log(alb)
            this.nomeAlb.innerText = alb;
           

            const resultado = await this.api.fecthData(url);   

            let size = window.screen.width > 768 ? 3 : 2;

            
            if(resultado){

                this.infoAlb.src = resultado.image[size]['#text']

                this.infoAlb.classList.remove('off');
                
                //

                console.log('api')

                let tracksRaw = resultado.tracks.track;
                let faixas = Array.isArray(tracksRaw) ? tracksRaw : [tracksRaw];
                
                const listaDeNomes = faixas.map(f => f.name);

                
                this.updateListaFaixas(faixas);

                //salvar album
                this.user.updateLocalAlbum(resultado);


                //salva 
                return listaDeNomes;
            }
            else{
                console.log('nada')
                document.getElementById('albSongs').innerHTML = '';
                return [];
            }
    }

    modelFaixa(data){
        let faixa = document.createElement('li');
        
        let a = document.createElement('a');

        a.innerText = data.name;
        faixa.appendChild(a); 
        faixa.classList = 'getLyric bi-book';

        return faixa;
    }

    updateListaFaixas(lista){

        document.getElementById('albSongs').innerHTML = '';
        
        lista.forEach(faixa => {
            let el = this.modelFaixa(faixa);
           
             let detail = {
                id: this.user.chavePadrao(faixa.artist.name,faixa.name),
                metodo: 'api',
                api: this.api,
                urlFoto:  this.infoAlb.src ,
                artista: faixa.artist.name,
                musica: faixa.name
            }
            
            el.addEventListener('click',()=>{
                
                //apresentar modal oferecendo opcao de salvar em lista já existente

                //abrir modal
                
                //this.listaModal.classList.remove('off')

                this.buscaLetra(el,detail);
            });
            
            if(el != 'undefined'){
                document.getElementById('albSongs').append(el);
            }
        });
    }

    //----Discos
    async buscaDiscos(){
          
        this.inputPesquisaArtista.value = event.target.id;



        //caso nao esteja ativado 
        if(!this.btnDiscog.classList.contains('active')){
            this.actBtn(this.btnDiscog);
        }

        let resultado;
        let string = this.inputPesquisaArtista.value || event.target.id;

        let url = this.api.buscaDiscos(string);
        
        //local
         if(this.user.getArts()[string]){
            
            resultado = this.user.getArts()[string];
            this.updateListaDiscos(this.user.toArray(resultado));
         }

        //via api
         else{
             resultado = await this.api.fecthData(url);

            if(resultado){

                 let collection = new Map();
                
                 resultado.album.forEach(item => {
                        let dados = {album: item.name, foto: item.image[3]['#text']}
                        collection.set(item.name, dados);
                        collection.name = string;
                  });

                this.updateListaDiscos(resultado.album);
                this.user.updateArtList(collection);

                this.limpaFaixas();

             }
    
         }
      
         
    }

    limpaFaixas(){
        
        ['miniEncarte','nomeAlb','albSongs'].forEach( id=>{
            document.getElementById(id).innerHTML = ''
        })

    }
  
    updateListaDiscos(lista){
        document.getElementById('discos').innerHTML = '';


        lista.forEach(disco => {


            let el = this.modelDisco(disco);

            el.addEventListener('click',()=>{
                const div = el.parentElement;
                div.classList.toggle('hide');
                setTimeout(
                    ()=>{
                        this.buscaFaixas(el)
                        div.classList.toggle('hide');
                    }
                    ,900
                )
            }
            );

            if(el != 'undefined'){
                document.getElementById('discos').append(el);
            }
        });
    }

    modelDisco(data){
         
        //console.log(data)
            let urlImg = data.image ? data.image[3]['#text'] : data.foto ;
          
                let img = document.createElement('img');
                img.src = urlImg;

                //verificar se a imagem é válida
                img.onerror = function() {
                    this.src = './icon192.png'; // Substitua pelo caminho da imagem padrão
                };
            
            let el = document.createElement('li');
            el.id = data.album || data.name;
            el.classList.add('disco');
            
            el.appendChild(img);



         return el;   
    }

    //----Artistas
    async buscaArtista(){
          
        //caso nao esteja ativado 
        if(!this.btnListaArt.classList.contains('active')){
            this.actBtn(this.btnListaArt);
        }
          
        let string = this.inputPesquisaArtista.value;
        let url = this.api.buscaArtista(string);

        let resultado;

        this.listaArtistas.innerHTML = '';

        //ativar o loading
        document.getElementById('logoPng').classList.remove('off');

        //busca local
        if(Object.keys(this.user.getArts()).includes(string)){
            //busca local
            let artName = this.user.getArts()[string];
            let div =  this.modelArtista(string);

            div.onclick = () => {
                console.log('clicou no artista local', div)
                this.buscaDiscos();
            };
            
            this.updateListaArtistas(div);
            document.getElementById('logoPng').classList.add('off');
            return(true)
        } 
        //busca api
        else{
             resultado = await this.api.fecthData(url);    //busca api

              if(resultado){

                    //filtragem
                    const query = resultado["opensearch:Query"].searchTerms.toLowerCase();

                    const artistas = resultado.artistmatches.artist
                        .filter(a => a.mbid && a.name.toLowerCase() === query)
                        .map(a => a.name);

                    let artName = artistas[0];

                    //modelagem
                    let div =  this.modelArtista(artName);

                    //view
                    if(typeof artName !== 'undefined'){
                        this.listaArtistas.innerHTML = '';
                        this.updateListaArtistas(div);
                    }

                    document.getElementById('logoPng').classList.add('off');
                    return true;
              }
              else{
                return false;
              }
            
        }      
    }

    modelArtista(artName, img){

        let el = document.createElement('div');

            let span = document.createElement('span');

            
            el.classList = 'banda flex ';
            
            span.innerText = artName;    
            span.id = artName;
            el.append(span);

            if(img){
                el.style.backgroundImage = `url(${img})`;
            }
            else{
                console.log('n img')
            }

        return el;
    }

    urlArt(artName){
            let arts = this.user.getArts()
            let art = (arts[artName]);
            if(art){
                
                let alb = Object.entries(art)[0];
                return alb[1].foto;
            }
            else{
                return false;
            }
    }

    updateListaArtistas(el){

            
        
            el.addEventListener('click',()=>{this.buscaDiscos()});
            //plot
            
            if(el != 'undefined'){
                this.listaArtistas.append(el);
            }
    }

    buscaLetra(el,detail){
        
        document.dispatchEvent(new CustomEvent('plotaLetra',{
            detail:detail
         }));

         document.getElementById('btnmenuA').click();
    }

    modelBtnLista(item){
           let html= 
                `<button btnTarget=${item.btnTarget} name='${item.fn}'  
                    id='${item.nome}' 
                    class='flex row btnlista ' type="button">
                    <i class="bi bi-journal-text a1"></i>
                    <span>${item.nome}</span>
                </button>`;
        return html;
    }

   

}