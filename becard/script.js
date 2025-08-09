document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    let clubData = {}; // Almacenará todos los datos del JSON

    // Cargar datos iniciales
    loadData();

    async function loadData() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) throw new Error('No se pudo cargar data.json');
            
            clubData = await response.json();
            renderLoginView();
        } catch (error) {
            app.innerHTML = `
                <div class="container error">
                    <h1>Error de conexión</h1>
                    <p>No se pudieron cargar los datos. Intenta recargar la página.</p>
                    <button onclick="location.reload()">Reintentar</button>
                </div>
            `;
        }
    }

    function renderLoginView() {
        app.innerHTML = `
            <div class="container">
                <img src="${clubData.club.logo || ''}" alt="Logo del club" class="logo">
                <h1>${clubData.club.name || 'Verificación de Miembro'}</h1>
                <div class="input-group">
                    <input 
                        type="number" 
                        id="studentCode" 
                        placeholder="Ingresa tu código" 
                        min="1" 
                        max="999"
                        autofocus
                    >
                    <button id="verifyBtn">Verificar</button>
                </div>
            </div>
        `;

        document.getElementById('verifyBtn').addEventListener('click', verifyStudent);
        document.getElementById('studentCode').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') verifyStudent();
        });
    }

    function verifyStudent() {
        const codeInput = document.getElementById('studentCode');
        const code = codeInput.value.trim();

        if (!code) {
            showError('Por favor ingresa un código');
            return;
        }

        const student = clubData.members.find(member => member.code === code.toString());
        console.log(student); // <-- Verifica si encuentra el estudiante

        if (student) {
            renderStudentCard(student);
        } else {
            showError('Código no válido. Intenta nuevamente.');
            codeInput.focus();
        }
    }

    function renderStudentCard(student) {
        app.innerHTML = `
            <div class="card-container">
                <div class="card">
                    <div class="card-header">
                        <h2>${student.name}</h2>
                        <p>${student.role}</p>
                    </div>
                    <div class="card-body">
                        ${student.photo ? `
                            <div class="card-photo">
                                <img src="${student.photo}" alt="Foto de ${student.name}">
                            </div>
                        ` : ''}
                        <div class="card-details">
                            ${renderStudentDetails(student)}
                            ${renderStudentProjects(student)}
                            ${renderStudentLinks(student)}
                        </div>
                    </div>
                    <div class="card-footer">
                        <p>${clubData.club.name}</p>
                    </div>
                </div>
                <button id="backBtn">Volver</button>
            </div>
        `;

        document.getElementById('backBtn').addEventListener('click', renderLoginView);
    }

    function renderStudentDetails(student) {
        return Object.entries(student.details || {}).map(([key, value]) => `
            <p><strong>${key}:</strong> ${formatDetailValue(value)}</p>
        `).join('');
    }

    function formatDetailValue(value) {
        if (Array.isArray(value)) {
            return value.join(', ');
        }
        return value;
    }

    function renderStudentProjects(student) {
        if (!student.projects || student.projects.length === 0) return '';
        
        return `
            <div class="card-projects">
                <h3>Proyectos</h3>
                <ul>
                    ${student.projects.map(project => `<li>${project}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    function renderStudentLinks(student) {
        if (!student.links || student.links.length === 0) return '';
        
        return `
            <div class="card-links">
                <h3>Enlaces</h3>
                ${student.links.map(link => `
                    <a href="${validateUrl(link.url)}" target="_blank" rel="noopener noreferrer">
                        ${link.label}
                    </a>
                `).join('')}
            </div>
        `;
    }

    function validateUrl(url) {
        if (!url.match(/^https?:\/\//)) {
            return `https://${url}`;
        }
        return url;
    }

    function showError(message) {
        const errorElement = document.querySelector('.error-message') || document.createElement('p');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        
        const inputGroup = document.querySelector('.input-group');
        if (inputGroup && !inputGroup.contains(errorElement)) {
            inputGroup.appendChild(errorElement);
        }
        
        // Eliminar el mensaje después de 3 segundos
        setTimeout(() => {
            if (errorElement.parentNode) {
                errorElement.remove();
            }
        }, 3000);
    }
});