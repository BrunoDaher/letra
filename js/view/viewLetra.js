import Tela from "../aux/classTela.js";
class Letra extends Tela{


    constructor(user){

        super();

        this.user = user;

        let classe = this;
        this.viewName = 'menuA'

        this.seletores();
        this.garbageCollector(classe);

        //no evento é enviada a api
           document.addEventListener('plotaLetra', function(event) { // Nome corrigido aqui
              
              classe.buscaLetra(event.detail);
              
        });

    }

    changeSong(item){

        
        
        let child = this.setList.children;

        let activeId = Array.from(child).filter(item => item.className.includes('active'))[0];

        let index = Array.from(child).indexOf(activeId);

        let next = index  + 1;
        let prev = index - 1;

        if(next >= child.length){
            next = 0;
        }

        if(prev < 0){
            prev = child.length - 1;
        }
        

        child[item.value == 'Go' ? next : prev].click();

        
        setTimeout(() => {
                    this.btnSetList.click();    
                }, 400);



    }

    async buscaLetra(detail){

        
        
        try {
            // 1. Define a fonte de dados (Local ou API) de forma linear
            const song = detail.metodo == 'local' ? 
                this.user.getFaixa(detail.id)  //local
                : await detail.api.getArtMusic(detail.artista, detail.musica);//api

                
            // 2. Desestruturação para extrair o que interessa
            
            
            const { content, trackName } = song;

            // 3. Atualização única da View (independente da fonte)
            this.infoLetra.innerText = content;
            this.titulo.innerText = trackName;

            song.urlFoto = detail.urlFoto;

            // 4. Efeitos colaterais exclusivos para novos dados (API)
            if (detail.metodo !== 'local') {
                this.user.updateList(song);
                this.updateLista(this.modelMusica(detail));
            }

            
            let tam = content.split('\n').filter(linha => linha.trim() !== '').length;
            
            console.log(tam);

            if(tam > 30){
                this.colunas.value = 2;
                this.setColunas.call(this.colunas);

                //this.infoLetra.style.marginTop = '4vh';
            }
       

        } catch (error) {
            console.error("Falha ao processar música:", error);
        }
        
    }

    init(){
        this.seletores();
        this.triggers();

    }

    destroy(){

        
        if(this.menuA.innerHTML){
                this.menuA.innerHTML ='';
            //remover todos os listeners
        }
        
    }
    
    seletores(){

        //painel
        this.menuA = document.getElementById('menuA');  
        this.menuA.innerHTML = this.renderTemplate();

        //botoes
         this.btnSetList = document.getElementById('btnSetList');
         this.btnConfig = document.getElementById('btnConfig');
         this.infoLetra = document.getElementById('infoLetra');

         this.titulo = document.getElementById('titulo');

         this.setList = document.getElementById('setList');

  
        //listeners navegacao
        this.btnNextSong = document.getElementById("btnNextSong");
        this.btnLastSong = document.getElementById("btnLastSong");

     
            
        //config
        this.fonte = document.getElementById('fonte');
        this.colunas = document.getElementById('colunas');
        this.align = document.querySelectorAll('.setAlign');
        
    }

    triggers(){
        
        this.fonte.addEventListener('change',this.setFontSize);
        this.colunas.addEventListener('change',this.setColunas);
        
        this.align.forEach(btn => {
                btn.addEventListener('click',this.setAlign);
        });

        document.querySelectorAll('.btnToggle').forEach(btn => {
            btn.addEventListener('click',this.newModalGroup);
        });

        [this.btnLastSong,this.btnNextSong].forEach((item)=> {
            item.addEventListener('click',
                   ()=> this.changeSong(item));
        });

        this.refresh()
       
    }

    refresh(){
       
        let lista = this.user.getSetlist();   
        
        let obj = {};



        for(const key in lista){

            let mus = lista[key].trackName;
            let art = lista[key].artistName;
            obj.musica = mus;
            obj.artista = art;
            obj.id = key;
            obj.urlFoto = lista[key].urlFoto;

            this.updateLista(this.modelMusica(obj));
        }
 
        
    };

    renderTemplate(){
        return `
            <section>
                ${this.renderPainel()}
                ${this.renderSetlist()}
                 ${this.renderConfig()}
                ${this.renderScroll()}
            </section>`
    }

