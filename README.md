# Elytra

**Elytra** es una aplicación móvil desarrollada con **React Native**, **Expo** y **Firebase** para ayudar a las parejas a planificar, registrar y recordar experiencias compartidas.

La aplicación permite crear planes, completarlos, calificarlos, comentar cómo fue la experiencia y conservar fotografías de cada momento.

## Características

- Autenticación de usuarios con Firebase Authentication.
- Creación y gestión de planes.
- Marcar planes como completados o cancelados.
- Calificar cada experiencia.
- Agregar comentarios a los planes.
- Subir y visualizar fotografías.
- Sincronización en tiempo real mediante Cloud Firestore.
- Compatible con Android e iOS mediante Expo.

## Tecnologías

- React Native
- Expo
- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- Expo Router _(opcional)_
- TypeScript _(opcional)_

## Estructura del proyecto

```text
src/
│
├── assets/
├── components/
├── constants/
├── hooks/
├── navigation/
├── screens/
├── services/
├── utils/
└── App.js
```

## Instalación

Clona el repositorio:

```bash
git clone https://github.com/Sneider-09/my-app-dates.git
```

Ingresa al proyecto:

```bash
cd my-app-dates
```

Instala las dependencias:

```bash
npm install
```

Inicia la aplicación:

```bash
npx expo start
```

## Configuración de Firebase

Crea un proyecto en Firebase y habilita los siguientes servicios:

- Authentication
- Cloud Firestore
- Storage

Luego agrega la configuración de Firebase al proyecto con las credenciales correspondientes.

## Funcionalidades planeadas

- [ ] Invitaciones entre parejas.
- [ ] Notificaciones.
- [ ] Calendario de planes.
- [ ] Estadísticas.
- [ ] Logros.
- [ ] Sugerencias de citas.
- [ ] Modo oscuro.
- [ ] Compartir recuerdos.

## Licencia

Este proyecto está distribuido bajo la licencia MIT.

## Autor

Desarrollado por **Sneider Castro**.
