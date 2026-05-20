# Sistema PQRS - JAC Barrio Policarpa

Sistema de gestión de **Peticiones, Quejas, Reclamaciones y Sugerencias (PQRS)** para la Junta de Acción Comunal (JAC) del barrio Policarpa.

## Descripción

Plataforma web que permite a los habitantes del barrio radicar PQRS ante la JAC, hacer seguimiento a sus solicitudes y recibir respuestas de los administradores. El sistema incluye autenticación JWT, carga de evidencias y despliegue con Docker.

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Backend | Java 17 + Spring Boot 3 |
| Base de datos | MongoDB Atlas |
| Frontend | HTML5 + CSS3 + JavaScript vanilla |
| Contenedores | Docker + Docker Compose |
| Servidor web | Nginx |
| Almacenamiento de archivos | Cloudinary |

## Estructura del proyecto

```
.
├── proyecto_aula-master/   # Backend Spring Boot
│   ├── src/
│   └── pom.xml
├── frontend/               # Frontend estático
│   ├── pages/
│   ├── css/
│   ├── js/
│   ├── index.html
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
├── .env.example
└── README.md
```

## Requisitos previos

- Java 17+
- Maven 3.8+
- Docker y Docker Compose
- Cuenta en MongoDB Atlas
- Cuenta en Cloudinary (para subida de evidencias)

## Configuración

1. Copia `.env.example` a `.env` y completa las variables:

```bash
cp .env.example .env
```

2. Edita `.env` con tus credenciales (ver sección de variables de entorno).

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `SPRING_DATA_MONGODB_URI` | URI de conexión a MongoDB Atlas |
| `APP_JWT_SECRET` | Clave secreta para firmar tokens JWT (mínimo 32 caracteres) |
| `APP_JWT_EXPIRATION` | Duración del token en milisegundos (por defecto 24h) |
| `CORS_ORIGINS` | Orígenes permitidos para CORS |
| `CLOUDINARY_CLOUD_NAME` | Nombre del cloud en Cloudinary |
| `CLOUDINARY_API_KEY` | API Key de Cloudinary |
| `CLOUDINARY_API_SECRET` | API Secret de Cloudinary |

## Ejecutar con Docker

```bash
# Construir y levantar todos los servicios
docker compose up --build

# En segundo plano
docker compose up -d --build
```

- Frontend: http://localhost
- Backend API: http://localhost:8080
- Health check: http://localhost:8080/actuator/health

## Ejecutar en desarrollo

```bash
# Backend
cd proyecto_aula-master
./mvnw spring-boot:run

# Frontend — cualquier servidor HTTP estático
python -m http.server 8000 --directory frontend
```

## Endpoints principales de la API

```
POST /api/auth/login
POST /api/auth/registro

GET  /api/peticiones
POST /api/peticiones
GET  /api/peticiones/{id}
PUT  /api/peticiones/{id}

POST /api/respuestas
GET  /api/respuestas/peticion/{id}

POST /api/upload/evidencia
```

## Funcionalidades

- Registro e inicio de sesión con JWT
- Dashboard ciudadano: crear y dar seguimiento a PQRS
- Dashboard administrador: gestionar y responder peticiones
- Carga de evidencias (imágenes/documentos) vía Cloudinary
- Filtros y búsqueda avanzada
- Diseño responsivo (mobile-first)

## Contexto académico

Proyecto de aula desarrollado como ejercicio práctico de integración de tecnologías backend, base de datos en la nube, frontend y despliegue con contenedores.
