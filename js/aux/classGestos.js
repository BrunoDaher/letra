// Gesto.js
export default class Gestos {
 
  constructor() {
    this.initialDistance = null;
    this.isDragging = false;
    this.lastTouchX = null;
    this.dragStartX = null;
    this.dragMoved = false;
    this.dragDirection = null;
    this.documentTouchStartHandler = null;
  }

  setup(){
    
    this.initialDistance = null;

    // Vincula os métodos de evento
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);

    // Adiciona os eventos para gerenciar o toque
    this.container.addEventListener("touchstart", this.handleTouchStart);
    this.container.addEventListener("touchmove", this.handleTouchMove);
    this.container.addEventListener("touchend", this.handleTouchEnd);

    // Impede o zoom do navegador
    this.container.style.touchAction = "none";  // Desabilita o zoom e scroll nativos
  }

  setContainer(container){
    
    this.container = document.getElementById(container);
    this.setup();
  }

  // Calcula a distância entre dois toques
  getDistance(touch1, touch2) {
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Detecta o início do gesto (arrasto ou pinça)
  handleTouchStart(event) {
    // Se for um toque único, inicia arrasto horizontal
    if (event.touches.length === 1) {
      this.isDragging = true;
      this.dragStartX = event.touches[0].clientX;
      this.lastTouchX = this.dragStartX;
      this.dragMoved = false;
      this.dragDirection = null;
      return;
    }

    // Se for dois ou mais toques, inicia pinça
    if (event.touches.length >= 2) {
      this.isDragging = false;
      this.initialDistance = this.getDistance(event.touches[0], event.touches[1]);
      console.log("Início do gesto de pinça detectado");
    }
  }

  // Detecta o movimento do gesto (arrasto ou pinça)
  handleTouchMove(event) {
    // Arrasto horizontal (um dedo)
    if (event.touches.length === 1 && this.isDragging) {
      const currentX = event.touches[0].clientX;
      const dx = currentX - this.dragStartX;

      // Threshold para evitar ruído e registrar direção sem emitir ação ainda
      if (Math.abs(dx) > 10) {
        this.dragMoved = true;
        this.dragDirection = dx > 0 ? 'frente' : 'tras';
      }
      this.lastTouchX = currentX;
      return;
    }

    // Pinça (dois dedos)
    if (event.touches.length >= 2 && this.initialDistance) {
      const currentDistance = this.getDistance(event.touches[0], event.touches[1]);
      if (Math.abs(currentDistance - this.initialDistance) > 10) {
        if (currentDistance > this.initialDistance) {
          console.log('pinçamento para fora');
        } else {
          console.log('pinçamento para dentro');
        }
        this.initialDistance = currentDistance; // Atualiza referência
      }
    }
  }

  // Detecta o fim do gesto de pinça
  handleTouchEnd(event) {
    // Se não houver mais toques, reseta estados
    if (!event.touches || event.touches.length === 0) {
      // Se foi um arrasto com movimento suficiente, emitir ação no fim
      if (this.isDragging && this.dragMoved && this.dragDirection) {
        console.log(this.dragDirection);
        // Executa ações correspondentes (apertar botões)
        if (this.dragDirection === 'frente') {
          const btn = document.getElementById('btnLastSong');
          if (btn) btn.click();
        } else if (this.dragDirection === 'tras') {
          const btn = document.getElementById('btnNextSong');
          if (btn) btn.click();
        }
      }
      if (this.initialDistance) {
        console.log("Gesto de pinça finalizado.");
      }
      this.initialDistance = null;
      this.isDragging = false;
      this.lastTouchX = null;
      this.dragStartX = null;
      this.dragMoved = false;
      this.dragDirection = null;
      return;
    }

    // Se restou apenas um toque, cancela pinça e passa para arrasto
    if (event.touches.length === 1) {
      this.initialDistance = null;
      this.isDragging = true;
      this.lastTouchX = event.touches[0].clientX;
    }
  }

  // Método para destruir os listeners, se necessário
  destroy() {
    this.container.removeEventListener("touchstart", this.handleTouchStart);
    this.container.removeEventListener("touchmove", this.handleTouchMove);
    this.container.removeEventListener("touchend", this.handleTouchEnd);
    if (this.documentTouchStartHandler) {
      document.removeEventListener('touchstart', this.documentTouchStartHandler);
      this.documentTouchStartHandler = null;
    }
  }


   start(){
    // Garante que bloqueamos zoom do navegador fora de uma div específica
    this.documentTouchStartHandler = function (event) {
      if (event.touches.length > 1) {
        const zoomableDiv = document.getElementById('zoomable');
        const isInsideZoomableDiv = zoomableDiv && zoomableDiv.contains(event.target);

        if (!isInsideZoomableDiv) {
          event.preventDefault();
        }
      }
    };

    document.addEventListener('touchstart', this.documentTouchStartHandler, { passive: false });
}
}
