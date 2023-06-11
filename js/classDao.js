export class Dao{


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

    download() {
        let l =  this.getLocalJSON('listaLocal');
        console.log(l)
      
        this.makeFile('SetListPro.json',l);
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
            Object.keys(lista).forEach(chave => {
              //sem ser stringfy
              sessionStorage.setItem(chave,lista[chave]);    
            });
  
          }, false);
  
         // setTimeout(start,1000);
  ß
    }

}

export default Dao;