# Colección `plans`

**Archivo:** `docs/database/plans.md`

## Descripción

La colección `plans` almacena los planes creados dentro de una relación de Elytra.

Cada documento representa un único plan asociado a una pareja mediante `coupleId`. Los planes pueden representar diferentes tipos de actividades, como comida, lugares o actividades compartidas.

Un plan comienza con el estado `pending`. Cuando el plan finaliza o es cancelado, su estado cambia a `completed` o `cancelled` y se registra la fecha correspondiente en `completedAt`.

---

## Estructura

```text
plans
└── planId
    ├── coupleId       string
    ├── createdBy      string
    ├── title          string
    ├── description    string
    ├── location       string
    ├── date           timestamp
    ├── type           string
    ├── status         string
    ├── completedAt    timestamp | null
    ├── createdAt      timestamp
    └── updatedAt      timestamp
```

---

## Campos

| Campo         | Tipo      | Obligatorio | Descripción                                                                       |
| ------------- | --------- | ----------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `coupleId`    | string    | Sí          | Identificador del documento de la colección `couples` al que pertenece el plan.   |
| `createdBy`   | string    | Sí          | `uid` del usuario que creó el plan.                                               |
| `title`       | string    | Sí          | Título o nombre del plan.                                                         |
| `description` | string    | Sí          | Descripción del plan.                                                             |
| `location`    | string    | Sí          | Lugar asociado al plan.                                                           |
| `date`        | timestamp | Sí          | Fecha y hora programada para realizar el plan.                                    |
| `type`        | string    | Sí          | Tipo de plan. Valores permitidos: `food`, `place` o `activity`.                   |
| `status`      | string    | Sí          | Estado actual del plan. Valores permitidos: `pending`, `completed` o `cancelled`. |
| `completedAt` | timestamp | null        | Sí                                                                                | Fecha y hora en que el plan fue marcado como `completed` o `cancelled`. Es `null` mientras el plan permanece en estado `pending`. |
| `createdAt`   | timestamp | Sí          | Timestamp de Firestore generado al crear el documento. Es inmutable.              |
| `updatedAt`   | timestamp | Sí          | Timestamp de Firestore actualizado cada vez que se modifica el plan.              |

---

## Ejemplo

### Plan pendiente

```json
{
  "coupleId": "Y9tkqINj5a3Kmfltd7jq",
  "createdBy": "0EWvo2NhqFc1G0H5VOVrBKiT3dn2",
  "title": "Plan 2",
  "description": "Description 2",
  "location": "Locale B",
  "date": "2026-08-14T16:30:00-05:00",
  "type": "food",
  "status": "pending",
  "completedAt": null,
  "createdAt": "2026-08-14T16:30:32-05:00",
  "updatedAt": "2026-08-18T15:17:28-05:00"
}
```

### Plan completado

```json
{
  "coupleId": "Y9tkqINj5a3Kmfltd7jq",
  "createdBy": "0EWvo2NhqFc1G0H5VOVrBKiT3dn2",
  "title": "Cena especial",
  "description": "Cena para celebrar nuestro aniversario",
  "location": "Restaurante",
  "date": "2026-08-20T19:00:00-05:00",
  "type": "food",
  "status": "completed",
  "completedAt": "2026-08-20T21:30:00-05:00",
  "createdAt": "2026-08-18T15:00:00-05:00",
  "updatedAt": "2026-08-20T21:30:00-05:00"
}
```

### Plan cancelado

```json
{
  "coupleId": "Y9tkqINj5a3Kmfltd7jq",
  "createdBy": "0EWvo2NhqFc1G0H5VOVrBKiT3dn2",
  "title": "Visita al parque",
  "description": "Visitar el parque durante la tarde",
  "location": "Parque principal",
  "date": "2026-08-22T15:00:00-05:00",
  "type": "place",
  "status": "cancelled",
  "completedAt": "2026-08-21T10:00:00-05:00",
  "createdAt": "2026-08-18T15:00:00-05:00",
  "updatedAt": "2026-08-21T10:00:00-05:00"
}
```

---

## Relaciones

### Couples

```text
couples/{coupleId}
        │
        └── coupleId
                │
                ▼
          plans/{planId}
```

Cada plan pertenece a una única pareja mediante el campo `coupleId`.

La relación permite consultar los planes asociados a una pareja sin almacenar la información de la pareja directamente dentro de cada plan.

---

### Users

```text
users/{uid}
      │
      └── uid
           │
           ▼
      plans/{planId}
           │
           └── createdBy
```

El campo `createdBy` identifica al usuario que creó el plan y corresponde al `uid` de un documento de la colección `users`.

---

## Ciclo de vida

Un plan sigue el siguiente flujo de estados:

```text
                  ┌─────────────┐
                  │   pending   │
                  └──────┬──────┘
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
      ┌─────────────┐       ┌─────────────┐
      │  completed  │       │  cancelled  │
      └─────────────┘       └─────────────┘
```

### `pending`

Estado inicial del plan.

En este estado:

