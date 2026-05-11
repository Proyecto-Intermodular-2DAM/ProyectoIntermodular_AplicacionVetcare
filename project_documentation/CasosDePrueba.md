# Documentación de Casos de Prueba

En este documento se detallan los casos de prueba (Test Cases) para validar las funcionalidades principales de la aplicación VetCare, asegurando el correcto funcionamiento tanto de la lógica de negocio como de la interfaz de usuario.

## 1. Casos de Prueba Principales

| ID | Funcionalidad | Descripción del caso de prueba | Entrada | Resultado esperado | Resultado obtenido | Estado |
|---|---|---|---|---|---|---|
| **CP-01** | **Autenticación (Login Admin)** | Verificar el inicio de sesión de un administrador | Email: `rubenexvi@gmail.com`<br>Pass: ${CONT_RUBEN} | Acceso concedido al panel web. La pestaña "Empleados" es visible. | Acceso correcto, "Empleados" se muestra en el menú lateral. | ✅ Pasado |
| **CP-02** | **Autenticación (Login Cliente)** | Verificar que un cliente no puede entrar al panel web | Email: `alma@gmail.com`<br>Pass: ${CONT_ALMA} | Acceso denegado con mensaje indicando usar la app móvil. | Muestra el toast de error y no permite entrar. | ✅ Pasado |
| **CP-03** | **Validación de Login** | Comprobar validación de email con formato incorrecto | Email: `admin@vetcare`<br>Pass: ${CONT_ADMIN} | Mensaje de error de validación en el formulario ("Email no válido"). | El mensaje de error aparece bajo el campo. | ✅ Pasado |
| **CP-04** | **Protección de Rutas** | Intentar acceder al panel (`/home`) sin sesión iniciada | Acceso directo a `http://localhost:5173/home` | Redirección forzada a la vista de `/login`. | Redirige correctamente a `/login`. | ✅ Pasado |
| **CP-05** | **Añadir Animal** | Verificar que se añade un paciente/animal a la base de datos | Nombre: "Rex", Especie: "Perro", Propietario: "Alma" | El animal se guarda en la DB y aparece en el listado de animales. | El animal se guarda y se muestra en la tabla correctamente. | ✅ Pasado |
| **CP-06** | **Eliminar Cita** | Comprobar que una cita se puede cancelar/eliminar | Click en botón "Borrar" de una cita existente | La cita desaparece de la interfaz y de la base de datos. | La cita se elimina correctamente del sistema. | ✅ Pasado |
| **CP-07** | **Cerrar Sesión** | Verificar que el usuario puede cerrar su sesión de forma segura | Click en "Cerrar sesión" en el menú de usuario | La sesión (tokens) se invalida y el usuario es devuelto al Login. | Redirige al login y borra los datos locales. | ✅ Pasado |
| **CP-08** | **Auth Mobile (Supabase)** | Registro/login en app móvil con usuario Cleo | Rellenado los datos del formulario de registro con los datos de Cleo | Sesión creada en Supabase, funciona y redirige a `/home`. | Registro y login funcionales | ✅ Pasado |
| **CP-09** | **Creación de Adopción** |EL usuario Cleo adopta a Nala| Click en botón "Crear Adopción" | Se crea un registro en la tabla de adopciones con los datos de Cleo y Nala. | La adopción se crea correctamente en la tabla de adopciones. | ✅ Pasado |
| **CP-10** | **Carga de Datos (apiClient)** | Verificar inyección de token Bearer en peticiones autenticadas | Llamada a `/users` o cualquier endpoint tras login | Header `Authorization: Bearer <access_token>` presente en request gracias al interceptor de `apiClient.ts`. | Token inyectado correctamente, API responde con datos protegidos. | ✅ Pasado |
| **CP-11** | **Persistencia de Sesión** | Recargar página manteniendo sesión activa | F5 en `/home` con sesión válida de Supabase | `AuthContext` re-hidrata `user` y `profile` desde `getCurrentUser()` y `getUserProfile()` sin pedir login. | Sesión persistida tras recarga, usuario permanece autenticado. | ✅ Pasado |


## 2. Casos de prueba adicionales (Vitest)

Los siguientes casos se validan mediante tests unitarios ejecutables con `pnpm test.unit`:

| ID | Módulo | Descripción | Comando |
|---|---|---|---|
| **VT-01** | `authService.test.ts` (web) | Mock de Supabase: signIn, signOut, getUserProfile, onAuthStateChange | `cd frontend-web && pnpm test.unit` |
| **VT-02** | `AuthContext.test.tsx` (web) | Estado de auth: login carga perfil, logout limpia estado, loading gestionado | `cd frontend-web && pnpm test.unit` |
| **VT-03** | `ProtectedRoute.test.tsx` (web) | Redirección según rol: CLIENT → /login, ADMIN → render, sin auth → /login | `cd frontend-web && pnpm test.unit` |
| **VT-04** | `SideMenu.test.tsx` (web) | Render condicional: ADMIN ve "Empleados" y "Usuarios", empleado no-admin no los ve | `cd frontend-web && pnpm test.unit` |
| **VT-05** | `authService.test.ts` (mobile) | Mock de Supabase: signUp, signIn, signOut, resetPassword, updateProfile | `cd frontend-mobile && pnpm test.unit` |


