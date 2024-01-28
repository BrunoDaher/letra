class Letra{

    constructor(){
       // const tempo = document.getElementById('velocidade');
       // tempo.addEventListener('change',this.setTime);

        const fonte = document.getElementById('fonte');
        fonte.addEventListener('change',this.setFontSize);

        const colunas = document.getElementById('colunas');
        colunas.addEventListener('change',this.setColunas);
    
    }

    setTime(){
        let t = this.getAttribute('target');
        let elem = document.getElementById(t);
    
        if(this.value == 0.1){
            console.log('stop')
            elem.classList.remove('scroll-text');
            elem.classList.toggle('rollOff');
        }
        else{

            if(!elem.classList.contains('scroll-text')){
                elem.classList.add('scroll-text');
            }

            elem.style.animationDuration = 400/(this.value) + 's';
        }
    }
   

    setFontSize(){
        let elem = document.getElementById(this.getAttribute('target'));
      //  console.log(elem.style.zoom)
        elem.style.fontSize = this.value + 'vh'
    }

    setColunas(){
        let elem = document.getElementById(this.getAttribute('target'));
       // console.log(elem)
        elem.style.columnCount = this.value
    }


}

export default Letra