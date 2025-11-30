/* ECOPOWER PLANT LOGIC */

// 1. Elementos del DOM
const sunSlider = document.getElementById('sun-slider');
const sunVal = document.getElementById('sun-val');
const sunElement = document.getElementById('sun');
const solarKw = document.getElementById('solar-kw');

const windSlider = document.getElementById('wind-slider');
const windVal = document.getElementById('wind-val');
const turbineElement = document.getElementById('turbine');
const windKw = document.getElementById('wind-kw');

const totalKw = document.getElementById('total-kw');
const energyBar = document.getElementById('energy-bar');
const statusMsg = document.getElementById('status-msg');

// 2. Factores de conversión (Matemáticas simples)
const SOLAR_FACTOR = 0.5; // 1% de sol = 0.5 kW
const WIND_FACTOR = 0.8;  // 1 km/h viento = 0.8 kW

// 3. Función Principal
function calculateEnergy() {
    // Leer valores
    let sunInput = parseInt(sunSlider.value);
    let windInput = parseInt(windSlider.value);

    // Actualizar textos de los sliders
    sunVal.innerText = sunInput;
    windVal.innerText = windInput;

    // --- LÓGICA SOLAR ---
    let solarProd = (sunInput * SOLAR_FACTOR).toFixed(1);
    solarKw.innerText = solarProd;
    
    // Animación visual del sol (Opacidad y Sombra)
    sunElement.style.opacity = 0.3 + (sunInput / 150); 
    sunElement.style.boxShadow = `0 0 ${sunInput / 2}px #fdd835`;

    // --- LÓGICA EÓLICA ---
    let windProd = (windInput * WIND_FACTOR).toFixed(1);
    windKw.innerText = windProd;

    // Animación visual del molino (Velocidad de giro)
    if (windInput > 0) {
        // Cuanto más viento, menos tiempo dura una vuelta (gira más rápido)
        // Fórmula: 3s (lento) -> 0.2s (rápido)
        let speed = 3 - (windInput / 35); 
        if (speed < 0.2) speed = 0.2; // Límite de velocidad
        
        turbineElement.style.animation = `spin ${speed}s linear infinite`;
    } else {
        turbineElement.style.animation = 'none'; // Parar si es 0
    }

    // --- TOTALES ---
    let total = parseFloat(solarProd) + parseFloat(windProd);
    totalKw.innerText = total.toFixed(1);

    // Barra de progreso (Máximo estimado 130 kW para el 100%)
    let percentage = (total / 130) * 100;
    if (percentage > 100) percentage = 100;
    energyBar.style.width = `${percentage}%`;

    // Mensajes de estado
    if (total === 0) {
        statusMsg.innerText = "System Offline";
        statusMsg.style.color = "#777";
    } else if (total < 50) {
        statusMsg.innerText = "Low Production";
        statusMsg.style.color = "#e67e22";
    } else {
        statusMsg.innerText = "High Efficiency - Grid Active";
        statusMsg.style.color = "#27ae60";
    }
}

// 4. Event Listeners (Escuchar cambios)
sunSlider.addEventListener('input', calculateEnergy);
windSlider.addEventListener('input', calculateEnergy);

// Iniciar al cargar
calculateEnergy();
