import numpy as np
import wave

# Parámetros
duration = 0.4  # segundos
sample_rate = 44100
volume = 0.7

# Generar ruido blanco con decaimiento exponencial
t = np.linspace(0, duration, int(sample_rate * duration), False)
noise = np.random.normal(0, 1, t.shape)
envelope = np.exp(-5 * t)  # decaimiento rápido
samples = (noise * envelope * volume * 32767).astype(np.int16)

# Guardar como WAV
with wave.open('explosion.wav', 'w') as f:
    f.setnchannels(1)
    f.setsampwidth(2)
    f.setframerate(sample_rate)
    f.writeframes(samples.tobytes())
