# Frontend PQRS - Sistema de Peticiones, Quejas, Reclamaciones y Sugerencias

## 📋 Descripción

Frontend profesional y moderno para el Sistema PQRS construido con **HTML5, CSS3 y JavaScript vanilla**. Diseño responsivo, hermoso y completamente funcional.

## 🎯 Características

✅ **Interfaz Profesional y Moderna**
- Diseño limpio con paleta de colores coherente
- Componentes reutilizables
- Totalmente responsivo (mobile-first)

✅ **Módulos Principales**
- Autenticación (Login/Registro)
- Dashboard Ciudadano
- Dashboard Administrador
- Gestión de Peticiones
- Sistema de Respuestas
- Gestión de Evidencia
- Perfil de Usuario

✅ **Características de Usabilidad**
- Navegación intuitiva
- Búsqueda y filtros avanzados
- Indicadores de estado visuales
- Badges y notificaciones
- Timeline de seguimiento
- Modales interactivos
- Validación de formularios

## 📁 Estructura de Archivos

```
frontend/
├── pages/                          # Páginas HTML
│   ├── index.html                 # Login/Registro
│   ├── dashboard-ciudadano.html   # Dashboard para ciudadanos
│   ├── dashboard-admin.html       # Dashboard para administradores
│   ├── crear-peticion.html        # Formulario para crear petición
│   ├── ver-peticion.html          # Detalle de petición
│   ├── responder-peticion.html    # Formulario de respuesta (admin)
│   ├── peticiones-admin.html      # Listado de peticiones (admin)
│   └── perfil.html                # Perfil de usuario
├── css/                            # Estilos CSS
│   ├── styles.css                 # Estilos base y componentes
│   ├── layout.css                 # Estilos de navegación y layout
│   └── petitions.css              # Estilos específicos para peticiones
└── js/                             # (opcional) Scripts JavaScript

```

## 🎨 Paleta de Colores

```
Primary Blue:     #0066cc  
Primary Dark:     #004a99
Secondary Cyan:   #00b4d8

Success Green:    #10b981
Warning Orange:   #f59e0b
Danger Red:       #dc2626

Grays: #f9fafb, #f3f4f6, #e5e7eb, #d1d5db, #9ca3af, #6b7280, #4b5563, #374151, #1f2937, #111827
```

## 📄 Páginas Disponibles

### 1. **index.html** - Login & Registro
- Diseño de dos columnas
- Tabs para cambiar entre Login/Registro
- Formularios validados
- Almacenamiento en localStorage

### 2. **dashboard-ciudadano.html** - Dashboard Ciudadano
- Estadísticas principales (Total, Resueltas, En Proceso, Rechazadas)
- Filtros avanzados
- Listado de peticiones con estado visual
- Acciones rápidas
- Barra de navegación y menú de usuario

### 3. **crear-peticion.html** - Nueva Petición
- Formulario multi-sección
- Selector de tipo de petición
- Descripción detallada
- Upload de archivos (drag & drop)
- Información de contacto
- Validación progresiva

### 4. **ver-peticion.html** - Detalle de Petición
- Información completa de la petición
- Timeline de seguimiento
- Respuestas y comentarios
- Evidencia adjunta
- Tabs para diferentes vistas

### 5. **dashboard-admin.html** - Dashboard Administrador
- Métricas principales
- Gráficos de estadísticas
- Tiempo promedio de resolución
- Tabla de peticiones recientes
- Sidebar de navegación

### 6. **responder-peticion.html** - Responder Petición
- Información de la petición en contexto
- Editor de respuesta
- Selección de estado final
- Asignación de responsable
- Upload de evidencia
- Configuración de notificaciones

### 7. **peticiones-admin.html** - Listado de Peticiones
- Tabla completa de peticiones
- Filtros avanzados
- Búsqueda por múltiples criterios
- Indicadores de urgencia
- Acciones rápidas por fila
- Paginación

### 8. **perfil.html** - Perfil de Usuario
- Información personal
- Seguridad (cambio de contraseña)
- Preferencias (notificaciones, idioma)
- Estadísticas del usuario
- Zona de peligro (eliminar cuenta)

