


import JsonBinService from "../services/JsonBinService.js";

class Dao extends JsonBinService{


   
  constructor(){
    super('$2b$10$pl4q33prdidrF1ECS4BFKeClGFGT8wrQR3kjdQgMjTWTDAv8kGJgK');
  }

    updateLog(){
      let users = this.getLocalJSON('userList');

      
      //this.apiCloud.saveLogCloud(users);
    }

    saveCloud(nome){
      console.log(nome)
      let conteudo =  this.getLocalJSON('listaLocal');

      //console.log(conteudo)
    
     //this.apiCloud.createBin(nome, conteudo);
    }

    async loadCloud(op){
      
      //carregnado nuvem
      if(op == 1){
        let data = await this.ler('648e2cc4b89b1e2299b0ae51');
        if(data){

          console.log(data)
          
          //this.saveLocalJSON('listaLocal',JSON.parse(this.ler('648e2cc4b89b1e2299b0ae51')));
        } // from super()

        
      
      }  
      
      else{
        //lendo usuarios
        
        this.readUsers(); //from super
      }
    }

    updateCloud(){
     // this.apiCloud.updateLog(user);
     //from super()
     try {
      this.updateBin('listaLocal');
    
      //alert('salvo')
     } catch (error) {
      //alert('erro salvar')
     }
  
    }

    saveLocalJSON (id,item){
        localStorage.setItem(id,JSON.stringify(item));
    }

    saveSessionJSON(id,item){
        sessionStorage.setItem(id,JSON.stringify(item))
    }


    getLocalJSON(id){
        return JSON.parse(localStorage.getItem(id));
    }

    getSessionJSON(id){
        return JSON.parse(sessionStorage.getItem(id));
    }


    export() {
        let l =  this.getLocalJSON('listaLocal');
        console.log(l)
      
        this.makeFile('SetListPro.json',l);
    }

    exportFile(name,obj) {
      this.makeFile(name,obj);
  }

    makeFile(name,local){
      let fileName = name;

      let a = document.createElement("a");
          document.body.appendChild(a);
          a.style = "display: none";
    
      let json = JSON.stringify(local),
          blob = new Blob([json], {type: "octet/stream"}),
          url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    }

     upload() {

          const file = this.files[0]; 
          //'input[type=file]'

          const reader = new FileReader();
      
          if (file) {
           // console.log("tem arquivo")
            reader.readAsText(file);      
            
            //let legenda = file.name.split('.')
            //document.getElementById('arquivo').innerText = legenda[0];
            //nome = legenda[0];
          }
          else{
            console.log("*arquivo não carregado!");
          }
        
          reader.addEventListener("load", function () {
            // convert image file to base64 string //preview.src = reader.result;
            let lista = JSON.parse(reader.result);

            console.log(lista)

            localStorage.setItem('listaLocal',JSON.stringify(lista));

            //salva item por item
            Object.keys(lista).forEach(function(chave) {
              //sem ser stringfy
              sessionStorage.setItem(chave,lista[chave]);    
            });
  
          }, false);
  
          setTimeout(function (){location.reload()} ,1000);

         // setTimeout(start,1000);
  
    }

}

export default Dao;