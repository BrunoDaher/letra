

export default class viewListas{

    constructor(user){

        this.user = user;
        this.init();

    }

    observe(obj) {
        const watchedObj = Object.create(obj);
        const watch = (propName, oldValue, newValue) => {
            console.log(`A propriedade '${propName}' foi alterada de '${oldValue}' para '${newValue}'.`);
        };
        Object.keys(obj).forEach(key => {
            Object.defineProperty(watchedObj, key, {
                set: (newValue) => {
                    const oldValue = obj[key];
                    obj[key] = newValue;
                    watch(key, oldValue, newValue);
                },
                get: () => obj[key],
            });
        });
        return watchedObj;
    }


    // Identifica a alteracao de valor de uma variavel
   

    init(){
        this.seletores();
        this.triggers();
    }
    
    seletores(){
        this.menuC = document.getElementById('menuC');  
        this.menuC.innerHTML = this.renderTemplate();
    }

    triggers() {

        
        document.querySelectorAll('.btnlista').forEach((btn )=> {   
           //ENVIAR PRA O BUSCA ALBUNS
            btn.addEventListener('click',()=>{
                 const action = btn.getAttribute('action');

                 document.getElementById(action).click();
                 
                 document.dispatchEvent(new CustomEvent(`artista`, { 
                    detail:{
                        artista: btn.id,
                        from:'listas'
                    }
                }));     
            });
        });
      
    } 

    renderTemplate(){

        
      
        return `
            <article class="" style='overflow-x: scroll '>
                <section id='listas' class='wfit grid p2 gap2 '>
                    ${ this.renderListas()}
                    
                </section>

            </article>
        `
    } 

    renderAlbuns(){


        let albuns = this.user.getAlbuns();
        
        
        let div = '';

        let list = Object.entries(albuns).map(item => {
            let param = {nome: item[0], fn: 'album', action: 'btnmenuB'};
            div +=  this.modelLista(param);
        });

        return div;
    }

    renderListas(){
        

        let lista = this.modelLista({nome:'listaLocal',fn:'local','action':'btnmenuA'});

        //toDO
        //iterar storage e pra cada um, renderizar

        return lista;

    }

    renderClouds(){

        return `
        
            <article id='clouds' class="m2 p2">
                <div id="loadCloud" class="iconText flex configContainer ">
                    
                    <div id="save" class="off iconText configContainer " >
                        <input type="text" id="nomeArquivo" class="off">
                        <button target="" type="button"  id='btnSaveCloud'>
                            <i class="bi bi-journal-arrow-up a2 colorChroma"></i>
                        </button>
                        <span for="saveCloud" class="">Cloud</span>
                    </div>  
                    
                    <div class="iconText configContainer fundoGradiente rad2 p2">
                        <button target="" type="button"  id='btnLoadCloud'>
                            <i class="bi bi-cloud a3"></i>
                        </button>
                        <span>Cloud</span>
                    </div>

                    <div id="export" class="off iconText configContainer a2">
                        <button type="button"  id='btnExport'>
                            <i class="bi bi-filetype-json a3"></i>
                        </button>
                        <span for="export">Export</span>
                    </div>  
                </div>
                
                <div id="load" class="iconText configContainer" style="display: none;">
                
                <button target="dataLoad" type="button"  id='btnUpload'>
                    <i class="bi bi-cloud-arrow-up-fill a3"></i>
                </button>
                    <div hidden> 
                        <input id='inputFile' type="file">
                    </div>
                <label for="save">Load File</label>    
                </div>  
            </article>
        `
    }
    
    modelLista(item){

           let html= 
                `
                <button action=${item.action} name='${item.fn}'  
                    id='${item.nome}' 
                    class='grid  btnlista p2' type="button">
                    <i class="bi bi-music-note-list a1"></i>
                    <span>${item.nome}</span>
                </button>
            `;
         
        return html;
    }


}