

class User {

    
    constructor(id){

        this.jsonbinID =  "6521d2c054105e766fbf35e8";   
        this.userId = 0;
        this.listaDeMusicas;

       this.setId(id);
        
    }

    listaDeMusicas = [];
    listaDeArtistas = [];
    

    setId(id){
        this.userId = id;
    }

    getId(){
       return this.userId;
    }

    setLista(lista){
        console.log('lista')
        this.listaDeMusicas = lista;
    }

    getLista(){
        return this.listaDeMusicas;
    }


    modelLista(lista){

        return `   
                <div id="${lista.id}" class="listaCard central fundoGradiente">
                    <div class="card-body">
                        <h5 class="card-title">${lista.nome}</h5>
                    </div>
                </div>`
    }

    
}

export default User;