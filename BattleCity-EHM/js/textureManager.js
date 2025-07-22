class TextureManager {
    constructor() {
        this.textures = {};
        this.loadedCount = 0;
        this.totalTextures = 0;
        this.onAllTexturesLoaded = null;
    }

    loadTexture(name, url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            img.onload = () => {
                this.textures[name] = img;
                this.loadedCount++;
                console.log(`Texture loaded: ${name} (${this.loadedCount}/${this.totalTextures})`);
                
                // Actualizar barra de carga
                this.updateLoadingBar();
                
                if (this.loadedCount === this.totalTextures && this.onAllTexturesLoaded) {
                    this.onAllTexturesLoaded();
                }
                resolve(img);
            };
            
            img.onerror = () => {
                console.warn(`Failed to load texture: ${name} from ${url}`);
                // Crear una textura de fallback
                this.textures[name] = this.createFallbackTexture(name);
                this.loadedCount++;
                
                // Actualizar barra de carga
                this.updateLoadingBar();
                
                if (this.loadedCount === this.totalTextures && this.onAllTexturesLoaded) {
                    this.onAllTexturesLoaded();
                }
                resolve(this.textures[name]);
            };
            
            img.src = url;
        });
    }

    updateLoadingBar() {
        const progress = (this.loadedCount / this.totalTextures) * 100;
        const loadingBar = document.getElementById('loadingBar');
        if (loadingBar) {
            loadingBar.style.width = progress + '%';
        }
        
        if (this.loadedCount === this.totalTextures) {
            setTimeout(() => {
                const loadingScreen = document.getElementById('loadingScreen');
                if (loadingScreen) {
                    loadingScreen.style.display = 'none';
                }
            }, 500);
        }
    }

    createFallbackTexture(name) {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        
        switch(name) {
            case 'brick':
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(0, 0, 32, 32);
                ctx.fillStyle = '#A0522D';
                for(let i = 0; i < 32; i += 4) {
                    for(let j = 0; j < 32; j += 4) {
                        if((i + j) % 8 === 0) {
                            ctx.fillRect(i, j, 2, 2);
                        }
                    }
                }
                break;
            case 'steel':
                ctx.fillStyle = '#C0C0C0';
                ctx.fillRect(0, 0, 32, 32);
                ctx.fillStyle = '#A0A0A0';
                for(let i = 0; i < 32; i += 8) {
                    ctx.fillRect(i, 0, 1, 32);
                    ctx.fillRect(0, i, 32, 1);
                }
                break;
            case 'water':
                ctx.fillStyle = '#0080ff';
                ctx.fillRect(0, 0, 32, 32);
                ctx.fillStyle = '#4da6ff';
                for(let i = 0; i < 32; i += 4) {
                    for(let j = 0; j < 32; j += 8) {
                        ctx.fillRect(i, j, 2, 4);
                    }
                }
                break;
            case 'trees':
                ctx.fillStyle = '#228B22';
                ctx.fillRect(0, 0, 32, 32);
                ctx.fillStyle = '#32CD32';
                for(let i = 0; i < 32; i += 6) {
                    for(let j = 0; j < 32; j += 6) {
                        ctx.beginPath();
                        ctx.arc(i + 3, j + 3, 2, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
                break;
            case 'base':
                ctx.fillStyle = '#FFD700';
                ctx.fillRect(0, 0, 32, 32);
                ctx.fillStyle = '#FFA500';
                ctx.beginPath();
                ctx.moveTo(16, 4);
                ctx.lineTo(28, 16);
                ctx.lineTo(22, 16);
                ctx.lineTo(22, 28);
                ctx.lineTo(10, 28);
                ctx.lineTo(10, 16);
                ctx.lineTo(4, 16);
                ctx.closePath();
                ctx.fill();
                break;
            default:
                ctx.fillStyle = '#ff00ff'; // Magenta para texturas no encontradas
                ctx.fillRect(0, 0, 32, 32);
        }
        
        return canvas;
    }

    async loadAllTextures() {
        const textureUrls = {
            'brick': 'https://st4.depositphotos.com/38923194/39624/i/450/depositphotos_396247220-stock-photo-pixel-art-brick-wall-texture.jpg',
            'steel': 'https://st.depositphotos.com/1011833/2516/i/950/depositphotos_25160547-stock-photo-metal-texture-steel-plate-background.jpg',
            'water': 'https://jooinn.com/images/blue-water-texture-1.jpg',
            'trees': 'https://media.istockphoto.com/id/186044156/es/foto/moss-textura.jpg?b=1&s=170667a&w=0&k=20&c=p9-xdF-B1O7Gufx_CEbfIQRrDk2FkaRkO8a5faY4Rdk=',
            'base': 'https://thumbs.dreamstime.com/z/pent%C3%A1gono-76819169.jpg'
        };

        this.totalTextures = Object.keys(textureUrls).length;
        
        const loadPromises = Object.entries(textureUrls).map(([name, url]) => 
            this.loadTexture(name, url)
        );

        try {
            await Promise.all(loadPromises);
            console.log('All textures loaded successfully!');
        } catch (error) {
            console.warn('Some textures failed to load, using fallbacks');
        }
    }

    getTexture(name) {
        return this.textures[name] || this.createFallbackTexture(name);
    }

    drawTexturedTile(ctx, textureName, x, y, size = 32) {
        const texture = this.getTexture(textureName);
        ctx.drawImage(texture, x, y, size, size);
    }

    createPattern(ctx, textureName) {
        const texture = this.getTexture(textureName);
        return ctx.createPattern(texture, 'repeat');
    }
}

// Instancia global del gestor de texturas
const textureManager = new TextureManager();
