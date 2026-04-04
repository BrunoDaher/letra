
function isStored(id){    
    return sessionStorage.getItem(id) ? true:false;
}

function resetById(id){
    let arr = [];
    sessionStorage.setItem(id,JSON.stringify(arr));
}

function clone(nome,id){
    sessionStorage.setItem(nome,sessionStorage.getItem(id));
}

function getDataJSON(id){
    return sessionStorage.getItem(id) ? JSON.parse(sessionStorage.getItem(id)): null;
}

function setDataJSON(id,data){
    sessionStorage.setItem(id , JSON.stringify(data));
}

function existsOn(elem,id){    
    let nts = sessionStorage.getItem(id);
    return nts.includes(elem) ? true:false;
}

function remove(id){    
    sessionStorage.removeItem(id);
}

//incrementa array
function toggleArray(id,elem){            
    
    let saved = getDataJSON(id);
    //
    let arr =  saved ?  saved: [];
    
    console.log(id)

    //add se não existir
    arr.includes(elem) ? arr.splice(arr.indexOf(elem),1) : arr.push(elem);
    
    //grava
    setDataJSON(id,arr);

    console.log(arr)
}


//listeners

function exportData(){

    //console.log(Object.keys(local));

    let objetos = [];

    Object.keys(sessionStorage).forEach(function(element){
        //console.log(element)
        objetos[element] = sessionStorage.getItem(element);
    });


    makeFile('aluno.json',sessionStorage);
    
}


function makeFile(name,sessionStorage){
  let fileName = name;

  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";


  var json = JSON.stringify(sessionStorage),
      blob = new Blob([json], {type: "octet/stream"}),
      url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
}


function restart(){
  //console.log(Object.keys(local));

  let objetos = [];

  let mem = document.getElementById('memoria').innerHTML =  '' 

  Object.keys(sessionStorage).forEach(function(element) {
      // console.log(element)
      //document.getElementById(element).remove();
      remove(element);
      //remove(local);
  });

  document.getElementById('salvos').innerHTML = '';

  //loadSlot();
}

//problema com timer por conta da velocidade do Reader
function upload() {
  //estart(); 
  restart();

    //const preview = document.querySelector('img');
    const file = document.querySelector('input[type=file]').files[0]; //'input[type=file]'
    const reader = new FileReader();

    let nome;

    if (file) {
      // console.log("tem arquivo")
      reader.readAsText(file);      
      
      let legenda = file.name.split('.')
      document.getElementById('arquivo').innerText = legenda[0];
      nome = legenda[0];
    }
    else{
      console.log("*arquivo não carregado!");
    }
  
    reader.addEventListener("load", function () {
      // convert image file to base64 string //preview.src = reader.result;
      let lista = JSON.parse(reader.result);

      setTimeout(function()
      {
          let salvos = getDataJSON("salvos");          
      },1000)
  
      //salva item por item
      Object.keys(lista).forEach(function(chave) {
        //sem ser stringfy
        sessionStorage.setItem(chave,lista[chave]);    
      });

    }, false);

    setTimeout(start,1000);

}