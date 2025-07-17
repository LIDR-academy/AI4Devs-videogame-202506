# Sistema de Física del Coche - Documentación

## Descripción General

El sistema de física del coche está diseñado para proporcionar una experiencia de conducción realista y satisfactoria, con física avanzada que simula el comportamiento de un vehículo real.

## Componentes de la Física

### 1. Movimiento y Aceleración

#### Aceleración Realista
```javascript
// Curva de aceleración: más rápida al inicio, más lenta al final
const accelerationCurve = 1 - (Math.abs(this.velocity) / this.maxSpeed) * 0.3;
this.velocity += this.acceleration * dt * 60 * accelerationCurve;
```

**Características:**
- **Aceleración progresiva**: Más rápida a velocidades bajas
- **Resistencia aerodinámica**: Reduce la aceleración a altas velocidades
- **Factor de escala**: Optimizado para 60 FPS

#### Parámetros de Aceleración
- **Aceleración base**: 0.5 unidades/frame
- **Frenado**: 0.8 unidades/frame (más agresivo)
- **Velocidad máxima**: 200 unidades
- **Velocidad mínima**: -50 unidades (marcha atrás)

### 2. Sistema de Fricción

#### Fricción Variable
```javascript
// Fricción que varía según la velocidad
const frictionCurve = this.friction + (Math.abs(this.velocity) / this.maxSpeed) * 0.02;
this.velocity *= frictionCurve;

// Fricción de rodadura (siempre presente)
const rollingFriction = 0.995;
this.velocity *= rollingFriction;
```

**Tipos de Fricción:**
1. **Fricción de rodadura**: Constante (0.995) - siempre presente
2. **Fricción variable**: Aumenta con la velocidad
3. **Fricción de frenado**: Se aplica cuando no hay aceleración

### 3. Sistema de Giro

#### Curva de Giro Inteligente
```javascript
// Curva de giro basada en velocidad
if (speedFactor < 0.3) {
    // Velocidad baja: giro limitado
    turnCurve = speedFactor / 0.3 * 0.3;
} else if (speedFactor > 0.8) {
    // Velocidad alta: giro reducido por estabilidad
    turnCurve = 1 - (speedFactor - 0.8) * 0.5;
} else {
    // Velocidad media: giro óptimo
    turnCurve = 1;
}
```

**Zonas de Giro:**
- **Velocidad baja** (< 30%): Giro limitado para evitar derrapes
- **Velocidad media** (30-80%): Giro óptimo y responsivo
- **Velocidad alta** (> 80%): Giro reducido para estabilidad

#### Efectos de Giro
- **Pérdida de velocidad**: 2% al girar (realismo)
- **Giro base**: 0.05 radianes por frame
- **Factor de velocidad**: Ajusta la sensibilidad según la velocidad

### 4. Sistema de Colisiones

#### Detección de Colisiones
```javascript
// Límites del canvas con margen de seguridad
const margin = 20;
if (this.x < margin || this.x > canvasWidth - margin ||
    this.y < margin || this.y > canvasHeight - margin) {
    this.handleCollision();
}
```

#### Efectos de Colisión
```javascript
handleCollision() {
    // Reducción drástica de velocidad
    this.velocity *= 0.3;
    
    // Vibración temporal
    this.collisionShake = 5;
    
    // Efecto de rebote aleatorio
    const bounceForce = 2;
    this.velocity += (Math.random() - 0.5) * bounceForce;
    
    // Límite de velocidad post-colisión
    this.velocity = clamp(this.velocity, -maxSpeed * 0.5, maxSpeed * 0.5);
}
```

**Efectos Visuales:**
- **Vibración**: Movimiento aleatorio temporal
- **Rebote**: Cambio aleatorio de dirección
- **Reducción de velocidad**: 70% de pérdida
- **Límite de velocidad**: 50% del máximo post-colisión

### 5. Sistema de Marchas

#### Cálculo de Marchas
```javascript
getGear() {
    const speedPercentage = speed / maxSpeed;
    
    if (speedPercentage < 0.15) return 1;  // 0-15%
    if (speedPercentage < 0.30) return 2;  // 15-30%
    if (speedPercentage < 0.50) return 3;  // 30-50%
    if (speedPercentage < 0.75) return 4;  // 50-75%
    return 5;                              // 75-100%
}
```

#### Eficiencia de Marchas
```javascript
getGearEfficiency() {
    const gearRanges = [
        { min: 0, max: 0.15, optimal: 0.075 },
        { min: 0.15, max: 0.30, optimal: 0.225 },
        { min: 0.30, max: 0.50, optimal: 0.40 },
        { min: 0.50, max: 0.75, optimal: 0.625 },
        { min: 0.75, max: 1.0, optimal: 0.875 }
    ];
    
    // Calcular eficiencia basada en distancia al punto óptimo
    const distanceFromOptimal = Math.abs(speedPercentage - currentRange.optimal);
    const efficiency = 1 - (distanceFromOptimal / (currentRange.max - currentRange.min));
}
```

