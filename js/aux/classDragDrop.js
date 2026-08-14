class DragAndDrop {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`Elemento com ID "${containerId}" não encontrado.`);
    }

    this.options = {
      draggableSelector: 'span',
      onDragStart: null,
      onDrop: null,
      ...options,
    };

    this.init();
  }

  init() {
    const items = this.container.querySelectorAll(this.options.draggableSelector);
    items.forEach((item) => {
      item.setAttribute('draggable', 'true');

      // Início do arrasto
      item.addEventListener('dragstart', (event) => {
        event.target.classList.add('dragging');
        event.dataTransfer.setData('text/plain', event.target.id);
        if (this.options.onDragStart) this.options.onDragStart(event);
      });

      // Fim do arrasto
      item.addEventListener('dragend', (event) => {
        const dragging = this.container.querySelector('.dragging');
        const afterElement = this.getDragAfterElement(event);

        // Inserir antes ou no final
        if (afterElement) {
          this.container.insertBefore(dragging, afterElement);
        } else {
          this.container.appendChild(dragging);
        }
        dragging.classList.remove('dragging');
      });
    });

    this.container.addEventListener('dragover', (event) => {
      event.preventDefault();
    });

    this.container.addEventListener('drop', (event) => {
      event.preventDefault();
      const id = event.dataTransfer.getData('text/plain');
      const draggedElement = document.getElementById(id);

      if (this.options.onDrop) this.options.onDrop(event, draggedElement);
    });
  }

  getDragAfterElement(event) {
    const draggableElements = [...this.container.querySelectorAll(':scope > span:not(.dragging)')];
    const cursorY = event.clientY;

    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = cursorY - box.top - box.height / 2;

      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY, element: null }).element;
  }
}

export default DragAndDrop;
