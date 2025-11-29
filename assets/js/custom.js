/* ==============================================
   CUSTOM.JS - VERSIÓN FINAL SIN POPUP GRIS
   ============================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    
    // Inputs
    const nameInput = document.getElementById('name');
    const surnameInput = document.getElementById('surname');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const addressInput = document.getElementById('address');
    const messageInput = document.getElementById('message');
    
    // Ratings
    const ratings = [
        document.getElementById('rating1'),
        document.getElementById('rating2'),
        document.getElementById('rating3')
    ];

    // --- 1. MÁSCARA Y VALIDACIÓN DE TELÉFONO ---
    if(phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let rawValue = e.target.value.replace(/\D/g, '');
            
            if (rawValue.length === 0) {
                e.target.value = "";
                validateField(phoneInput);
                checkFormValidity();
                return;
            }

            if (rawValue.length > 11) {
                rawValue = rawValue.substring(0, 11);
            }

            let formatted = "";
            if (rawValue.length > 0) formatted = "+" + rawValue.substring(0, 3);
            if (rawValue.length > 3) formatted += " " + rawValue.substring(3, 6);
            if (rawValue.length > 6) formatted += " " + rawValue.substring(6, 11);

            e.target.value = formatted;
            
            validateField(phoneInput); 
            checkFormValidity();
        });
    }

    // --- 2. VALIDACIÓN GENÉRICA ---
    function validateField(input) {
        if(!input) return;
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';
        const errorDisplay = input.nextElementSibling; 

        if (value === '') {
            isValid = false;
            errorMessage = 'This field cannot be empty.';
        } else {
            switch(input.id) {
                case 'name':
                case 'surname':
                    if (!/^[a-zA-Z\s]+$/.test(value)) { isValid = false; errorMessage = 'Only letters allowed.'; }
                    break;
                case 'email':
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) { isValid = false; errorMessage = 'Invalid email format.'; }
                    break;
                case 'phone':
                    const digits = value.replace(/\D/g, ''); 
                    if (digits.length !== 11) { isValid = false; errorMessage = 'Format: +370 6xx xxxxx (11 digits)'; }
                    break;
                case 'rating1':
                case 'rating2':
                case 'rating3':
                    if (value < 1 || value > 10) { isValid = false; errorMessage = '1-10 only.'; }
                    break;
            }
        }

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

    // --- 3. BLOQUEO DEL BOTÓN ---
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

    const allInputs = [nameInput, surnameInput, emailInput, phoneInput, addressInput, messageInput, ...ratings];
    allInputs.forEach(input => {
        if(!input) return;
        input.addEventListener('input', () => { if (input.id !== 'phone') validateField(input); checkFormValidity(); });
        input.addEventListener('blur', () => { if (input.id !== 'phone') validateField(input); checkFormValidity(); });
    });

    // --- 4. ENVÍO DEL FORMULARIO ---
    if(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = {
                Name: nameInput.value,
                Surname: surnameInput.value,
                Email: emailInput.value,
                Phone: phoneInput.value,
                Address: addressInput.value,
                Ratings: ratings.map(r => parseInt(r.value) || 0),
                Message: messageInput.value
            };

            const sum = formData.Ratings.reduce((a, b) => a + b, 0);
            const average = (sum / formData.Ratings.length).toFixed(1);
            
            let colorClass = 'avg-green';
            if (average < 4) colorClass = 'avg-red';
            else if (average < 7) colorClass = 'avg-orange';

            const resultsDiv = document.getElementById('form-results');
            const contentDiv = document.getElementById('results-content');
            
            if(resultsDiv) {
                // Mostrar la caja de resultados
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

                // Hacemos scroll suave hasta los resultados para que el usuario los vea
                resultsDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }

            // --- HEMOS ELIMINADO LA PARTE QUE MOSTRABA EL POPUP GRIS ---
        });
    }
});
