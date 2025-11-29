/* ==============================================
   CUSTOM.JS - Lógica del Formulario (Task 3)
   ============================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos del DOM
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    
    const nameInput = document.getElementById('name');
    const surnameInput = document.getElementById('surname');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const addressInput = document.getElementById('address');
    const messageInput = document.getElementById('message');
    
    // Array con las 3 valoraciones
    const ratings = [
        document.getElementById('rating1'),
        document.getElementById('rating2'),
        document.getElementById('rating3')
    ];

    // --- TAREA OPCIONAL: Máscara de Teléfono (+370 6xx xxxxx) ---
    if(phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,5})/);
            e.target.value = !x[2] ? x[1] : '+' + x[1] + ' ' + x[2] + (x[3] ? ' ' + x[3] : '');
            
            validateField(phoneInput); 
            checkFormValidity();
        });
    }

    // --- TAREA OPCIONAL: Validación en Tiempo Real ---
    function validateField(input) {
        if(!input) return;
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';
        const errorDisplay = input.nextElementSibling; // El tag <small>

        // Validar vacío
        if (value === '') {
            isValid = false;
            errorMessage = 'This field cannot be empty.';
        } else {
            // Validaciones específicas
            switch(input.id) {
                case 'name':
                case 'surname':
                    if (!/^[a-zA-Z\s]+$/.test(value)) { isValid = false; errorMessage = 'Only letters allowed.'; }
                    break;
                case 'email':
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) { isValid = false; errorMessage = 'Invalid email format.'; }
                    break;
                case 'phone':
                    // SOLUCIÓN NUEVA: Contamos solo los dígitos reales
                    const digits = value.replace(/\D/g, ''); // Elimina +, espacios, etc.
                    
                    // Necesitamos exactamente 11 dígitos (ej: 37060012345)
                    if (digits.length < 11) { 
                        isValid = false; 
                        errorMessage = 'Format: +370 6xx xxxxx'; 
                    }
                    break;
                case 'rating1':
                case 'rating2':
                case 'rating3':
                    if (value < 1 || value > 10) { isValid = false; errorMessage = '1-10 only.'; }
                    break;
            }
        }

        // Estilos visuales
        if (isValid) {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
            if(errorDisplay) errorDisplay.innerText = '';
        } else {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
            if(errorDisplay) errorDisplay.innerText = errorMessage;
        }
        return isValid;
    }

    // --- TAREA OPCIONAL: Bloquear botón ---
    function checkFormValidity() {
        const allInputs = [nameInput, surnameInput, emailInput, phoneInput, addressInput, messageInput, ...ratings];
        const allValid = allInputs.every(input => input && input.classList.contains('is-valid'));

        if (allValid) {
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
        } else {
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.6';
            submitBtn.style.cursor = 'not-allowed';
        }
    }

    // Activar listeners
    const allInputs = [nameInput, surnameInput, emailInput, phoneInput, addressInput, messageInput, ...ratings];
    allInputs.forEach(input => {
        if(!input) return;
        input.addEventListener('input', () => { if (input.id !== 'phone') validateField(input); checkFormValidity(); });
        input.addEventListener('blur', () => { if (input.id !== 'phone') validateField(input); checkFormValidity(); });
    });

    // --- PROCESAR ENVÍO ---
    if(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Recoger datos
            const formData = {
                Name: nameInput.value,
                Surname: surnameInput.value,
                Email: emailInput.value,
                Phone: phoneInput.value,
                Address: addressInput.value,
                Ratings: ratings.map(r => parseInt(r.value)),
                Message: messageInput.value
            };

            console.log('Form Data Object:', formData);

            // Calcular Promedio y Color
            const sum = formData.Ratings.reduce((a, b) => a + b, 0);
            const average = (sum / formData.Ratings.length).toFixed(1);
            
            let colorClass = 'avg-green';
            if (average < 4) colorClass = 'avg-red';
            else if (average < 7) colorClass = 'avg-orange';

            // Mostrar resultados
            const resultsDiv = document.getElementById('form-results');
            const contentDiv = document.getElementById('results-content');
            
            if(resultsDiv && contentDiv) {
                resultsDiv.style.display = 'block';
                contentDiv.innerHTML = `
                    <p><strong>Name:</strong> ${formData.Name}</p>
                    <p><strong>Surname:</strong> ${formData.Surname}</p>
                    <p><strong>Email:</strong> ${formData.Email}</p>
                    <p><strong>Phone:</strong> ${formData.Phone}</p>
                    <p><strong>Address:</strong> ${formData.Address}</p>
                    <hr>
                    <p style="font-size: 1.2rem;">
                        <strong>Result:</strong> ${formData.Name} ${formData.Surname}: <span class="${colorClass}">${average}</span>
                    </p>
                `;
            }

            // Mostrar Popup
            const popup = document.getElementById('success-popup');
            if(popup) popup.style.display = 'flex';
        });
    }
});

// Función global para cerrar popup
window.closePopup = function() {
    const popup = document.getElementById('success-popup');
    if(popup) popup.style.display = 'none';
}
