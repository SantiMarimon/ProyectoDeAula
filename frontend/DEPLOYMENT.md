# Guía de Despliegue del Frontend PQRS

## 🚀 Inicio Rápido

### Para Desarrollo Local

#### Opción 1: Usar Python (Recomendado)
```bash
cd frontend
python -m http.server 8000
```
Accede a: `http://localhost:8000`

#### Opción 2: Usar Node.js
```bash
cd frontend
npx http-server
```

#### Opción 3: Usar VS Code Live Server
1. Click derecho en `index.html`
2. Selecciona "Open with Live Server"

#### Opción 4: Usar PHP
```bash
cd frontend
php -S localhost:8000
```

---

## 📋 Requerimientos del Sistema

### Navegadores Soportados
- Chrome/Edge: Versión 90+
- Firefox: Versión 88+
- Safari: Versión 14+
- Mobile Browsers: iOS Safari 12+, Chrome Mobile 90+

### Servidor Web (Producción)
- Nginx
- Apache
- IIS
- Cualquier servidor web moderno

---

## 🔧 Configuración para Producción

### 1. Nginx

```nginx
server {
    listen 80;
    server_name example.com;

    root /var/www/proyecto_aula/frontend;
    index index.html;

    # Cache para assets estáticos
    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Rewrite para SPA (si se implementa en el futuro)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # CORS headers para API
    location ~ ^/api/ {
        add_header Access-Control-Allow-Origin "*";
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
        proxy_pass http://backend:8080;
    }

    # Seguridad
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### 2. Apache

```apache
<VirtualHost *:80>
    ServerName example.com
    DocumentRoot /var/www/proyecto_aula/frontend

    <Directory /var/www/proyecto_aula/frontend>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
        
        # Rewrite para SPA
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>

    # Cache headers
    <FilesMatch "\.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$">
        Header set Cache-Control "max-age=31536000, public"
    </FilesMatch>

    # Seguridad
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"
</VirtualHost>
```

### 3. HTTPS/SSL

```bash
# Generar certificado con Let's Encrypt
certbot certonly --webroot -w /var/www/proyecto_aula/frontend -d example.com

# Configurar renovación automática
certbot renew --dry-run
```

---

## 🔐 Configuración de Seguridad

### 1. Headers de Seguridad

```javascript
// En tu servidor web, agrega estos headers:
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

### 2. CORS (Cross-Origin Resource Sharing)

```javascript
// En el backend Spring Boot, configura CORS:
@Bean
public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/api/**")
                .allowedOrigins("https://example.com")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*")
                .maxAge(3600);
        }
    };
}
```

### 3. Content Security Policy

```javascript
// En tu servidor web:
Content-Security-Policy: 
    default-src 'self';
    script-src 'self' 'unsafe-inline' cdnjs.cloudflare.com;
    style-src 'self' 'unsafe-inline' cdnjs.cloudflare.com;
    font-src 'self' cdnjs.cloudflare.com data:;
    img-src 'self' data: https:;
    connect-src 'self' https://api.example.com;
```

---

## 🗂️ Estructura de Carpetas en Producción

```
/var/www/ejemplo.com/
├── frontend/                    # Frontend estático
│   ├── pages/
│   ├── css/
│   ├── js/
│   ├── index.html
│   └── README.md
└── backend/                     # Backend (Java/Spring)
    ├── src/
    ├── pom.xml
    └── target/
```

---

## 📊 Monitoreo y Logs

### 1. Acceder a Logs

```bash
# Nginx
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log

# Apache
tail -f /var/log/apache2/error.log
tail -f /var/log/apache2/access.log
```

### 2. Analizar Rendimiento

```bash
# Usar Chrome DevTools
# Lighthouse para análisis de performance
# WebPageTest para pruebas reales

# O instalar herramientas CLI
npm install -g lighthouse
lighthouse https://example.com
```

---

## 🚀 CI/CD Pipeline (Ejemplo con GitHub Actions)

```yaml
name: Deploy Frontend

on:
  push:
    branches: [ main ]
    paths: [ 'frontend/**' ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Install dependencies
        run: npm install -g http-server
      
      - name: Run tests
        run: npm test
      
      - name: Deploy to production
        env:
          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
        run: |
          mkdir -p ~/.ssh
          echo "$DEPLOY_KEY" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key
          ssh -i ~/.ssh/deploy_key user@server.com "cd /var/www/example.com/frontend && git pull && npm run build"
```

---

## 📦 Optimizaciones Recomendadas

### 1. Compresión Gzip

```nginx
# En Nginx
gzip on;
gzip_types text/plain text/css text/javascript application/json;
gzip_min_length 1000;
```

### 2. Minificación de CSS/JS

```bash
# Usar herramientas como:
# - UglifyJS para JavaScript
# - CSSNano para CSS
# - HTML-minifier para HTML

npm install -g uglify-js cssnano-cli html-minifier
```

### 3. Lazy Loading

```html
<img loading="lazy" src="image.jpg" alt="Descripción">
```

### 4. Caché del Navegador

```nginx
# En Nginx
add_header Cache-Control "max-age=31536000, public" always;
add_header Cache-Control "max-age=0, must-revalidate" always;
```

---

## ✅ Checklist de Despliegue

- [ ] HTTPS configurado
- [ ] Certificados SSL/TLS válidos
- [ ] Headers de seguridad configurados
- [ ] CORS configurado correctamente
- [ ] Compresión Gzip habilitada
- [ ] Cache configurado
- [ ] Logs habilitados
- [ ] Monitoreo en lugar
- [ ] Backups configurados
- [ ] Plan de recuperación ante desastres
- [ ] Tests de carga completados
- [ ] Performance verificado (>90 en Lighthouse)
- [ ] SEO optimizado
- [ ] Accesibilidad verificada

---

## 🆘 Solución de Problemas

### Problema: La página no carga
**Solución**: Verifica que el servidor web esté corriendo y accesible

### Problema: Errores CORS
**Solución**: Configura CORS correctamente en el backend

### Problema: Estilos no cargan
**Solución**: Verifica rutas relativas de CSS, asegúrate que los archivos existan

### Problema: JavaScript no funciona
**Solución**: Abre la consola (F12) y revisa los errores, verifica que los scripts se carguen

### Problema: Rendimiento lento
**Solución**: 
1. Habilita compresión Gzip
2. Implementa caché
3. Minifica assets
4. Usa CDN para librerías externas

---

## 📞 Soporte

Para más información consulta:
- [MDN Web Docs](https://developer.mozilla.org/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Apache Documentation](https://httpd.apache.org/docs/)

---

**Versión**: 1.0.0  
**Fecha**: Abril 2026
