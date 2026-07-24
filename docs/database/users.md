# Colección `users`

**Archivo:** `docs/database/users.md`

## Descripción

La colección `users` almacena la información personal de cada usuario registrado en Elytra.

Cada documento representa un único usuario y utiliza como identificador el `uid` generado por Firebase Authentication, garantizando una relación uno a uno entre la cuenta autenticada y su perfil.

La información compartida entre dos usuarios (pareja) no se almacena en esta colección, sino en la colección `couples`, evitando duplicidad de datos y facilitando el mantenimiento de la información.

---

## Estructura

```text
users
└── uid
    ├── displayName          string
    ├── email                string
    ├── photoURL             string
    ├── birthday             string | null
    ├── coupleId             string | null
    ├── createdAt            timestamp
    └── updatedAt            timestamp
```

---

## Campos

| Campo       | Tipo           | Obligatorio | Descripción                                                                                                        |
| ----------- | -------------- | ----------- | ------------------------------------------------------------------------------------------------------------------ |
| displayName | string         | Sí          | Nombre visible del usuario dentro de la aplicación.                                                                |
| email       | string         | Sí          | Correo electrónico asociado a la cuenta de Firebase Authentication.                                                |
| photoURL    | string         | Sí          | URL pública de la imagen de perfil almacenada en Cloudinary.                                                       |
| birthday    | string \| null | No          | Fecha de nacimiento del usuario en formato `YYYY-MM-DD`. Puede ser `null` si aún no ha sido registrada.            |
| coupleId    | string \| null | No          | Identificador del documento en la colección `couples`. Será `null` cuando el usuario no pertenezca a una relación. |
| createdAt   | timestamp      | Sí          | Timestamp de Firestore generado al momento de crear el documento. Este valor es inmutable.                         |
| updatedAt   | timestamp      | Sí          | Timestamp de Firestore actualizado cada vez que el documento es modificado.                                        |

---

## Ejemplo

```json
{
  "displayName": "Sneider Castro",
  "email": "sneider@email.com",
  "photoURL": "https://res.cloudinary.com/elytra/image/upload/v123456/profile.jpg",
  "birthday": "1998-05-14",
  "coupleId": null,
  "createdAt": "2026-07-23T15:30:00Z",
  "updatedAt": "2026-07-23T15:30:00Z"
}
```

---

## Relaciones

### Firebase Authentication

```text
Firebase Authentication
            │
            ▼
      users/{uid}
```

El identificador del documento (`uid`) corresponde exactamente al generado por Firebase Authentication durante el registro del usuario.

Esta relación garantiza una correspondencia uno a uno entre la cuenta autenticada y el perfil almacenado en Firestore.

---

### Couples

```text
users
    │
    └── coupleId
            │
            ▼
couples/{coupleId}
```

Cuando `coupleId` contiene un valor, referencia el documento correspondiente en la colección `couples`.

Si su valor es `null`, significa que el usuario aún no pertenece a una relación.

---

## Decisiones de diseño

### Uso del `uid` como identificador del documento

**Decisión**

Utilizar el `uid` generado por Firebase Authentication como ID del documento en la colección `users`.

**Justificación**

- Evita mantener una relación adicional entre Authentication y Firestore.
- Simplifica las consultas y actualizaciones del perfil.
- Garantiza una relación uno a uno entre la autenticación y la información del usuario.
- Sigue las recomendaciones habituales de Firebase para aplicaciones con autenticación.

---

### Separación entre usuario y pareja

**Decisión**

La información propia del usuario permanece en `users`, mientras que la información compartida entre ambos integrantes de la relación se almacena en `couples`.

**Justificación**

- Evita duplicar información.
- Reduce inconsistencias entre perfiles.
- Facilita la escalabilidad para futuras funcionalidades compartidas.

---

## Consideraciones

- Todo usuario autenticado debe tener un documento asociado en la colección `users`.
- El documento debe crearse inmediatamente después del registro exitoso en Firebase Authentication.
- El `uid` del documento nunca debe modificarse.
- `createdAt` nunca debe actualizarse después de la creación del documento.
- `updatedAt` debe actualizarse en cada modificación del perfil.
- `coupleId` debe contener un identificador válido de la colección `couples` o permanecer como `null`.
- `photoURL` únicamente almacena la URL pública del recurso alojado en Cloudinary; la imagen no se almacena en Firestore.
- Nunca eliminar un usuario únicamente desde Firestore. Cualquier eliminación debe considerar primero la cuenta en Firebase Authentication para evitar datos huérfanos.

---

## Utilizado por

### Funcionalidades actuales

- Registro de usuarios.
- Inicio de sesión.
- Perfil de usuario.
- Edición de perfil.
- Ajustes de la cuenta.
- Sistema de parejas.

### Funcionalidades planificadas

- Chat.
- Calendario compartido.
- Recuerdos.
- Notificaciones personalizadas.
- Estadísticas de la relación.

---

## Referencias

- `docs/database/couples.md`
- `docs/features/authentication.md`
- `docs/architecture/firestore.md`
