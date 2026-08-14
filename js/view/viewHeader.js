import  Tela from "../aux/classTela.js";
export default class ViewHeader extends Tela{

     
    constructor(){

        super();
        
        this.seletores();
        this.triggers();

    }

    seletores(){
        this.mainHeader =  document.getElementById('mainHeader');
        this.mainHeader.innerHTML = this.renderTemplate();


        this.btnMenuA = document.getElementById('btnmenuA');
        this.btnMenuB = document.getElementById('btnmenuB');
        this.btnMenuC = document.getElementById('btnmenuC');

        this.btnsMenu = [this.btnMenuA, this.btnMenuB, this.btnMenuC];  

    }
    
     triggers(){

        this.nodeMenu(this.mainHeader);

        this.btnsMenu.forEach(btn => {
            btn.addEventListener('click', (event) => {
                const target = btn.getAttribute('target');
                document.dispatchEvent(new CustomEvent(`view`, { detail: target }));
            });
        }); 

       setTimeout(() => {
            this.actBtn(this.btnMenuB);
       }, 400);
        
    }
    renderTemplate(){
        
        return `
            <button id="btnmenuC" target="menuC"  class="btn modalGroup">
                    <i class="bi bi-music-note-list a2"></i>
                    <span>Listas</span>
                </button>
                
                <button  id="btnmenuB" target="menuB"  class="btn modalGroup">
                    <i class="bi bi-search a2"></i>
                    <a>Albuns</a>
                </button>
                
                <button id="btnmenuA" target="menuA" class="btn modalGroup">
                    <i class="bi bi-file-text a2"></i>
                    <span>Letra</span>
                </button>
            `
        
    }
    
    
    renderButton(data){
        
        return 
            `
            <button id="${data.id}" target="${data.target}"  class="btn">
                <i class="bi ${data.icon} a2"></i>
                <a>${data.label}</a>
            </button>`
    }


   

}