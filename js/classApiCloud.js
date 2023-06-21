export class ApiCloud {
    
    apiKey = "$2b$10$pl4q33prdidrF1ECS4BFKeClGFGT8wrQR3kjdQgMjTWTDAv8kGJgK";
    binId = "648e2cc4b89b1e2299b0ae51";
    binUsers =  "6492524e8e4aa6225eb1b6c2";


    constructor(dao){
       this.dao = dao;
    }


      updateLog(user){
        let req = new XMLHttpRequest();

  
        req.onreadystatechange = () => {
        if (req.readyState == XMLHttpRequest.DONE) {
          let dados  = JSON.parse(req.responseText);
            
          // console.log(JSON.parse(dados.record));
           this.dao.saveLocalJSON('userList',dados.record);
        }
        };

        req.open("PUT", "https://api.jsonbin.io/v3/b/" + this.binUsers, true);
        req.setRequestHeader("Content-Type", "application/json");
        req.setRequestHeader("X-Access-Key", this.apiKey);
        req.send(JSON.stringify(user));
      }

      createBin(nome,conteudo){
          let req = new XMLHttpRequest();
    
          req.onreadystatechange = () => {
            if (req.readyState == XMLHttpRequest.DONE) {
              //console.log(req.getRequestHEader("X-Bin-Name"));
            //console.log('listaGravada');
            console.log(JSON.parse(req.responseText.metadata));
          
            }
          };
      
            
          req.open("POST", "https://api.jsonbin.io/v3/b", true);
          req.setRequestHeader("Content-Type", "application/json");
          req.setRequestHeader("X-Access-Key", this.apiKey);
          req.setRequestHeader("X-Bin-Name", nome);
          req.send(JSON.stringify(conteudo));
          
      }

      readList() {
    
        let req = new XMLHttpRequest();

        req.onreadystatechange = () => {
          if (req.readyState == XMLHttpRequest.DONE) {
            let dados  = JSON.parse(req.responseText);
            //console.log(dados)
              this.dao.saveLocalJSON('listaLocal',dados.record);
              alert('Dados carregados com sucesso');
              setTimeout(()=>{location.reload()},400)
          }
          else{
            return false
          }
        };
        
        req.open("GET", "https://api.jsonbin.io/v3/b/"+ this.binId, true);
        req.setRequestHeader("X-Access-Key", this.apiKey);
        req.send();  
      }

      readUsers() {
        
        let req = new XMLHttpRequest();

        req.onreadystatechange = () => {
          if (req.readyState == XMLHttpRequest.DONE) {
            let dados  = JSON.parse(req.responseText);
            
          // console.log(JSON.parse(dados.record));
           this.dao.saveLocalJSON('userList',dados.record);
            
          }
          else{
            return false
          }
        };
        
        req.open("GET", "https://api.jsonbin.io/v3/b/"+ this.binUsers, true);
        req.setRequestHeader("X-Access-Key", this.apiKey);
        req.send();  
      }

      updateBin(){
            let req = new XMLHttpRequest();

            let listaLocal = this.dao.getLocalJSON('listaLocal');

            req.onreadystatechange = () => {
            if (req.readyState == XMLHttpRequest.DONE) {
                //console.log(req.responseText);
            }
            };

            req.open("PUT", "https://api.jsonbin.io/v3/b/" + this.binId, true);
            req.setRequestHeader("Content-Type", "application/json");
            req.setRequestHeader("X-Access-Key", this.apiKey);
            req.send(JSON.stringify(listaLocal));
      }
    
      deleteBin(){
        let req = new XMLHttpRequest();

        req.onreadystatechange = () => {
        if (req.readyState == XMLHttpRequest.DONE) {
            console.log(req.responseText);
        }
        };

        req.open("DELETE", "https://api.jsonbin.io/v3/b/<BIN_ID>", true);
        req.setRequestHeader("X-Master-Key", this.apiKey);
        req.send();
      }

      getCollection(idCollection){
        let req = new XMLHttpRequest();

        req.onreadystatechange = () => {
        if (req.readyState == XMLHttpRequest.DONE) {
            console.log(req.responseText);
        }
        };

        req.open("GET", "https://api.jsonbin.io/v3/c/"+ idCollection, true);
        req.setRequestHeader("X-Master-Key", "<YOUR_API_KEY>");
        req.send();
      }

      addBinToCollection(){
        let req = new XMLHttpRequest();

        req.onreadystatechange = () => {
        if (req.readyState == XMLHttpRequest.DONE) {
            console.log(req.responseText);
        }
        };

        req.open("PUT", "https://api.jsonbin.io/v3/c/<COLLECTION_ID>/schemadoc/add", true);
        req.setRequestHeader("X-Schema-Doc-Id", "<SCHEMA_DOC_ID>");
        req.setRequestHeader("X-Access-Key", "<YOUR_API_KEY>");
        req.send();
      }

}

export default ApiCloud;