// Gesto.js
export default class Gestos {
 
  constructor(container) {
    this.container = container;
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

  // Calcula a distância entre dois toques
  getDistance(touch1, touch2) {
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Detecta o início do gesto de pinça
  handleTouchStart(event) {
    if (event.touches.length === 2) {
      this.initialDistance = this.getDistance(event.touches[0], event.touches[1]);
      console.log("Início do gesto de pinça detectado");
    }
  }

  // Detecta o movimento do gesto de pinça
  handleTouchMove(event) {
    if (event.touches.length === 2 && this.initialDistance) {
      const currentDistance = this.getDistance(event.touches[0], event.touches[1]);

      // Verifica se a distância mudou, o que indica o gesto de pinça
      if (Math.abs(currentDistance - this.initialDistance) > 10) {
        alert("Gesto de pinça detectado!"); // Exibe o alerta
        this.initialDistance = currentDistance; // Atualiza a distância inicial
      }
    }
  }

  // Detecta o fim do gesto de pinça
  handleTouchEnd() {
    if (this.initialDistance) {
      console.log("Gesto de pinça finalizado.");
      this.initialDistance = null; // Reseta a distância
    }
  }

  // Método para destruir os listeners, se necessário
  destroy() {
    this.container.removeEventListener("touchstart", this.handleTouchStart);
    this.container.removeEventListener("touchmove", this.handleTouchMove);
    this.container.removeEventListener("touchend", this.handleTouchEnd);
  }


   start(){

        
        
    document.addEventListener('touchstart', function (event) {
        if (event.touches.length > 1) {
          const zoomableDiv = document.getElementById('zoomable');
          const isInsideZoomableDiv = zoomableDiv.contains(event.target);
  
          if (!isInsideZoomableDiv) {
            // Bloqueia zoom fora da div específica
            event.preventDefault();
          }
        }
      }, { passive: false });


}
}
