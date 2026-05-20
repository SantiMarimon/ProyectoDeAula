# Guía para Desarrolladores - Frontend PQRS

## 📚 Tabla de Contenidos

1. [Estructura del Proyecto](#estructura-del-proyecto)
2. [Cómo Empezar](#cómo-empezar)
3. [Estilos y Componentes](#estilos-y-componentes)
4. [JavaScript Vanilla](#javascript-vanilla)
5. [Integración con Backend](#integración-con-backend)
6. [Mejores Prácticas](#mejores-prácticas)
7. [Troubleshooting](#troubleshooting)

---

## 📁 Estructura del Proyecto

```
frontend/
├── pages/
│   ├── index.html                 # Login/Registro
│   ├── dashboard-ciudadano.html   # Dashboard ciudadanos
│   ├── dashboard-admin.html       # Dashboard admin
│   ├── crear-peticion.html        # Crear petición
│   ├── ver-peticion.html          # Ver petición
│   ├── responder-peticion.html    # Responder (admin)
│   ├── peticiones-admin.html      # Listado (admin)
│   └── perfil.html                # Perfil usuario
├── css/
│   ├── styles.css                 # Estilos base
│   ├── layout.css                 # Layout y navegación
│   └── petitions.css              # Peticiones
├── js/
│   └── api.js                     # (Por crear) Llamadas a API
├── index.html                      # Redirector
├── README.md                       # Documentación
└── DEPLOYMENT.md                   # Guía de despliegue
```

---

## 🚀 Cómo Empezar

### 1. Desarrollo Local

```bash
# Método 1: Python
cd frontend
python -m http.server 8000
# Accede a http://localhost:8000

# Método 2: VS Code Live Server
# Click derecho en index.html > Open with Live Server

# Método 3: Node.js
cd frontend
npx http-server
```

### 2. Estructura de Navegación

```
index.html (Login/Registro)
├── → dashboard-ciudadano.html (Ciudadano)
│   ├── → crear-peticion.html
│   ├── → ver-peticion.html
│   └── → perfil.html
└── → dashboard-admin.html (Admin)
    ├── → peticiones-admin.html
    ├── → ver-peticion.html
    └── → responder-peticion.html
```

---

## 🎨 Estilos y Componentes

### Valores CSS Predefinidos

```css
/* Colores */
var(--primary)         /* #0066cc */
var(--primary-dark)    /* #004a99 */
var(--secondary)       /* #00b4d8 */
var(--success)         /* #10b981 */
var(--warning)         /* #f59e0b */
var(--danger)          /* #dc2626 */

/* Espaciado */
var(--spacing-xs)      /* 0.25rem */
var(--spacing-sm)      /* 0.5rem */
var(--spacing-md)      /* 1rem */
var(--spacing-lg)      /* 1.5rem */
var(--spacing-xl)      /* 2rem */
var(--spacing-2xl)     /* 3rem */

/* Border Radius */
var(--radius-sm)       /* 0.375rem */
var(--radius)          /* 0.5rem */
var(--radius-md)       /* 0.75rem */
var(--radius-lg)       /* 1rem */

/* Sombras */
var(--shadow)
var(--shadow-md)
var(--shadow-lg)
```

### Componentes Predefinidos

#### Botones

```html
<!-- Tipos -->
<button class="btn btn-primary">Primario</button>
<button class="btn btn-secondary">Secundario</button>
<button class="btn btn-danger">Peligro</button>
<button class="btn btn-success">Éxito</button>

<!-- Tamaños -->
<button class="btn btn-sm">Pequeño</button>
<button class="btn btn-lg">Grande</button>

<!-- Estados -->
<button class="btn btn-primary" disabled>Deshabilitado</button>

<!-- Block -->
<button class="btn btn-primary btn-block">Ancho completo</button>
```

#### Badges

```html
<span class="badge badge-primary">Primario</span>
<span class="badge badge-success">Éxito</span>
<span class="badge badge-warning">Advertencia</span>
<span class="badge badge-danger">Peligro</span>
<span class="badge badge-gray">Gris</span>
```

#### Alerts

```html
<div class="alert alert-success">
    <i class="fas fa-check-circle"></i>
    <div>Mensaje de éxito</div>
</div>

<div class="alert alert-danger">
    <i class="fas fa-exclamation-circle"></i>
    <div>Mensaje de error</div>
</div>
```

#### Cards

```html
<div class="card">
    <div class="card-header">
        <h3>Título</h3>
    </div>
    <div class="card-body">
        <!-- Contenido -->
    </div>
    <div class="card-footer">
        <!-- Acciones -->
    </div>
</div>
```

#### Grid

```html
<!-- 2 columnas -->
<div class="grid grid-2">
    <div>Columna 1</div>
    <div>Columna 2</div>
</div>

<!-- 3 columnas -->
<div class="grid grid-3">
    <div>Columna 1</div>
    <div>Columna 2</div>
    <div>Columna 3</div>
</div>

<!-- Responsive -->
<div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));">
```

---

## 🔧 JavaScript Vanilla

### Estructura Básica

```javascript
// 1. Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM está listo');
    // Inicializar
    loadUserInfo();
    loadPetitions();
});

// 2. Funciones de utilidad
function getUrlParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

// 3. localStorage para datos
localStorage.setItem('userEmail', 'user@example.com');
const email = localStorage.getItem('userEmail');
localStorage.removeItem('userEmail');
localStorage.clear();
```

### Manejo de Eventos

```javascript
// Click
document.querySelector('.btn').addEventListener('click', function() {
    console.log('Click!');
});

// Form submit
document.getElementById('form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevenir comportamiento por defecto
    // Procesar formulario
});

// Change en select
document.getElementById('select').addEventListener('change', function() {
    console.log(this.value);
});

// Eventos delegados
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-delete')) {
        // Handle delete
    }
});
```

### Manipulación del DOM

```javascript
// Crear elementos
const div = document.createElement('div');
div.classList.add('card');
div.innerHTML = '<h3>Nuevo Card</h3>';
document.body.appendChild(div);

// Seleccionar elementos
const el = document.querySelector('.card');       // Primer elemento
const els = document.querySelectorAll('.card');   // Todos los elementos
const byId = document.getElementById('myId');
const byClass = document.getElementsByClassName('myClass');

// Modificar atributos
el.setAttribute('data-id', '123');
el.removeAttribute('disabled');
const id = el.getAttribute('data-id');

// Clases
el.classList.add('active');
el.classList.remove('active');
el.classList.toggle('active');
el.classList.contains('active'); // true/false

// Contenido
el.textContent = 'Texto';
el.innerHTML = '<strong>HTML</strong>';
el.insertAdjacentHTML('beforeend', '<span>Nuevo</span>');

// Estilos
el.style.color = 'red';
el.style.backgroundColor = 'blue';
```

### Ejemplo: Cargar datos de API

```javascript
async function loadPetitions() {
    try {
        const response = await fetch('/api/peticiones', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            }
        });

        if (!response.ok) throw new Error('Error en la petición');

        const petitions = await response.json();
        renderPetitions(petitions);
    } catch (error) {
        console.error('Error:', error);
        showError('No se pudo cargar las peticiones');
    }
}

function renderPetitions(petitions) {
    const container = document.getElementById('petitionsList');
    container.innerHTML = '';

    petitions.forEach(petition => {
        const card = document.createElement('div');
        card.className = 'petition-card';
        card.innerHTML = `
            <div class="petition-header">
                <h3>${petition.titulo}</h3>
                <span class="badge">${petition.estado}</span>
            </div>
            <p>${petition.descripcion}</p>
        `;
        container.appendChild(card);
    });
}
```

### Validación de Formularios

```javascript
function validateForm(formId) {
    const form = document.getElementById(formId);
    const email = form.querySelector('input[type="email"]');
    const password = form.querySelector('input[type="password"]');

    let valid = true;

    // Email
    if (!email.value || !email.value.includes('@')) {
        email.style.borderColor = 'red';
        valid = false;
    }

    // Password
    if (!password.value || password.value.length < 6) {
        password.style.borderColor = 'red';
        valid = false;
    }

    return valid;
}

// Uso
document.getElementById('form').addEventListener('submit', function(e) {
    e.preventDefault();
    if (validateForm('form')) {
        // Enviar
    }
});
```

---

## 🔗 Integración con Backend

### Crear archivo `js/api.js`

```javascript
// js/api.js

const API_URL = 'http://localhost:8080/api';

// Auth
async function login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
}

// Petitions
async function getPetitions() {
    const response = await fetch(`${API_URL}/peticiones`, {
        headers: { 'Authorization': 'Bearer ' + getToken() }
    });
    return response.json();
}

async function createPetition(data) {
    const response = await fetch(`${API_URL}/peticiones`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function updatePetition(id, data) {
    const response = await fetch(`${API_URL}/peticiones/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

// Helper
function getToken() {
    return localStorage.getItem('token');
}
```

### Usar en HTML

```html
<!-- En el HTML -->
<script src="../js/api.js"></script>

<script>
// Usar las funciones
login('user@email.com', 'password')
    .then(data => {
        console.log('Login exitoso');
        window.location.href = 'dashboard-ciudadano.html';
    })
    .catch(error => console.error(error));
</script>
```

---

## ✅ Mejores Prácticas

### 1. Nomenclatura

```javascript
// ✅ Bueno
const userEmail = 'user@example.com';
function getUserInfo() {}
const isActive = true;

// ❌ Malo
const ue = 'user@example.com';
function get_user_info() {}
const active = true;
```

### 2. Organización

```html
<!-- Orden de scripts -->
<head>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <!-- Contenido -->
    
    <!-- Scripts al final -->
    <script src="js/api.js"></script>
    <script src="js/utils.js"></script>
    <script src="js/app.js"></script>
</body>
```

### 3. Comentarios

```javascript
// ✅ Bueno
// Valida el formato de email
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ❌ Malo
function isValidEmail(email) {
    // regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

### 4. DRY (Don't Repeat Yourself)

```javascript
// ✅ Bueno - Reutilizable
function showNotification(message, type = 'success') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    document.body.appendChild(alert);
}

// Usar
showNotification('Success!', 'success');
showNotification('Error!', 'danger');

// ❌ Malo - Repetido
function showSuccessNotification(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-success';
    alert.textContent = message;
    document.body.appendChild(alert);
}

function showErrorNotification(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-danger';
    alert.textContent = message;
    document.body.appendChild(alert);
}
```

### 5. Manejo de Errores

```javascript
// ✅ Bueno
async function fetchData() {
    try {
        const response = await fetch('/api/data');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

// ❌ Malo
async function fetchData() {
    const response = await fetch('/api/data');
    return response.json();
}
```

---

## 🐛 Troubleshooting

### Problema: CORS Error
```
Access to XMLHttpRequest at 'http://localhost:8080/api/...' from origin 'http://localhost:8000' 
has been blocked by CORS policy
```

**Solución**: Configura CORS en el backend Spring Boot
```java
@Bean
public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:8000")
                .allowedMethods("*")
                .allowedHeaders("*")
                .maxAge(3600);
        }
    };
}
```

### Problema: 404 en archivos CSS/JS
**Solución**: Verifica las rutas relativas
```html
<!-- Correcto si estamos en pages/index.html -->
<link rel="stylesheet" href="../css/styles.css">
<script src="../js/api.js"></script>

<!-- Incorrecto -->
<link rel="stylesheet" href="css/styles.css">
<script src="js/api.js"></script>
```

### Problema: localStorage no funciona
**Solución**: localStorage no funciona en `file://`, usa un servidor web
```bash
python -m http.server 8000
```

### Problema: Token no se envía
**Solución**: Verifica el header Authorization
```javascript
// Correcto
headers: {
    'Authorization': 'Bearer ' + token
}

// Incorrecto
headers: {
    'Authorization': token
}
```

---

## 📚 Recursos Útiles

- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript.info](https://javascript.info/)
- [CSS-Tricks](https://css-tricks.com/)
- [Web.dev](https://web.dev/)
- [Font Awesome Icons](https://fontawesome.com/icons)

---

**Versión**: 1.0.0  
**Última actualización**: Abril 2026
