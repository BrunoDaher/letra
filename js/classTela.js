import Dao from "./classDao.js";

const dao = new Dao();

class Tela {

//cadastra funcoes nos elementos do menu
 nodeMenu(h){
    let nodes = h.childNodes;

    nodes.forEach(element => {
        if(element.type == 'submit' ){
            element.addEventListener("click",()=>{this.menuTree(event)});
            element.addEventListener("click",()=>{this.hideParents(element)});
        }
    });
}

 actBtn(targ){
   let isActive =  targ.classList.contains("active") ? true:false;
   
   if(!isActive){
    targ.click();
   }

 }

//exibe modal
 modal(){
    
    let div = document.getElementById(this.getAttribute('target'));
      div.classList.toggle('active');
    this.classList.toggle('active')  
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

    this.hideParents(targetMenu);
   //targetMenu.classList.add('active')
}

//oculta menus irmãos
 hideParents(menu){

        //get the other menus in the same group
    

        if(!menu){
            menu = event.target.parentNode
        }

        //console.log(menu)
        let nodes = menu.parentNode.childNodes;

        //console.log(menu)

        //hide the parents
        nodes.forEach(element => {
            if(element.nodeName == 'MENU' || element.nodeName == 'BUTTON'){
                //console.log(element.getAttribute('target') + ' <-')
                element.classList.remove('active');
            }
        });

        //show current menu
        menu.classList.add('active')
    }
    
    typing (string,div) {

    let array = string.split("");
    let timer = setInterval(fn,70);
   
    div.innerText = ``;


    function fn(){

        if (array.length > 0) {
            //vai andando pra direita
            div.innerText += array.shift();
        } else {
            clearTimeout(timer);
        }
    }
}

addToDiv(type,element,div,fn){  
    //console.log(element)
    let li = document.createElement(type);
        li.innerText = element.name;
        li.id= element.id 
        li.addEventListener('click',fn);
    
        let trash = document.createElement('button');
        trash.className = 'trash';

        trash.addEventListener('click',this.removeIt);

    div.append(li);
    li.append(trash)

    //correcao de volta para o menu
}


removeIt(){
    //div irmã
    let musId = this.parentNode;
    musId.remove();

    let lista = dao.getLocalJSON('listaLocal');

    Object.values(lista).forEach(element => {
        let id = Object.keys(element)[0];
        if(musId.id == id){
            delete lista[0];
            lista.shift();
        }
    });

    dao.saveLocalJSON('listaLocal',lista);

    }
}


export default Tela
