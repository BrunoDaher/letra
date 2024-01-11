class Slider{

    swippe = {

        x : 0,
        y : 0,
        xfinal : 0,
        yfinal : 0,
        mov : false,
      
        calc (e,handler){
            this.mov = !this.mov;
            let scrollYmin;            
                if(e.type == 'touchstart'){                    
                    this.xfinal=0;            
                    this.y = e.changedTouches[0].clientY;
                    this.x = e.changedTouches[0].clientX;
                }
                else if(e.type == 'touchend'){
                    this.yfinal = e.changedTouches[0].clientY;
                    this. xfinal = e.changedTouches[0].clientX;          
                    let deltaY  = parseFloat( this.yfinal) - parseFloat( this.y);                             
                    let deltaX = Math.abs(parseFloat( this.xfinal) - parseFloat( this.x));                               
                    scrollYmin = (deltaY < 20 && deltaY > -20) ? true:false;
             /*            console.log('y'+deltaY + " x" + deltaX)
                        console.log(scrollY) */
                    if(scrollYmin && deltaX > 0){
                    
                    handler(this.x >  this.xfinal ? 1:-1);                                  
                      // console.log(this.x >  this.xfinal ? 1:-1)           
                    } 
    
                    return scrollY;
                }
          }
        
        }

}

export default Slider;