    renderPainel(){

            return `<section class="painel fundoGradiente">
                <div class="flex between alignCenter" style="padding: 0 2vh;">
                

                    <section class='flex alignCenter'>

                        <button class="btn btnToggle flex" target="setList" id="btnSetList">
                            <i id='nomeLista' class="bi bi-file-earmark-music-fill a2"></i>
                        </button> 
                        
                        <div class="reticent" style="text-align: center">
                            <label for='btnSetList' class="smallText" id="titulo" for="scroll-container" style="text-wrap-mode:nowrap;">
                            </label>
                        </div>
                        
                    </section>
                    

                    <button class="btn btnToggle flex gap1" target="asideConfig" id="btnConfig">
                        <a class="lbl">Config</a>
                        <i class="bi bi-gear a2"></i>
                    </button>
                </div>  
            </section>`;
    }
    
    renderSetlist(){
        return `<div id="setList" class="grid1 sideBox left"></div>` 
    }

    renderConfig(){
        return `
          <section id="asideConfig" class="sideBox right"  >
                
                <div id="fonteContainer" class="fonteContainer configContainer w75">
                    <label for="fonte">Fonte</label>
                    <input  target='infoLetra' type="range" class="w100" id='fonte' step="0.1" min='1.5'  max="5" value="1.5">      
                </div>
                
                <!--
                <div id="rolagem" class="fonteContainer">
                    <label for="tempo">Rolagem</label>
                    <input target="scroll-text" type="range" class="" id='velocidade' step="0.1" min='0.1'  max="10" value="0.1">
                </div>
                -->

                <div id="tabulacao" class="fonteContainer configContainer w75">
                    <label for="colunas">Colunas</label>
                    <input target="infoLetra" type="range" class="w100" value='1' id='colunas' step="1" min='1'  max="3" >
                </div>  
                
                <div class="fonteContainer configContainer w75">
                
                    <div id="alignTool" class=" flex central">
                        <button target="infoLetra" class="setAlign" value="start" > <i class="bi bi-text-left a2"></i></button> 
                        <button  target="infoLetra" class="setAlign" value="center">  <i class="bi bi-text-center a2"></i></button> 
                        <button target="infoLetra" class="setAlign" value="end">  <i class="bi bi-text-right a2"></i></button> 
                    </div> 
                 </div>
                
            </section>
        `
    }

    renderScroll(){
        return `
          <div id="scroll-container">
                <div class="slideControll">
                    <button id="btnLastSong" class="back" value="Back">
                        <i class="bi bi-caret-left-fill a4"></i>
                    </button>
                    <button id="btnNextSong" class="forward" value="Go">
                        <i class="bi bi-caret-right-fill a4"></i>
                    </button>
                </div>
                <pre id="infoLetra" class=""></pre>

            </div>`
    }

    updateLista(html){
        this.setList.append(html);
     
    }

    modelMusica(obj){

        
            const btn = document.createElement('button');
            btn.id = obj.id;
            btn.className = 'setlistItem flex pos-rel justBetween w100 gap3';
            

            // 2. Define o conteúdo interno (o visual)
            btn.innerHTML = `
                    <img src='${obj.urlFoto}' class='bw thumb'/>
                    <div class='grid txtend boxtitle'>
                        <a class="getLyric">${obj.musica}</a>
                        <a class='artlbl'>${obj.artista}</a>
                    </div>
            `;

            // 3. Atribui as funções diretamente ao evento de clique
            btn.addEventListener('click', () => {

                
                 let detail = {
                    metodo:'local',
                    id:btn.id,
                    artista:obj.artista,
                    musica:obj.musica

                }
                // 'item' aqui seria o próprio botão ou o objeto, dependendo da sua lógica
                this.toggleSib(btn); 
                this.buscaLetra(detail);
                 setTimeout(() => {
                     this.btnSetList.click();
                },400)
            });

        return btn;
        
    }

    setTime(){
        let t = this.getAttribute('target');
        let elem = document.getElementById(t);
    
        if(this.value == 0.1){
            
            elem.classList.remove('scroll-text');
            elem.classList.toggle('rollOff');
        }
        else{

            if(!elem.classList.contains('scroll-text')){
                elem.classList.add('scroll-text');
            }

            elem.style.animationDuration = 400/(this.value) + 's';
        }
    }
   
    setAlign(){
        
        let elem = document.getElementById(this.getAttribute('target'));
      //  console.log(elem.style.zoom)
        elem.style.textAlign = this.value;
    }
    
    setFontSize(){
        let elem = document.getElementById(this.getAttribute('target'));
      //  console.log(elem.style.zoom)
        elem.style.fontSize = this.value + 'vh'
    }

    setColunas(){
        let elem = document.getElementById(this.getAttribute('target'));
        
        if(this.value == 0){
            this.value = 1;
        }

        elem.style.columnCount = this.value;

    }


}

export default Letra