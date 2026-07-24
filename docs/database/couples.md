# Colección `couples`

**Archivo:** `docs/database/couples.md`

## Descripción

La colección `couples` almacena la información compartida entre dos usuarios que conforman una relación dentro de Elytra.

Cada documento representa una única relación y centraliza la información común que no pertenece exclusivamente a uno de los integrantes, evitando la duplicación de datos entre los perfiles de usuario.

Los usuarios relacionados se identifican mediante el campo `members`, mientras que cada usuario mantiene una referencia a esta colección a través del campo `coupleId` almacenado en la colección `users`.

---

## Estructura

```text
couples
└── coupleId
    ├── members              array<string>
    ├── relationshipName     string
    ├── anniversary          timestamp | null
    ├── createdAt            timestamp
    ├── updatedAt            timestamp
    ├── status               string
    └── createdBy            string
```

---

## Campos

| Campo            | Tipo              | Obligatorio | Descripción                                                                                                           |
| ---------------- | ----------------- | ----------- | --------------------------------------------------------------------------------------------------------------------- |
| members          | array\<string>    | Sí          | Lista de los `uid` de los usuarios que pertenecen a la relación. Actualmente debe contener exactamente dos elementos. |
| relationshipName | string            | Sí          | Nombre personalizado asignado a la relación (por ejemplo: _Nosotros_, _Los Gómez_, _Mi Amor_).                        |
| anniversary      | timestamp \| null | No          | Fecha del aniversario de la relación. Puede ser `null` si aún no ha sido configurada.                                 |
| createdAt        | timestamp         | Sí          | Timestamp de Firestore generado al crear el documento. Es un valor inmutable.                                         |
| updatedAt        | timestamp         | Sí          | Timestamp de Firestore actualizado cada vez que se modifica la información de la relación.                            |
| status           | string            | Sí          | Estado actual de la relación. Valores permitidos: `active`, `paused` o `ended`.                                       |
| createdBy        | string            | Sí          | `uid` del usuario que creó inicialmente la relación.                                                                  |

---

## Ejemplo

```json
{
  "members": ["uidUsuario1", "uidUsuario2"],
  "relationshipName": "Nuestro espacio",
  "anniversary": "2025-08-15T00:00:00Z",
  "createdAt": "2026-07-23T15:30:00Z",
  "updatedAt": "2026-07-23T15:30:00Z",
  "status": "active",
  "createdBy": "uidUsuario1"
}
```

---

## Relaciones

### Users

```text
users/{uid}
      │
      └── coupleId
              │
              ▼
     couples/{coupleId}
```

Cada usuario perteneciente a una relación almacena el identificador del documento de `couples` en el campo `coupleId`.

---

### Miembros de la relación

```text
couples
    │
    └── members[]
            │
            ├── uidUsuario1
            └── uidUsuario2
                    │
                    ▼
             users/{uid}
```

El campo `members` contiene los identificadores (`uid`) de los usuarios participantes de la relación.

Actualmente Elytra soporta relaciones compuestas por dos integrantes.

---

## Decisiones de diseño

### Centralizar la información compartida

**Decisión**

Toda la información común de una relación se almacena en un único documento dentro de la colección `couples`.

**Justificación**

- Evita duplicar información entre ambos perfiles.
- Reduce el riesgo de inconsistencias.
- Facilita la actualización de información compartida.
- Simplifica el desarrollo de funcionalidades colaborativas.

---

### Uso de un arreglo para los miembros

**Decisión**

Los integrantes de la relación se almacenan en un arreglo llamado `members`.

**Justificación**

- Permite consultar fácilmente si un usuario pertenece a una relación.
- Facilita consultas utilizando operadores como `array-contains`.
- Mantiene una estructura simple y escalable.

---

### Estado de la relación

**Decisión**

El estado de la relación se controla mediante el campo `status`.

**Valores permitidos**

- `active`
- `paused`
- `ended`

**Justificación**

Evita eliminar información histórica y permite implementar funcionalidades futuras como reactivación de relaciones, historial o archivado.

---

## Alternativas de diseño

### Opción recomendada (actual)

Mantener un único documento por relación.

**Ventajas**

- Menor duplicación de datos.
- Actualizaciones sencillas.
- Fácil mantenimiento.
- Escalable para nuevas funcionalidades compartidas.

**Desventajas**

- Requiere mantener sincronizado el campo `coupleId` en cada usuario.

---

### Alternativa

Guardar la información de la relación dentro del documento de cada usuario.

**Ventajas**

- Menor cantidad de consultas para obtener información básica.

**Desventajas**

- Duplica información.
- Mayor riesgo de inconsistencias.
- Actualizaciones dobles.
- Más difícil de mantener.

---

### Motivo de la elección

Se eligió una colección independiente porque sigue una estructura más normalizada, facilita el mantenimiento y permite que futuras funcionalidades compartidas (chat, calendario, recuerdos, metas, etc.) dependan de un único identificador de relación.

---

## Consideraciones

- Cada documento representa una única relación.
- Actualmente `members` debe contener exactamente dos `uid`.
- Todos los identificadores almacenados en `members` deben existir previamente en la colección `users`.
- Ambos usuarios deben almacenar el mismo `coupleId` en su documento correspondiente.
- `createdBy` debe corresponder a uno de los integrantes almacenados en `members`.
- `createdAt` nunca debe modificarse.
- `updatedAt` debe actualizarse en cada modificación del documento.
- `status` únicamente puede tomar los valores `active`, `paused` o `ended`.
- No se recomienda eliminar relaciones; es preferible cambiar su estado a `ended` para conservar el historial y evitar referencias inválidas.

---

## Utilizado por

### Funcionalidades actuales

- Creación de parejas.
- Gestión de la relación.
- Perfil compartido.
- Configuración de la pareja.

### Funcionalidades planificadas

- Chat compartido.
- Calendario compartido.
- Recuerdos.
- Fechas especiales.
- Álbum de fotografías.
- Metas de pareja.
- Notificaciones compartidas.
- Estadísticas de la relación.

---

## Referencias

- `docs/database/users.md`
- `docs/features/authentication.md`
- `docs/architecture/firestore.md`