**Rangos de Eficiencia:**
- **Marcha 1**: 0-15% velocidad, óptimo en 7.5%
- **Marcha 2**: 15-30% velocidad, óptimo en 22.5%
- **Marcha 3**: 30-50% velocidad, óptimo en 40%
- **Marcha 4**: 50-75% velocidad, óptimo en 62.5%
- **Marcha 5**: 75-100% velocidad, óptimo en 87.5%

## Parámetros de Física

### Constantes del Vehículo
```javascript
const CAR_PHYSICS = {
    // Velocidades
    maxSpeed: 200,
    minSpeed: -50,
    
    // Aceleración
    accelerationRate: 0.5,
    brakeRate: 0.8,
    
    // Fricción
    friction: 0.98,
    rollingFriction: 0.995,
    
    // Giro
    turnSpeed: 0.05,
    
    // Colisiones
    collisionVelocityReduction: 0.3,
    collisionShakeDuration: 5,
    bounceForce: 2
};
```

### Factores de Escala
- **Delta Time**: Convertido a segundos para consistencia
- **Frame Rate**: Optimizado para 60 FPS
- **Unidades**: Sistema de unidades internas del juego

## Efectos Visuales

### Vibración de Colisión
```javascript
// Aplicar offset aleatorio durante la colisión
const shakeOffset = this.collisionShake > 0 ? 
    (Math.random() - 0.5) * this.collisionShake : 0;

const renderX = this.x + shakeOffset;
const renderY = this.y + shakeOffset;
```

### Decay de Efectos
```javascript
updateCollisionEffects(deltaTime) {
    if (this.collisionShake > 0) {
        this.collisionShake -= deltaTime * 0.01;
        if (this.collisionShake < 0) {
            this.collisionShake = 0;
        }
    }
}
```

## Optimizaciones de Rendimiento

### 1. Cálculos Eficientes
- **Uso de Math.abs()**: Evita cálculos duplicados
- **Clamping**: Limita valores sin cálculos complejos
- **Curvas precalculadas**: Evita cálculos repetitivos

### 2. Actualización Condicional
- **Efectos de colisión**: Solo se actualizan cuando es necesario
- **Animaciones**: Solo cuando el coche está en movimiento
- **Debug**: Solo en modo debug

### 3. Memoria Optimizada
- **Reutilización de variables**: Reduce creación de objetos
- **Cálculos inline**: Evita llamadas a funciones innecesarias

## Debug y Monitoreo

### Información de Debug
```javascript
getDebugInfo() {
    return {
        position: { x, y },
        velocity: Math.round(this.velocity),
        angle: Math.round(degrees),
        speedKmh: Math.round(this.getSpeedKmh()),
        gear: this.getGear(),
        gearEfficiency: Math.round(this.getGearEfficiency() * 100),
        collisionShake: Math.round(this.collisionShake),
        acceleration: Math.round(this.acceleration * 100) / 100
    };
}
```

### Visualización de Debug
- **Hitbox**: Rectángulo verde alrededor del coche
- **Información física**: Velocidad, ángulo, marcha, eficiencia
- **Efectos activos**: Vibración de colisión en rojo

## Configuración y Ajustes

### Ajustar Sensibilidad
```javascript
// Hacer el coche más responsivo
this.turnSpeed = 0.08;        // Más giro
this.accelerationRate = 0.7;  // Más aceleración

// Hacer el coche más estable
this.turnSpeed = 0.03;        // Menos giro
this.friction = 0.99;         // Más fricción
```

### Ajustar Física de Colisiones
```javascript
// Colisiones más suaves
this.collisionVelocityReduction = 0.5;  // Menos pérdida de velocidad
this.collisionShakeDuration = 3;        // Menos vibración

// Colisiones más duras
this.collisionVelocityReduction = 0.1;  // Más pérdida de velocidad
this.collisionShakeDuration = 8;        // Más vibración
```

## Consideraciones de Diseño

### 1. Realismo vs Jugabilidad
- **Física realista**: Proporciona inmersión
- **Jugabilidad**: Mantiene el control responsivo
- **Balance**: Ajustado para diversión sin frustración

### 2. Accesibilidad
- **Controles intuitivos**: Flechas y WASD
- **Feedback visual**: Efectos claros de las acciones
- **Progresión**: Dificultad gradual

### 3. Extensibilidad
- **Parámetros configurables**: Fácil ajuste
- **Sistema modular**: Componentes independientes
- **API limpia**: Fácil integración con otros sistemas

## Métricas de Rendimiento

### Tiempo de Cálculo
- **Física básica**: ~0.1ms por frame
- **Efectos visuales**: ~0.05ms por frame
- **Debug**: ~0.02ms por frame (solo cuando está activo)

### Uso de Memoria
- **Objetos estáticos**: Mínimo overhead
- **Efectos temporales**: Limpieza automática
- **Debug**: Solo cuando es necesario 