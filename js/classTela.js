import Dao from "./classDao.js";

const dao = new Dao();

class Tela {

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

    addToDiv(type,element,container,fn){  
        
    // console.log('plotandoNa ' + element.name +  'lista lateral')

    // console.log(element)
        
        let li = document.createElement('li');
            li.innerText = element.name;
            
            //pra musicas listadas na busca mista - barra lateral esquerda
            if(container.id != 'musicas'){ 
                let div = document.createElement(type);
                div.className = 'grid2';
                
                let btnTrash = document.createElement('button');
                    btnTrash.className = 'trash';
                btnTrash.addEventListener('click',this.removeIt);

                div.id = "div" + element.id;    
                
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

        nodes.forEach(element => {
            element.childNodes[0].classList.remove('active');
        });

        this.classList.add('active')

        }
    }

    removeIt(){

        console.log('Removendo: ')
        //console.log(this.parentNode.id)
        //console.log(event.target.parentNode.id);

        
        //div irmã
        let musId = (this.parentNode.id).replaceAll('div','');  
        let lista = dao.getLocalJSON('listaLocal');

        //console.log(musId + '-> '+ this.innerText)
        //console.log(this.parentNode.childNodes[0])

        Object.values(lista).forEach(element => {
            let id = Object.keys(element)[0];
            
            if(musId == id){
                //console.log(musId + ' ' + id );
                lista.splice(lista.indexOf(element),1)
            // console.log(lista)
                //lista.shift();
                dao.saveLocalJSON('listaLocal',lista);
                this.parentNode.remove();
            }
        });

    //        dao.saveLocalJSON('listaLocal',lista);

        }

    animateBar(){
        let bar = document.getElementById('myProgress');
        bar.classList.toggle('on');
        let i = 0;
            if (i == 0) {
                i = 1;
                let elem = document.getElementById("myBar");
                let width = 1;
                let id = setInterval(frame, 10);
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
