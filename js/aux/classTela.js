
let classe = null;

import Gestos from "./classGestos.js";

class Tela {
   
    constructor(dao){
        this.dao = dao;
       classe = this;

       this.gestos = new Gestos();
       //this.gestos.setContainer('scroll-container');
       
    }

    getSizes(){
        let tela =  window.screen;
        console.log(tela)
    }

    garbageCollector(classe){
        
         document.addEventListener('view', (detail)=> { // Nome corrigido aqui

            if(detail.detail === classe.viewName) { // Verifique se o evento é para menuB
                classe.init(); // Chame o método init da classe viewAlbuns
            }
            else{
                classe.destroy();
            }
            
        });
    }

    getInfoMus(){
        return document.getElementById('infoMus');
    }
    
    newModal(elem){

        //ternario
        elem = elem.type == 'click' ? this:elem;

        let target = elem.getAttribute('target');
            target = document.getElementById(target)

        elem.classList.toggle('active');
        target.classList.toggle('active');
    }

    newModalGroup(){
        let acestral = this.parentNode;
    
        let nodes = Array.from(acestral.childNodes).filter(function(elemento) {
            return elemento.nodeName.toLowerCase() === 'button';
        });

        let btn = this;

        //inativa botoes do mesmo container
        //inativa os respectivos targets
            nodes.forEach(function(elem) {
                if(elem != btn){
                    elem.classList.remove('active');
                    let targetView = elem.getAttribute('target');
                        targetView = document.getElementById(targetView);
                        targetView.classList.remove('active');
                }
            });
        //toggle de si e do seu target
        classe.newModal(this)
    }   
    //elemento menu
    nodeMenu(h){
        let nodes = h.childNodes;

        nodes.forEach(function(element)  {
            if(element.type == 'submit' ){
                element.addEventListener("click",function(){classe.menuTree()});
               element.addEventListener("click",function(){classe.hideInlineSib(element)});
            }
        });
    }

    actBtn(targ){
    let isActive =  targ.classList.contains("active") ? true:false;
    
        if(!isActive){
            targ.click();
         }
    }

    //ativa o corrente e oculta menus irmãos
    menuTree(){
    
        let btn =  (event.target)
        let target = btn.parentNode.getAttribute('target');    
        let targetMenu = document.getElementById(target);

        //console.log(target)

        if(!targetMenu){
            target = event.target.getAttribute('target');
            targetMenu = document.getElementById(target);
        }

        this.hideInlineSib(targetMenu);
    //targetMenu.classList.add('active')
    }

    //oculta menus irmãos
    hideInlineSib(menu){

            //get the other menus in the same group
        let nodes = '';
            //quando clicado
         if(menu.target){
           
            nodes = menu.target.parentNode.parentNode.childNodes;

            //
            menu = menu.target.parentNode;
           
            
            nodes = Array.from(nodes).filter(function(elemento) {
                return elemento.nodeName.toLowerCase() === 'button';
            });
          }
          else{
            nodes = menu.parentNode.childNodes;
          }
           
            //hide the parents
            nodes.forEach(function(element) {
                if(element.nodeName == 'MENU' || element.nodeName == 'BUTTON'){
                    //console.log(element.getAttribute('target') + ' <-')
                    element.classList.remove('active');
                }
            });

            //show current menu
            menu.classList.add('active')
    }

    toggleSib(item){
            document.querySelectorAll('.setlistItem').forEach(item => {
            item.classList.remove('active');
        })
        item.classList.add('active');
    }
        
    animateBar(){
        let bar = document.getElementById('myProgress');
        bar.classList.toggle('on');
        let i = 0;
            if (i == 0) {
                i = 1;
                let elem = document.getElementById("myBar");
                let width = 1;
                let id = setInterval(frame, 7);
                function frame() {
                if (width >= 100) {
                    clearInterval(id);
                    i = 0;
                } else {
                    width++;
                    elem.style.width = width + "%";
                }
            }
            }
    }


    dragDrop(div){
        new DragAndDrop(div, {
        onDragStart: (event) => {
          console.log(`Início do drag para o item: ${event.target.textContent}`);
        },
        onDrop: (event, item) => {
          console.log(`Item "${item.textContent}" foi solto.`);
        },
      });
    }
}

export default Tela
