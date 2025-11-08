## Viavilidad del proyecto
**3.1 Viabilidad técnica**

El proyecto es totalmente factible desde el punto de vista técnico, utilizando tecnologías modernas y ampliamente probadas.

Para el frontend se empleará React con Ionic tanto para web como para móvil, lo que permite compartir gran parte del código entre plataformas y reducir tiempo de desarrollo.

El backend estará desarrollado con Spring Boot, ofreciendo una API REST segura, y se ejecutará dentro de contenedores Docker para facilitar pruebas, despliegue y portabilidad.

La base de datos elegida será PostgreSQL, que proporciona robustez, capacidad para gestionar usuarios y roles de manera segura.

Para el control de versiones se utilizará Git junto con GitHub, lo que permitirá gestionar ramas, colaborar de manera eficiente y mantener un historial completo de cambios del proyecto.

La gestión de tareas y la organización del equipo se llevará a cabo mediante Trello, facilitando la planificación, el seguimiento de actividades y la coordinación entre los miembros del proyecto.

**3.2 Viabilidad económica**

Desde el punto de vista económico, el proyecto es viable y escalable según las necesidades. Todas las herramientas y tecnologías seleccionadas son open source, por lo que no requieren licencias de software.

Para el despliegue se utilizará infraestructura en la nube como AWS o que ofrece planes gratuitos para el desarrollo y pruebas iniciales.

En producción, los costes se limitarán al uso de bases de datos gestionadas, contenedores y almacenamiento adicional, los cuales son predecibles y crecen de manera proporcional al número de usuarios y tráfico, sin necesidad de una inversión inicial significativa.

**3.3 Viabilidad operativa**

El proyecto es realista de implementar y mantener en el tiempo. La API centralizada permite gestionar todas las funcionalidades desde un único punto, facilitando actualizaciones, parches y control de seguridad sin afectar al frontend web o móvil.

El flujo de usuarios está diseñado para ser sencillo: el administrador crea las cuentas y los empleados solo inician sesión con sus credenciales proporcionadas, cambiando la contraseña en su primer acceso.

Esta organización reduce la carga sobre el equipo de soporte y asegura una experiencia de usuario intuitiva. Además, el uso de Docker y PostgreSQL facilita tareas de backup, escalado y restauración ante posibles incidencias, garantizando la estabilidad y mantenibilidad a medio y largo plazo.

