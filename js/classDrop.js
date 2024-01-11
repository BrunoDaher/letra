
class Drop {
     allowDrop(ev) {
        ev.preventDefault();
      }


      init(classe,callback,callback2){ 
     
        console.log('inicio')
        let pools = document.querySelectorAll('.dropSource');
        let dropOut = document.querySelectorAll('.dropOut')

            pools.forEach(function (element) {       
              element.addEventListener('drop',classe.drop);
              element.addEventListener('dragover',classe.allowDrop);

              //atribuir triggers
              element.childNodes[0].addEventListener('click',callback);
              element.childNodes[1].addEventListener('click',callback2);

          });
        
          dropOut.forEach(function (element) {       
              element.addEventListener('dragstart',classe.drag);
          });
        
    
      }
      
      //arrastar
       drag(ev) {

        let div = ev.target;

        //configura o dataGram
        ev.dataTransfer.setData("text", div.outerHTML); 
        ev.dataTransfer.setData("from", ev.target.id);

        console.log('drag')
        console.log(ev.dataTransfer.getData('text'))

      }
      
      //soltar
      drop(ev) {
        ev.preventDefault();
          //recebe o dataGram
        //console.log(ev.target)
        let text = ev.dataTransfer.getData("text");
        let fromId = ev.dataTransfer.getData("from");
        let fromDiv = document.getElementById(fromId);
        
        console.log('drop')
        console.log(ev.dataTransfer.getData('text'))

        //funcionando
        fromDiv.outerHTML = this.outerHTML; 
        //atribuir trigger
        //fromDiv.id = this.id;
        
        //console.log(text)
        this.outerHTML = text;
        //atribuir trigger
        //this.id = fromId;

        let listObserver = document.getElementById('listObserver');
       
       
        //remonta funcoes
        //tentar substituir por funcao unitaria
        listObserver.click();

        //cadastrar evento pra trocados
        
      
      }
}

export default Drop; 