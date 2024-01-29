class Aux{

    constructor(){

    }

     intoArray(array,elemento){
        let cont = 0;

        //verifica se existe
             array.forEach(function(element) {
                if( Object.keys(element) == elemento) {
                    //console.log(0 +  ' ja existe' )
                    cont++;
                }
            });
        
           cont = cont > 0 ? true:false
        return cont 
    
    }



}

export default Aux;