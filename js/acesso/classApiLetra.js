


import apiGSE from './classApiGSE.js';


//const url = 
export default class apiLetra {

    constructor(){
      
        this.motorGSE = new apiGSE({
            apiKey: 'AIzaSyDr0frs3E6bDroBl09Gw4zVOO-VUjh5Ag0', // Pode deixar vazio se for usar só o LRCLIB
            cx: '33a78946579874d0d'
        });
      
    }


    async  carregarMusica(artist, track) {
    try {
        const resultado = await this.motorGSE.search(artist, track);
        
        console.log(`Letra obtida via: ${resultado.engine}`);

        return resultado;
        
        
    } catch (erro) {
        console.error("Ops:", erro.message);
    }
}
    


 }

