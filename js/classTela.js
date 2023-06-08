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
    this.hideParents(targetMenu);
   //targetMenu.classList.add('active')
}

//oculta menus irmãos
 hideParents(menu){
        //get the other menus in the same group
        let nodes = menu.parentNode.childNodes;

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
    let li = document.createElement(type);
        li.innerText = element.name;
        li.id= element.id
        li.addEventListener('click',fn);
    div.append(li);
    }
}

export default Tela