```text
status = "pending"
completedAt = null
```

### `completed`

Indica que el plan fue realizado.

Al cambiar a este estado:

```text
status = "completed"
completedAt = timestamp
```

### `cancelled`

Indica que el plan fue cancelado.

Al cambiar a este estado:

```text
status = "cancelled"
completedAt = timestamp
```

`completedAt` representa, por tanto, el momento en que el plan dejó de estar pendiente, independientemente de si terminó siendo completado o cancelado.

---

## Decisiones de diseño

### Asociación mediante `coupleId`

**Decisión**

Cada plan almacena directamente el `coupleId` de la relación a la que pertenece.

**Justificación**

Permite consultar todos los planes de una pareja mediante un único criterio y evita duplicar información de la relación dentro del documento.

---

### Uso de `createdBy`

**Decisión**

Conservar el `uid` del usuario que creó el plan.

**Justificación**

Permite identificar el origen del plan y proporciona información útil para futuras funcionalidades, como mostrar quién creó una actividad o implementar permisos específicos.

---

### Uso de `completedAt` para planes cancelados

**Decisión**

Utilizar `completedAt` para registrar el momento en que un plan deja de estar pendiente, tanto cuando se completa como cuando se cancela.

**Justificación**

Mantiene un único campo temporal para registrar el final del ciclo activo del plan y evita incorporar campos adicionales para cada estado.

---

### Estado mediante enumeración

**Decisión**

El estado se almacena como `string` utilizando únicamente valores predefinidos.

**Valores permitidos:**

- `pending`
- `completed`
- `cancelled`

**Justificación**

Mantiene la estructura legible y permite controlar explícitamente el ciclo de vida de un plan.

---

### Tipo de plan mediante enumeración

**Decisión**

El tipo se almacena como `string`.

**Valores permitidos:**

- `food`
- `place`
- `activity`

**Justificación**

Permite categorizar los planes sin crear estructuras diferentes para cada tipo y facilita la incorporación de nuevos tipos en el futuro.

---

## Alternativas de diseño

### Opción recomendada: colección `plans`

Cada plan se almacena como un documento independiente en una colección de Firestore.

**Ventajas**

- Permite consultar y filtrar planes individualmente.
- Facilita ordenar los planes por fecha.
- Permite actualizar el estado de un plan sin modificar otros.
- Facilita la incorporación de nuevas propiedades.
- Escala mejor conforme aumente el número de planes.

**Desventajas**

- Requiere consultas adicionales para obtener todos los planes de una pareja.
- Es necesario mantener correctamente el `coupleId`.

---

### Alternativa: subcolección dentro de `couples`

La estructura podría ser:

```text
couples
└── coupleId
    └── plans
        └── planId
```

**Ventajas**

- La pertenencia del plan a una pareja queda determinada por su ubicación.
- La relación entre pareja y planes es explícita.

**Desventajas**

- Puede complicar algunas consultas globales.
- Dificulta consultar planes de diferentes parejas en funcionalidades administrativas o estadísticas.
- Mantener `plans` como colección independiente ofrece mayor flexibilidad para futuras consultas.

---

### Motivo de la elección

Se utiliza una colección independiente `plans` y se relaciona cada documento mediante `coupleId`. Esta estructura mantiene los planes desacoplados de la estructura física de `couples` y proporciona mayor flexibilidad para consultas y futuras funcionalidades.

---

## Consideraciones

- Todo plan debe pertenecer a una pareja existente mediante `coupleId`.
- `createdBy` debe corresponder a un usuario existente.
- El usuario que crea el plan debe pertenecer a la pareja indicada por `coupleId`.
- `status` únicamente puede contener `pending`, `completed` o `cancelled`.
- `type` únicamente puede contener `food`, `place` o `activity`.
- Un plan nuevo debe comenzar con `status = "pending"`.
- Un plan nuevo debe tener `completedAt = null`.
- Cuando el estado cambia a `completed` o `cancelled`, `completedAt` debe almacenar un timestamp.
- `createdAt` nunca debe modificarse.
- `updatedAt` debe actualizarse cada vez que se modifique el documento.
- Un plan que ya se encuentra en `completed` o `cancelled` no debería volver a `pending`, salvo que posteriormente se defina explícitamente un flujo de reapertura.
- Las modificaciones de un plan deben respetar las reglas de seguridad de Firestore para garantizar que únicamente los miembros de la pareja puedan acceder o modificar sus planes.

---

## Utilizado por

### Funcionalidades actuales

- Gestión de planes.
- Creación de planes.
- Visualización de planes.
- Actualización del estado de los planes.
- Cancelación de planes.
- Finalización de planes.
- Filtrado de planes por pareja.

### Funcionalidades planificadas

- Historial de planes.
- Calendario compartido.
- Estadísticas de planes.
- Notificaciones relacionadas con planes.
- Recordatorios.
- Filtros por tipo de plan.

---

## Referencias

- `docs/database/users.md`
- `docs/database/couples.md`
- `docs/architecture/firestore.md`
- `docs/features/plans.md`
