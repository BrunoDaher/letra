class Letra{

    constructor(){
        const tempo = document.getElementById('velocidade');
        tempo.addEventListener('change',this.setTime);

        const fonte = document.getElementById('fonte');
        fonte.addEventListener('change',this.setFontSize);
    }

    setTime(){
        let t = this.getAttribute('target');
        let elem = document.getElementById(t);
    
        if(this.value == 0.1){
            console.log('stop')
            elem.classList.remove('scroll-text')
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
        console.log(elem.style.zoom)
        elem.style.zoom = this.value
    }

}

export default Letra