/* ==============================================
   CUSTOM12.JS - Memory Game Logic
   ============================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- VARIABLES Y ELEMENTOS DOM ---
    const grid = document.getElementById('game-grid');
    const movesEl = document.getElementById('moves');
    const timeEl = document.getElementById('timer');
    const startBtn = document.getElementById('btn-start');
    const restartBtn = document.getElementById('btn-restart');
    const winOverlay = document.getElementById('win-overlay');
    
    // Iconos disponibles (Bootstrap Icons)
    const iconsPool = [
        'bi-cpu', 'bi-hdd', 'bi-memory', 'bi-motherboard', 'bi-gpu-card', 'bi-wifi',
        'bi-mouse', 'bi-keyboard', 'bi-display', 'bi-phone', 'bi-headset', 'bi-controller',
        'bi-router', 'bi-webcam', 'bi-printer', 'bi-laptop'
    ];

    // Variables de estado del juego
    let cards = [];
    let hasFlippedCard = false;
    let lockBoard = false; // Evita clicks mientras se comprueba
    let firstCard, secondCard;
    let moves = 0;
    let matches = 0;
    let totalPairs = 0;
    let timerInterval;
    let seconds = 0;
    let isGameActive = false;
    let difficulty = 'easy';

    // --- INICIALIZACIÓN: Cargar Récords ---
    loadBestScores();

    // --- EVENT LISTENERS ---
    
    // Cambio de dificultad
    document.querySelectorAll('input[name="difficulty"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            difficulty = e.target.id;
            resetGameUI(); // Limpia el tablero si cambias
        });
    });

    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);

    // --- FUNCIONES DEL JUEGO ---

    function startGame() {
        // 1. Resetear variables
        isGameActive = true;
        hasFlippedCard = false;
        lockBoard = false;
        firstCard = null;
        secondCard = null;
        moves = 0;
        matches = 0;
        seconds = 0;
        
        // 2. Actualizar UI
        movesEl.textContent = '0';
        timeEl.textContent = '00:00';
        startBtn.disabled = true;
        restartBtn.disabled = false;
        winOverlay.classList.remove('show');
        
        // 3. Preparar Grid
        grid.innerHTML = '';
        grid.className = 'memory-grid'; // Clase base
        
        // Configuración según dificultad
        // Easy: 4x3 = 12 cartas (6 parejas)
        // Hard: 6x4 = 24 cartas (12 parejas)
        const numPairs = (difficulty === 'easy') ? 6 : 12;
        totalPairs = numPairs;
        grid.classList.add(difficulty === 'easy' ? 'grid-easy' : 'grid-hard');

        // 4. Generar y Barajar Cartas
        createBoard(numPairs);

        // 5. Arrancar Timer
        clearInterval(timerInterval);
        timerInterval = setInterval(updateTimer, 1000);
    }

    function resetGameUI() {
        clearInterval(timerInterval);
        isGameActive = false;
        startBtn.disabled = false;
        restartBtn.disabled = true;
        timeEl.textContent = '00:00';
        movesEl.textContent = '0';
        grid.innerHTML = '<div class="placeholder-msg">Press Start to Play!</div>';
    }

    function createBoard(pairs) {
        // Seleccionar iconos necesarios y duplicarlos
        const gameIcons = iconsPool.slice(0, pairs);
        const deck = [...gameIcons, ...gameIcons];
        
        // Algoritmo Fisher-Yates para barajar aleatoriamente
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }

        // Crear elementos HTML
        deck.forEach(iconClass => {
            const card = document.createElement('div');
            card.classList.add('card-wrapper');
            card.dataset.icon = iconClass; // Guardamos el nombre para comparar

            // Estructura 3D: Front (Icono) y Back (Dorso)
            card.innerHTML = `
                <div class="face front"><i class="bi ${iconClass}"></i></div>
                <div class="face back"><i class="bi bi-question-lg"></i></div>
            `;

            card.addEventListener('click', flipCard);
            grid.appendChild(card);
        });
    }

    // --- LÓGICA DE GIRO ---
    function flipCard() {
        if (!isGameActive) return;
        if (lockBoard) return; // Si estamos esperando timeout, no dejar clickar
        if (this === firstCard) return; // No clickar la misma carta dos veces

        this.classList.add('flip');

        if (!hasFlippedCard) {
            // Primer click
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        // Segundo click
        secondCard = this;
        checkForMatch();
    }

    function checkForMatch() {
        // Incrementar movimientos
        moves++;
        movesEl.textContent = moves;

        // ¿Son iguales?
        let isMatch = firstCard.dataset.icon === secondCard.dataset.icon;

        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        // Se quedan fijas
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        
        // Quitar listeners (ya no se pueden clickar)
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);

        matches++;
        resetBoard();

        // Verificar Victoria
        if (matches === totalPairs) {
            endGame();
        }
    }

    function unflipCards() {
        lockBoard = true; // Bloquear tablero

        // Esperar 1s y girar de vuelta
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    // --- TIMER Y FIN DE JUEGO ---
    function updateTimer() {
        seconds++;
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        timeEl.textContent = `${m}:${s}`;
    }

    function endGame() {
        clearInterval(timerInterval);
        saveBestScore(); // Guardar si es récord
        
        // Actualizar mensaje final
        document.getElementById('final-moves').textContent = moves;
        document.getElementById('final-time').textContent = timeEl.textContent;
        
        // Mostrar overlay con pequeño delay
        setTimeout(() => {
            winOverlay.classList.add('show');
        }, 500);
    }

    // --- LOCAL STORAGE (TAREA OPCIONAL) ---
    function saveBestScore() {
        const key = `memory-best-${difficulty}`;
        const currentBest = localStorage.getItem(key);

        // Si no hay record o el actual es mejor (menos movimientos)
        if (!currentBest || moves < parseInt(currentBest)) {
            localStorage.setItem(key, moves);
            loadBestScores(); // Actualizar visualización
        }
    }

    function loadBestScores() {
        const bestEasy = localStorage.getItem('memory-best-easy') || '-';
        const bestHard = localStorage.getItem('memory-best-hard') || '-';
        
        const elEasy = document.getElementById('best-easy');
        const elHard = document.getElementById('best-hard');
        
        if(elEasy) elEasy.textContent = bestEasy;
        if(elHard) elHard.textContent = bestHard;
    }

    // Exponer initGame al scope global para el botón "Play Again" del modal
    window.initGame = startGame;
});