## 3. Corrección de errores detectados

Durante las fases de desarrollo y pruebas se identificaron ciertos comportamientos anómalos que fueron solucionados:

### Error 1: Acceso de clientes al panel web
- **Problema:** Usuarios con rol `CLIENT` podían iniciar sesión en el panel web y visualizar la pantalla principal antes de ser expulsados.
- **Causa:** El componente `ProtectedRoute.tsx` solo validaba la existencia de sesión (`user !== null`) mediante Supabase Auth, pero no comprobaba el rol del perfil obtenido desde la API. Un cliente con credenciales válidas de Supabase pasaba la primera barrera de autenticación.
- **Solución:** Se añadió validación explícita de rol en `ProtectedRoute.tsx` (`profile.role === 'CLIENT'`) y en `Login.tsx` (tras obtener el perfil post-login, se rechaza al cliente con toast de error y se ejecuta `signOut()`).

### Error 2: Menú lateral sin filtrado por rol
- **Problema:** El menú lateral mostraba las pestañas "Empleados", "Usuarios" y "Roles Y Permisos" a cualquier usuario autenticado, independientemente de su rol.
- **Causa:** `SideMenu.tsx` definía el array de items estáticamente sin consultar el rol del usuario. No existía lógica condicional para ocultar opciones de administración.
- **Solución:** Se implementó `isAdmin = profile?.role === 'ADMIN'` mediante `useAuth()`. Las opciones de "Empleados" (main menu) y "Usuarios" (secondary menu) se inyectan condicionalmente con `unshift()` únicamente cuando `isAdmin` es `true`.

### Error 3: Logout no funcional y datos de usuario hardcodeados
- **Problema:** El botón "Cerrar Sesión" en `UserMenu.tsx` no cerraba la sesión realmente (solo hacía `console.log`). Además, el `TopBar.tsx` y `UserMenu.tsx` mostraban avatar "P" y nombre "Raul" fijos, sin importar quién estuviera autenticado.
- **Causa:** El componente `UserMenu` no estaba conectado al `AuthContext`. No usaba `authService.signOut()` ni leía los datos dinámicos del perfil.
- **Solución:** Se conectó `UserMenu.tsx` a `useAuth()`, implementando `handleLogout` que llama a `authService.signOut()`, limpia el estado del contexto y cierra el menú. Se actualizó `TopBar.tsx` para leer `profile.first_name` / `user.email` en lugar de valores hardcodeados.

### Error 4: Inconsistencia en nombres de roles (Frontend vs Backend)
- **Problema:** El frontend web usaba strings en español (`'Administrador'`, `'Recepcionista'`, `'Veterinario'`, `'Cuidador'`, `'Cirujano'`, `'CLIENT'`) mientras que el backend Spring Boot usaba el enum en inglés (`ADMIN`, `CLIENT`, `VETERINARIAN`, `RECEPTIONIST`, `CAREGIVER`, `SURGEON`). Esto generaba confusión y potenciales bugs de comparación.
- **Causa:** El frontend web fue desarrollado inicialmente con un sistema mock de autenticación que usaba nombres en español. El backend Java usaba convenciones estándar en inglés. No existía una capa de mapeo entre ambos.
- **Solución:** Se unificó el frontend para usar los valores exactos del backend (`ADMIN`, `CLIENT`, `VETERINARIAN`, etc.) obtenidos directamente desde la columna `role` de la tabla `users` en PostgreSQL/Supabase. Las comparaciones en `ProtectedRoute`, `SideMenu` y `Login` ahora usan el valor canónico de la base de datos.

## 4. Ejecución de tests unitarios (Vitest)

Los tests unitarios se ejecutan con **Vitest** configurado con `globals: true` y entorno `jsdom`.

### Frontend Web
```bash
cd frontend-web
pnpm test.unit
```

Tests disponibles:
- `src/services/authService.test.ts` — Mock de Supabase Auth (signIn, signOut, getUserProfile, onAuthStateChange)
- `src/contexts/AuthContext.test.tsx` — Estado de autenticación (login, logout, loading, perfil)
- `src/components/ProtectedRoute.test.tsx` — Redirecciones según rol y estado de sesión
- `src/components/SideMenu.test.tsx` — Render condicional de items de menú según rol

### Frontend Mobile
```bash
cd frontend-mobile
pnpm test.unit
```

Tests disponibles:
- `src/services/authService.test.ts` — Mock de Supabase Auth (signUp, signIn, signOut, resetPassword, updateProfile, getPublicUserProfile)

### Notas técnicas
- Se usa `vi.mock()` para interceptar `@supabase/supabase-js` y simular respuestas de auth.
- Se usa `vi.mock()` para interceptar módulos locales (`apiClient`, `authService`) y evitar llamadas reales a la red.
- `AuthContext` se prueba envolviendo componentes con `<AuthProvider>` o mockeando `useAuth()` directamente.
- Los componentes React se prueban con `@testing-library/react` (render, screen, fireEvent).

---

*🛠️ Herramientas utilizadas para las pruebas: DevTools del navegador (Network & Console), Postman (API requests), Cypress (E2E testing) y Vitest (unit testing).*

*📅 Última actualización: 2026-05-10 | Rama: `develop`*
