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

     converterDuracaoEmSegundos(segundos, formato = 'real') {
        if (formato === 'real') {
            // Converter segundos para número real em minutos
            return segundos / 60;
        } else if (formato === 'minutosSegundos') {
            // Converter segundos para minutos e segundos
            const minutos = Math.floor(segundos / 60); // Parte inteira (minutos)
            const segundosRestantes = segundos % 60; // Resto (segundos)
            return {
                minutos: minutos,
                segundos: segundosRestantes
            };
        } else {
            throw new Error('Formato inválido. Use "real" ou "minutosSegundos".');
        }
    }

    normalize(str){
        str = str.toLowerCase();
        str = str.replaceAll(':',''); 
        str = str.replaceAll('-','');  
        str = str.replaceAll('/','-');  
        str = str.replaceAll('!','');
        //str = str.replaceAll('.','');
        str = str.replaceAll('--','*');
        str = str.replaceAll('*','');
        str = str.replaceAll('+','');
        str = str.replaceAll(',','');
        str = str.replaceAll('?','');
        str = str.replaceAll("'s",'s');
        str = str.replaceAll("'m",'m');
        str = str.replaceAll("&",'');

    //removeacentos
    str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    return str.trim();
}


}

export default Aux;