## 🚀 Cómo Usar

### Instalación
No se requiere instalación. Solo necesitas un servidor web.

```bash
# Opción 1: Usar Python
python -m http.server 8000

# Opción 2: Usar Live Server en VS Code
# Click derecho > Open with Live Server

# Opción 3: Directamente en el navegador
# Abre index.html
```

### Acceso
- **URL**: `http://localhost:8000/frontend/pages/index.html`
- **Usuario Demo Ciudadano**: cualquier email
- **Usuario Demo Admin**: accede a `dashboard-admin.html`

## 📱 Responsividad

✅ Desktop (1200px+)
✅ Tablet (768px - 1199px)  
✅ Mobile (< 768px)

Se utilizan media queries para adaptar el layout en dispositivos pequeños:
- Sidebar se oculta en mobile
- Grid se convierte a 1 columna
- Fuentes se ajustan
- Navegación se adapta

## 🔧 Componentes CSS Reutilizables

### Botones
```html
<button class="btn btn-primary">Primario</button>
<button class="btn btn-secondary">Secundario</button>
<button class="btn btn-danger">Peligro</button>
<button class="btn btn-success">Éxito</button>
<button class="btn btn-lg">Grande</button>
<button class="btn btn-sm">Pequeño</button>
```

### Badges
```html
<span class="badge badge-primary">Primario</span>
<span class="badge badge-success">Éxito</span>
<span class="badge badge-warning">Advertencia</span>
<span class="badge badge-danger">Peligro</span>
```

### Alerts
```html
<div class="alert alert-success">Mensaje de éxito</div>
<div class="alert alert-danger">Mensaje de error</div>
<div class="alert alert-warning">Advertencia</div>
<div class="alert alert-info">Información</div>
```

### Cards
```html
<div class="card">
    <div class="card-header">Encabezado</div>
    <div class="card-body">Contenido</div>
    <div class="card-footer">Pie</div>
</div>
```

### Grid
```html
<div class="grid grid-2">...</div>  <!-- 2 columnas -->
<div class="grid grid-3">...</div>  <!-- 3 columnas -->
<div class="grid grid-4">...</div>  <!-- 4 columnas -->
```

## 🔐 Seguridad

⚠️ **Nota**: Este frontend es una prueba de concepto. Para producción:

1. **HTTPS obligatorio**
2. **Validación server-side** de todos los datos
3. **CSRF tokens** en formularios
4. **Sanitización** de entrada de usuario
5. **Rate limiting** en API calls
6. **Almacenamiento seguro** de tokens JWT
7. **Content Security Policy** headers

## 📦 Integración con Backend

El frontend está listo para integrarse con el backend Spring Boot. Los endpoints esperados son:

```javascript
// Authentication
POST /api/auth/login
POST /api/auth/registro

// Petitions
GET /api/peticiones
GET /api/peticiones/{id}
POST /api/peticiones
PUT /api/peticiones/{id}
DELETE /api/peticiones/{id}

// Responses
GET /api/respuestas
POST /api/respuestas
GET /api/respuestas/peticion/{peticionId}

// Evidence
GET /api/evidencias
POST /api/evidencias
POST /api/upload/evidencia

// Members
GET /api/miembros
PUT /api/miembros/{id}
```

## 🎯 Próximos Pasos

Para producción, considera agregar:

1. **Framework JavaScript** (React, Vue, Angular)
2. **Estado management** (Redux, Vuex, Context API)
3. **Compilación y bundling** (Webpack, Vite)
4. **Testing** (Jest, Cypress, Playwright)
5. **Documentación de componentes** (Storybook)
6. **Análisis de rendimiento** (Lighthouse)
7. **Internacionalización** (i18n)
8. **Modo oscuro** (Dark mode)

## 📄 Licencia

Este frontend es parte del proyecto PQRS y está disponible bajo la misma licencia del proyecto.

## 📧 Soporte

Para problemas o sugerencias, por favor contacta al equipo de desarrollo.

---

**Versión**: 1.0.0  
**Última actualización**: Abril 2026  
**Autor**: Equipo PQRS
