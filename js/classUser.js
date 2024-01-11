

class User {

    jsonbinID =  "6521d2c054105e766fbf35e8";   
    userId = 0;
    listaDeMusicas;
    
    constructor(id){
       this.setId(id)
    }

    setId(id){
        this.userId = id;
    }

    getId(){
       return this.userId;
    }

    setLista(lista){
        this.listaDeMusicas = lista;
    }

    getLista(){
        return this.listaDeMusicas;
    }


    
}

export default User;