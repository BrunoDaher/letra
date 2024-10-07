import Dao from "./classDao.js";

const dao = new Dao();
let classe = null;

class Tela {
   
    constructor(){
       classe = this;
       //console.log(classe)
        //console.log(this)
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

    modelUser(dados,localUsr){

        let dataAtual = new Date();

        let agora = {
            "hash" : dataAtual.getTime(),
            "dia" : dataAtual.getDate(),
            "mes" : (dataAtual.getMonth() + 1),
            "ano" : dataAtual.getFullYear(),
            "horas" : dataAtual.getHours(),
            "minutos" : dataAtual.getMinutes()
        }

        let user = {
            "horario":[agora],
            "appCodeName":[dados.appCodeName],
            "appVersion":[dados.appVersion],
            "connection":[dados.connection],
            "geolocaation":[dados.geolocation],
            "language":[dados.language],
            "platform":[dados.language],
            "plugins":[dados.plugins],
            "userAgentData":[dados.userAgentData],
            "vendor":[dados.vendor]
        }


       

        let obj = {};

        obj = {[agora.hash]:user};


        if(localUsr) {
            localUsr[agora.hash] = obj;
        }
        else{
            localUsr = obj;
        }
    //
        return localUsr;

    }    
    //elemento menu
    nodeMenu(h){
        let nodes = h.childNodes;

        nodes.forEach(function(element)  {
            if(element.type == 'submit' ){
                element.addEventListener("click",function(){classe.menuTree()});
               element.addEventListener("click",function(){classe.hideParents(element)});
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
        
    typing (string,div) {

        let array = string.split("");
        let timer = setInterval(fn,70);
    
        div.innerText = "";

        function fn(){

            if (array.length > 0) {
                //vai andando pra direita
                div.innerText += array.shift();
            } else {
                clearTimeout(timer);
            }
        }
    }

    addToDiv(type,element,container,fn){  

        let li = document.createElement('li');
            li.innerText = element.song;
            
            //pra musicas listadas na busca  - barra lateral esquerda
            if(container.id != 'albSongs'){ 
                let div = document.createElement(type);
                    //div.className = 'grid2';
                    div.id = "div" + element.id;
                    //div.draggable = true;
                
                let btnTrash = document.createElement('button');
                    btnTrash.className = 'trash';
                    btnTrash.addEventListener('click',this.removeIt);
                
                    li.id= element.id 
                    li.addEventListener('click',hideParents);

                    div.append(li);
                    div.append(btnTrash);
                    container.append(div);
            }
            else{
                container.append(li);
            }

            li.addEventListener('click',fn);

        function hideParents(){
            let arrAvo = this.parentNode.parentNode;
            let nodes = arrAvo.childNodes;
                nodes.forEach(function(element) {
                    element.childNodes[0].classList.remove('active');
                });
            this.classList.add('active')
        }
    }

    removeIt(e){
        let item = this?this: e.target;
        console.log('Removendo: ')
     
        let musId = (this.parentNode.id).replaceAll('div','');  
        let lista = dao.getLocalJSON('listaLocal');

        console.log(lista)

        Object.values(lista).forEach(function(element) {
            let id = Object.keys(element)[0];
            
            if(musId == id){
                console.log(id)
                lista.splice(lista.indexOf(element),1)
                dao.saveLocalJSON('listaLocal',lista);
                    item.parentNode.remove();
            }
        });

        }

    animateBar(){
        let bar = document.getElementById('myProgress');
        bar.classList.toggle('on');
        let i = 0;
            if (i == 0) {
                i = 1;
                let elem = document.getElementById("myBar");
                let width = 1;
                let id = setInterval(frame, 12);
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

}

export default Tela
