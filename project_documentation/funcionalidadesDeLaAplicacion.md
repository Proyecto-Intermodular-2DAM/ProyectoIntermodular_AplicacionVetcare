En este apartado se muestra la definición de los requisitos tanto funcionales como no funcionales.

**2.1 Requisitos Funcionales**


| RF01         |                                                                                                                                                       |
|:-------------|:------------------------------------------------------------------------------------------------------------------------------------------------------|
| NOMBRE:      | Inicio de sesión                                                                                                                                      |
| PRIORIDAD:   | Alta                                                                                                                                                  |
| DESCRIPCIÓN: | La aplicación permite iniciar sesión a los usuarios (empleados o clientes) mediante usuario y contraseña. También permitirá recuperar la contraseña.  |

| RF02         |                                                                 |
|:-------------|:----------------------------------------------------------------|
| NOMBRE:      | Registro de usuarios                                            |
| PRIORIDAD:   | Alta                                                            |
| DESCRIPCIÓN: | La aplicación permite registrar o modificar cuentas de usuario  |

| RF03         |                                                                                                |
|:-------------|:-----------------------------------------------------------------------------------------------|
| NOMBRE:      | Registro de cliente                                                                            |
| PRIORIDAD:   | Alta                                                                                           |
| DESCRIPCIÓN: | La aplicación permite crear y modificar los datos personales de los clientes de los centros.   |

| RF04         |                                                                                                                       |
|:-------------|:----------------------------------------------------------------------------------------------------------------------|
| NOMBRE:      | Registro de mascotas                                                                                                  |
| PRIORIDAD:   | Alta                                                                                                                  |
| DESCRIPCIÓN: | La aplicación permite registrar o modificar mascotas asociadas a clientes, indicando especie, raza y datos médicos.   |

| RF05         |                                                                                                  |
|:-------------|:-------------------------------------------------------------------------------------------------|
| NOMBRE:      | Gestión de citas                                                                                 |
| PRIORIDAD:   | Alta                                                                                             |
| DESCRIPCIÓN: | Permite la creación, modificación y cancelación de citas, asignando sala, centro y veterinario.  |

| RF06         |                                                                                                                |
|:-------------|:---------------------------------------------------------------------------------------------------------------|
| NOMBRE:      | Gestión de historial                                                                                           |
| PRIORIDAD:   | Alta                                                                                                           |
| DESCRIPCIÓN: | Permite la consulta y actualización del historial médico de las mascotas, incluyendo tratamientos y cirugías.  |

| RF07         |                                                                                                                                      |
|:-------------|:-------------------------------------------------------------------------------------------------------------------------------------|
| NOMBRE:      | Gestión de adopción                                                                                                                  |
| PRIORIDAD:   | Media                                                                                                                                |
| DESCRIPCIÓN: | La aplicación Permite el registro de animales en adopción y la gestión de los animales adoptados, exportando el informe de adopción. |

| RF08         |                                                                               |
|:-------------|:------------------------------------------------------------------------------|
| NOMBRE:      | Citas del cliente (App móvil)                                                 |
| PRIORIDAD:   | Media                                                                         |
| DESCRIPCIÓN: | Permite a los clientes consultar y solicitar citas desde la aplicación móvil. |

| RF09          |                                                                                              |
|:--------------|:---------------------------------------------------------------------------------------------|
| NOMBRE:       | Consultar tratamientos (App móvil)                                                           |
| PRIORIDAD:    | Media                                                                                        |
| DESCRIPCIÓN:  | Permite a los clientes consultar los tratamientos y revisiones indicados para sus mascotas.  |

| RF010         |                                                                                  |
|:--------------|:---------------------------------------------------------------------------------|
| NOMBRE:       | Notificaciones y recordatorios                                                   |
| PRIORIDAD:    | Media                                                                            |
| DESCRIPCIÓN:  | Envía recordatorios automáticos sobre citas próximas o tratamientos pendientes.  |

| RF011        |                                                                                             |
|:-------------|:--------------------------------------------------------------------------------------------|
| NOMBRE:      | Exploración de adopciones (App móvil)                                                       |
| PRIORIDAD:   | Media                                                                                       |
| DESCRIPCIÓN: | Permite a los usuarios consultar animales disponibles para adopción y realizar solicitudes. |

\
**2.2 Requisitos no Funcionales**

| RNF01        |                                                                                                                                                                           |
|:-------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| NOMBRE:      | Seguridad en el acceso                                                                                                                                                    |
| PRIORIDAD:   | Alta                                                                                                                                                                      |
| DESCRIPCIÓN: | La aplicación debe garantizar la seguridad de los datos de los usuarios mediante cifrado de contraseñas, protocolos seguros (HTTPS/TLS) y protección de datos personales. |

| RNF02        |                                                                                                          |
|:-------------|:---------------------------------------------------------------------------------------------------------|
| NOMBRE:      | Disponibilidad                                                                                           |
| PRIORIDAD:   | Alta                                                                                                     |
| DESCRIPCIÓN: | La aplicación debe estar disponible al menos el 99% del tiempo para garantizar el acceso a los usuarios. |

| RNF03        |                                                                                                                                                              |
|:-------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| NOMBRE:      | Rendimiento                                                                                                                                                  |
| PRIORIDAD:   | Alta                                                                                                                                                         |
| DESCRIPCIÓN: | El tiempo de respuesta de la aplicación no debe superar los 3 segundos en las operaciones principales (inicio de sesión, carga de citas, registro de datos). |

| RNF04        |                                                                                                         |
|:-------------|:--------------------------------------------------------------------------------------------------------|
| NOMBRE:      | Escalabilidad                                                                                           |
| PRIORIDAD:   | Media                                                                                                   |
| DESCRIPCIÓN: | La aplicación debe soportar el crecimiento de usuarios, clientes y centros sin degradar el rendimiento. |

| RNF05        |                                                                                                                                                                      |
|:-------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| NOMBRE:      | Usabilidad                                                                                                                                                           |
| PRIORIDAD:   | Alta                                                                                                                                                                 |
| DESCRIPCIÓN: | La interfaz debe ser intuitiva, clara y accesible para cualquier usuario, minimizando la curva de aprendizaje, adaptado a distintos perfiles (empleados y clientes). |

| RNF06        |                                                                                                                                    |
|:-------------|:-----------------------------------------------------------------------------------------------------------------------------------|
| NOMBRE:      | Mantenibilidad                                                                                                                     |
| PRIORIDAD:   | Media                                                                                                                              |
| DESCRIPCIÓN: | El sistema debe estar desarrollado con código modular, documentado y con separación clara entre frontend, backend y base de datos. |

| RNF07        |                                                                                                |
|:-------------|:-----------------------------------------------------------------------------------------------|
| NOMBRE:      | Compatibilidad                                                                                 |
| PRIORIDAD:   | Media                                                                                          |
| DESCRIPCIÓN: | La aplicación debe ser compatible con navegadores modernos y dispositivos móviles Android/iOS. |






