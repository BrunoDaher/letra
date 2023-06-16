export class ApiCloud {
    
    apiKey = "$2b$10$pl4q33prdidrF1ECS4BFKeClGFGT8wrQR3kjdQgMjTWTDAv8kGJgK";

    constructor(){
       // console.log(this.apiKey)
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

      readBin() {
        
        let req = new XMLHttpRequest();

        req.onreadystatechange = () => {
          if (req.readyState == XMLHttpRequest.DONE) {
            console.log(req.responseText);
          }
        };
        
        req.open("GET", "https://api.jsonbin.io/v3/b/<BIN_ID>/<BIN_VERSION | latest>", true);
        req.setRequestHeader("X-Access-Key", this.apiKey);
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

      updateBin(binId){
            let req = new XMLHttpRequest();

            req.onreadystatechange = () => {
            if (req.readyState == XMLHttpRequest.DONE) {
                //console.log(req.responseText);
            }
            };

            req.open("PUT", "https://api.jsonbin.io/v3/b/" + binId, true);
            req.setRequestHeader("Content-Type", "application/json");
            req.setRequestHeader("X-Access-Key", this.apiKey);
            req.send('{"sample": "Hello World"}');
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

}

export default ApiCloud;