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

    

}

export default Dao;