# Integración Backend Vetcare - Guía Completa

## Descripción General

Este documento explica cómo integrar el backend de Vetcare con la infraestructura de API Gateway, Nginx y Keycloak.

## Arquitectura del Sistema

```
Cliente (Web/Mobile)
    ↓
Nginx (Puerto 443 - HTTPS)
    ↓
API Gateway (Puerto 9000)
    ↓
Backend Core (Puerto 8081)
    ↓
PostgreSQL (Puerto 5432)
```

## Cambios Realizados

### 1. application.properties

Se han realizado los siguientes cambios:

- **Puerto**: Cambiado de `8080` a `8081` para evitar conflicto con Keycloak
- **CORS**: Actualizado para permitir `https://vetcare.US.KG` y `https://localhost`
- **Base de Datos**: Configurada con variables de entorno para mayor seguridad

### 2. Variables de Entorno

El backend ahora soporta las siguientes variables de entorno:

| Variable      | Descripción                    | Valor por Defecto                              |
| ------------- | ------------------------------ | ---------------------------------------------- |
| `DB_URL`      | URL de conexión a PostgreSQL   | `jdbc:postgresql://localhost:5432/vetcare_dev` |
| `DB_USERNAME` | Usuario de la base de datos    | `vetcare_user`                                 |
| `DB_PASSWORD` | Contraseña de la base de datos | `vetcare_pass`                                 |

---

## Configuración de Base de Datos

### Desarrollo (Local)

1. **Instalar PostgreSQL** (si no lo tienes):

   ```bash
   # Windows: Descargar desde https://www.postgresql.org/download/windows/
   # O usar Chocolatey:
   choco install postgresql
   ```

2. **Crear la base de datos**:

   ```sql
   -- Conectarse a PostgreSQL
   psql -U postgres

   -- Crear usuario
   CREATE USER vetcare_user WITH PASSWORD 'vetcare_pass';

   -- Crear base de datos
   CREATE DATABASE vetcare_dev OWNER vetcare_user;

   -- Dar permisos
   GRANT ALL PRIVILEGES ON DATABASE vetcare_dev TO vetcare_user;
   ```

3. **Ejecutar migraciones** (si tienes scripts SQL):
   ```bash
   psql -U vetcare_user -d vetcare_dev -f schema.sql
   ```

### Producción (VPS)

1. **Instalar PostgreSQL en el VPS**:

   ```bash
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   ```

2. **Configurar PostgreSQL**:

   ```bash
   # Cambiar a usuario postgres
   sudo -u postgres psql
   ```

   ```sql
   -- Crear usuario con contraseña segura
   CREATE USER vetcare_prod WITH PASSWORD 'TU_CONTRASEÑA_SEGURA_AQUI';

   -- Crear base de datos
   CREATE DATABASE vetcare_prod OWNER vetcare_prod;

   -- Dar permisos
   GRANT ALL PRIVILEGES ON DATABASE vetcare_prod TO vetcare_prod;
   ```

3. **Configurar variables de entorno en el VPS**:

   Crea un archivo `.env` en la carpeta del backend:

   ```bash
   DB_URL=jdbc:postgresql://localhost:5432/vetcare_prod
   DB_USERNAME=vetcare_prod
   DB_PASSWORD=TU_CONTRASEÑA_SEGURA_AQUI
   ```

---

## Ejecución del Backend

### Desarrollo (Local)

1. **Asegúrate de que PostgreSQL esté corriendo**:

   ```bash
   # Windows
   net start postgresql-x64-14
   ```

2. **Ejecutar el backend**:

   ```bash
   cd c:/Users/acer/Desktop/vetcare/backend
   ./gradlew bootRun
   ```

3. **Verificar que está corriendo**:
   - Abre: `http://localhost:8081/actuator/health`
   - Deberías ver: `{"status":"UP"}`

### Producción (VPS)

1. **Compilar el JAR**:

   ```bash
   ./gradlew clean build
   ```

2. **Copiar el JAR al VPS**:

   ```bash
   scp build/libs/vetapp-*.jar usuario@tu-vps:/home/usuario/backend/
   ```

3. **Ejecutar en el VPS**:

   ```bash
   # Cargar variables de entorno
   export $(cat .env | xargs)

   # Ejecutar el backend
   java -jar vetapp-*.jar
   ```

4. **Ejecutar como servicio (systemd)**:

   Crea el archivo `/etc/systemd/system/vetcare-backend.service`:

   ```ini
   [Unit]
   Description=Vetcare Backend Service
   After=postgresql.service

   [Service]
   Type=simple
   User=usuario
   WorkingDirectory=/home/usuario/backend
   EnvironmentFile=/home/usuario/backend/.env
   ExecStart=/usr/bin/java -jar /home/usuario/backend/vetapp-*.jar
   Restart=always

   [Install]
   WantedBy=multi-user.target
   ```

   Activar el servicio:

   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable vetcare-backend
   sudo systemctl start vetcare-backend
   sudo systemctl status vetcare-backend
   ```

---

## Verificación de la Integración

### 1. Verificar Backend Standalone

```bash
curl http://localhost:8081/actuator/health
```

### 2. Verificar a través del API Gateway

```bash
curl http://localhost:9000/api/health
```

### 3. Verificar a través de Nginx (Desarrollo)

```bash
curl -k https://localhost/api/health
```

### 4. Verificar en Producción

```bash
curl https://vetcare.US.KG/api/health
```

---

## Troubleshooting

### El backend no arranca

**Error**: `Port 8081 is already in use`

- **Solución**: Mata el proceso que usa el puerto:

  ```bash
  # Windows
  netstat -ano | findstr :8081
  taskkill /PID <PID> /F

  # Linux
  lsof -ti:8081 | xargs kill -9
  ```

### No conecta a la base de datos

**Error**: `Connection refused`

- **Solución**: Verifica que PostgreSQL esté corriendo:

  ```bash
  # Windows
  net start postgresql-x64-14

  # Linux
  sudo systemctl status postgresql
  ```

### CORS bloqueado

**Error**: `CORS policy: No 'Access-Control-Allow-Origin' header`

- **Solución**: Verifica que `https://vetcare.US.KG` esté en `allowed-origins` en `application.properties`

---

## Próximos Pasos
1. Configurar base de datos local
2. Probar flujo completo: Nginx → Gateway → Backend → BD
3. Desplegar en VPS
