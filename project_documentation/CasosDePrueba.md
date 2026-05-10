# Documentación de Casos de Prueba

En este documento se detallan los casos de prueba (Test Cases) para validar las funcionalidades principales de la aplicación VetCare, asegurando el correcto funcionamiento tanto de la lógica de negocio como de la interfaz de usuario.

## 1. Casos de Prueba Principales

| ID | Funcionalidad | Descripción del caso de prueba | Entrada | Resultado esperado | Resultado obtenido | Estado |
|---|---|---|---|---|---|---|
| **CP-01** | **Autenticación (Login Admin)** | Verificar el inicio de sesión de un administrador | Email: `rubenexvi@gmail.com`<br>Pass: `Rubenico*00` | Acceso concedido al panel web. La pestaña "Empleados" es visible. | Acceso correcto, "Empleados" se muestra en el menú lateral. | ✅ Pasado |
| **CP-02** | **Autenticación (Login Cliente)** | Verificar que un cliente no puede entrar al panel web | Email: `alma@gmail.com`<br>Pass: `A123456789*a` | Acceso denegado con mensaje indicando usar la app móvil. | Muestra el toast de error y no permite entrar. | ✅ Pasado |
| **CP-03** | **Validación de Login** | Comprobar validación de email con formato incorrecto | Email: `admin@vetcare`<br>Pass: `1234` | Mensaje de error de validación en el formulario ("Email no válido"). | El mensaje de error aparece bajo el campo. | ✅ Pasado |
| **CP-04** | **Protección de Rutas** | Intentar acceder al panel (`/home`) sin sesión iniciada | Acceso directo a `http://localhost:5173/home` | Redirección forzada a la vista de `/login`. | Redirige correctamente a `/login`. | ✅ Pasado |
| **CP-05** | **Añadir Animal** | Verificar que se añade un paciente/animal a la base de datos | Nombre: "Rex", Especie: "Perro", Propietario: "Juan" | El animal se guarda en la DB y aparece en el listado de animales. | El animal se guarda y se muestra en la tabla correctamente. | ✅ Pasado |
| **CP-06** | **Eliminar Cita** | Comprobar que una cita se puede cancelar/eliminar | Click en botón "Borrar" de una cita existente | La cita desaparece de la interfaz y de la base de datos. | La cita se elimina correctamente del sistema. | ✅ Pasado |
| **CP-07** | **Cerrar Sesión** | Verificar que el usuario puede cerrar su sesión de forma segura | Click en "Cerrar sesión" en el menú de usuario | La sesión (tokens) se invalida y el usuario es devuelto al Login. | Redirige al login y borra los datos locales. | ✅ Pasado |


## 2. Corrección de errores detectados

Durante las fases de desarrollo y pruebas se identificaron ciertos comportamientos anómalos que fueron solucionados:

### Error 1: Control de Acceso Erróneo (Asignación de roles)
- **Qué problema se detectó:** Usuarios reales como administradores o clientes estaban siendo asignados al rol "Recepcionista" por defecto en el panel web (cuando se usaba el sistema de mock).
- **Qué lo causaba:** El servicio de autenticación asignaba el rol en base a si el email contenía la palabra "client". Los emails que no cumplían esa regla, como `rubenexvi@gmail.com`, recibían el rol predeterminado de recepcionista, ocultando pestañas de administración.
- **Cómo fue solucionado:** Se reemplazó completamente el sistema de mock por una integración real con Supabase Auth y la base de datos PostgreSQL, obteniendo el rol de usuario real directamente de la base de datos (`UserRole`) tras validar las credenciales.

### Error 2: Acceso de clientes al panel web
- **Qué problema se detectó:** Algunos usuarios con rol cliente podían visualizar la pantalla principal del panel web antes de ser expulsados.
- **Qué lo causaba:** El componente de rutas protegidas comprobaba el rol de manera asíncrona pero renderizaba los componentes hijos prematuramente.
- **Cómo fue solucionado:** Se refactorizó `AuthContext.tsx` y `ProtectedRoute.tsx` para esperar al estado de carga (`loading`) de Supabase antes de decidir si redirigir al `/login` o mostrar el panel web.

### Error 3: Permisos en menú lateral y validación de clientes
- **Qué problema se detectó:** Tras la migración a la API, los clientes seguían pudiendo hacer login, y el menú lateral mostraba las pestañas "Empleados" y "Usuarios" a roles no administradores.
- **Qué lo causaba:** La validación en el login y en las rutas protegidas comprobaba el string `'Cliente'` en lugar de la constante real de la base de datos `'CLIENT'`. Además, el componente `SideMenu.tsx` renderizaba el listado completo de menú sin hacer un filtrado por rol.
- **Cómo fue solucionado:** Se actualizó la lógica condicional en `ProtectedRoute.tsx` y `Login.tsx` para que coincida exactamente con el valor `CLIENT`. Se implementó lógica dinámica en el menú lateral (importando `useAuth`) para añadir las vistas de "Empleados" y "Usuarios" únicamente si el perfil activo tiene rol `ADMIN`.

---

*🛠️ Herramientas utilizadas para las pruebas: DevTools del navegador (Network & Console), Postman (API requests) y Cypress (E2E testing).*
