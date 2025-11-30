# Configuración OAuth2 Resource Server - Backend Vetcare

## ¿Qué hemos configurado?

El backend ahora actúa como **OAuth2 Resource Server**, validando tokens JWT de Keycloak de forma independiente al API Gateway.

## Archivos Modificados/Creados

### 1. `application.properties`

```properties
spring.security.oauth2.resourceserver.jwt.issuer-uri=http://localhost:8080/realms/vetcare
```

Esta configuración le dice a Spring Security:

- Dónde está Keycloak
- Qué realm usar (`vetcare`)
- Automáticamente descarga las claves públicas (JWK) para validar tokens

### 2. `SecurityConfig.java` (NUEVO)

Ubicación: `src/main/java/com/vetcare/vetapp/config/SecurityConfig.java`

**Características:**

- Valida tokens JWT automáticamente
- Configura CORS para permitir peticiones desde frontend
- Endpoints públicos: `/actuator/health`
- Todos los demás endpoints requieren autenticación
- Soporta `@PreAuthorize` para control granular

### 3. `build.gradle` (A ACTUALIZAR)

Necesitas añadir esta dependencia:

```gradle
dependencies {
    // ... otras dependencias ...

    implementation 'org.springframework.boot:spring-boot-starter-security'
    implementation 'org.springframework.boot:spring-boot-starter-oauth2-resource-server' // ← AÑADIR ESTA

    // ... otras dependencias ...
}
```

## Cómo Funciona

### Flujo de Autenticación

```
1. Cliente obtiene token de Keycloak
   ↓
2. Cliente envía petición con token en header:
   Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
   ↓
3. Nginx recibe y reenvía al API Gateway
   ↓
4. API Gateway valida el token (primera validación)
   ↓
5. Backend valida el token OTRA VEZ (segunda validación)
   ↓
6. Si es válido, procesa la petición
```

### Extracción de Información del Token

En tus controladores, puedes acceder a la información del usuario:

```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping("/me")
    public ResponseEntity<UserInfo> getCurrentUser(
        @AuthenticationPrincipal Jwt jwt
    ) {
        String username = jwt.getClaimAsString("preferred_username");
        String email = jwt.getClaimAsString("email");
        List<String> roles = jwt.getClaimAsStringList("realm_access.roles");

        return ResponseEntity.ok(new UserInfo(username, email, roles));
    }
}
```

### Control de Acceso por Roles

Puedes usar `@PreAuthorize` en tus métodos:

```java
@PreAuthorize("hasRole('ADMIN')")
@DeleteMapping("/{id}")
public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
    userService.delete(id);
    return ResponseEntity.noContent().build();
}

@PreAuthorize("hasAnyRole('ADMIN', 'VETERINARIO')")
@GetMapping("/appointments")
public ResponseEntity<List<Appointment>> getAppointments() {
    return ResponseEntity.ok(appointmentService.findAll());
}
```

## Variables de Entorno

### Desarrollo

```bash
# No necesitas configurar nada, usa los valores por defecto
```

### Producción

Actualiza `.env`:

```bash
KEYCLOAK_ISSUER_URI=https://vetcare.US.KG/auth/realms/vetcare
```

## Verificación

### 1. Obtener un Token de Keycloak

```bash
curl -X POST http://localhost:8080/realms/vetcare/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=vetcare-client" \
  -d "username=admin" \
  -d "password=admin" \
  -d "grant_type=password"
```

Respuesta:

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 300,
  "refresh_token": "..."
}
```

### 2. Usar el Token en una Petición

```bash
curl -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..." \
  http://localhost:8081/api/users/me
```

### 3. Probar sin Token (debe fallar)

```bash
curl http://localhost:8081/api/users/me
# Respuesta: 401 Unauthorized
```

## Troubleshooting

### Error: "An error occurred while attempting to decode the Jwt"

**Causa**: El backend no puede conectarse a Keycloak para obtener las claves públicas.

**Solución**:

1. Verifica que Keycloak esté corriendo: `docker-compose ps`
2. Verifica la URL en `application.properties`
3. Asegúrate de que el realm `vetcare` existe en Keycloak

### Error: "Invalid token"

**Causa**: El token ha expirado o no es válido.

**Solución**: Obtén un nuevo token de Keycloak.

### CORS Error

**Causa**: El frontend no está en la lista de orígenes permitidos.

**Solución**: Añade la URL del frontend en `SecurityConfig.java`:

```java
configuration.setAllowedOrigins(Arrays.asList(
    "http://localhost:3000",
    "https://tu-nuevo-origen.com"
));
```

## Próximos Pasos

1.  Reiniciar el backend
2.  Configurar roles en Keycloak
3.  Probar autenticación con Postman o curl
4.  Implementar `@PreAuthorize` en tus controladores
