// Script para manejo de responsive design del canvas
class CanvasResizer {
    constructor(canvas) {
        this.canvas = canvas;
        this.container = canvas.parentElement;
        this.baseWidth = GAME_CONFIG.CANVAS_WIDTH;   // 832px (26 tiles * 32px)
        this.baseHeight = GAME_CONFIG.CANVAS_HEIGHT; // 832px (26 tiles * 32px)
        this.maxScaleFactor = 2.0; // Permitir hasta 2x el tamaño original
        this.minScaleFactor = 0.3; // Tamaño mínimo
        
        this.initializeResizer();
    }

    initializeResizer() {
        // Establecer el observer para cambios en el contenedor
        if (window.ResizeObserver) {
            this.resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    this.adjustCanvasSize();
                }
            });
            
            if (this.container) {
                this.resizeObserver.observe(this.container);
            }
        }
        
        // Listener para cambios de orientación
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.adjustCanvasSize(), 100);
        });
        
        // Ajuste inicial
        this.adjustCanvasSize();
    }

    adjustCanvasSize() {
        if (!this.container) return;
        
        const containerRect = this.container.getBoundingClientRect();
        const availableWidth = containerRect.width - 10; // Margen mínimo
        const availableHeight = containerRect.height - 50; // Espacio para header
        
        // Calcular el factor de escala manteniendo la proporción
        const scaleX = availableWidth / this.baseWidth;
        const scaleY = availableHeight / this.baseHeight;
        let scale = Math.min(scaleX, scaleY);
        
        // Aplicar límites de escala
        scale = Math.max(this.minScaleFactor, Math.min(scale, this.maxScaleFactor));
        
        // Aplicar el tamaño calculado
        const newWidth = Math.floor(this.baseWidth * scale);
        const newHeight = Math.floor(this.baseHeight * scale);
        
        // Aplicar vía CSS para mantener la calidad
        this.canvas.style.width = `${newWidth}px`;
        this.canvas.style.height = `${newHeight}px`;
        
        console.log(`Canvas redimensionado: ${newWidth}x${newHeight} (escala: ${scale.toFixed(2)})`);
        console.log(`Disponible: ${availableWidth}x${availableHeight}, Base: ${this.baseWidth}x${this.baseHeight}`);
    }

    ensureCanvasContainment() {
        // Esta función ya no es necesaria porque adjustCanvasSize 
        // calcula correctamente el tamaño dentro de los límites
        return;
    }

    getCanvasScale() {
        const canvasRect = this.canvas.getBoundingClientRect();
        return canvasRect.width / this.baseWidth;
    }

    destroy() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
    }
}

// Función para inicializar el resizer cuando el DOM esté listo
function initializeCanvasResizer() {
    const canvas = document.getElementById('gameCanvas');
    if (canvas) {
        window.canvasResizer = new CanvasResizer(canvas);
        console.log('CanvasResizer inicializado');
    } else {
        console.warn('Canvas no encontrado para inicializar resizer');
    }
}

// Auto-inicializar deshabilitado para evitar conflictos
// El Game class se encargará de inicializar el resizer
/*
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCanvasResizer);
} else {
    initializeCanvasResizer();
}
*/

// Hacer la clase disponible globalmente
window.CanvasResizer = CanvasResizer;
