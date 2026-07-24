# Colección `relationship_requests`

**Archivo:** `docs/database/relationship_requests.md`

## Descripción

La colección `relationship_requests` almacena las solicitudes de relación enviadas entre usuarios de Elytra.

Cada documento representa una única solicitud enviada por un usuario (`fromUserId`) hacia otro usuario (`toUserId`). Su propósito es gestionar el proceso previo a la creación de una relación, permitiendo aceptar, rechazar o cancelar la invitación.

Una vez que la solicitud es aceptada, se crea un documento en la colección `couples` y ambos usuarios actualizan su campo `coupleId`. La solicitud permanece registrada como historial con el estado `accepted`.

---

## Estructura

```text
relationship_requests
└── requestId
    ├── fromUserId        string
    ├── toUserId          string
    ├── status            string
    ├── createdAt         timestamp
    └── updatedAt         timestamp
```

---

## Campos

| Campo      | Tipo      | Obligatorio | Descripción                                                                                         |
| ---------- | --------- | ----------- | --------------------------------------------------------------------------------------------------- |
| fromUserId | string    | Sí          | `uid` del usuario que envía la solicitud.                                                           |
| toUserId   | string    | Sí          | `uid` del usuario destinatario de la solicitud.                                                     |
| status     | string    | Sí          | Estado actual de la solicitud. Valores permitidos: `pending`, `accepted`, `rejected` o `cancelled`. |
| createdAt  | timestamp | Sí          | Timestamp de Firestore generado al crear la solicitud. Es un valor inmutable.                       |
| updatedAt  | timestamp | Sí          | Timestamp de Firestore actualizado cada vez que cambia el estado de la solicitud.                   |

---

## Ejemplo

```json
{
  "fromUserId": "uidUsuario1",
  "toUserId": "uidUsuario2",
  "status": "pending",
  "createdAt": "2026-07-23T18:15:00Z",
  "updatedAt": "2026-07-23T18:15:00Z"
}
```

---

## Relaciones

### Users

```text
users/{uid}
      │
      ├── fromUserId
      └── toUserId
              │
              ▼
relationship_requests/{requestId}
```

Los campos `fromUserId` y `toUserId` hacen referencia a documentos existentes en la colección `users`.

---

### Couples

```text
relationship_requests
        │
        └── status = accepted
                    │
                    ▼
              couples/{coupleId}
```

Cuando una solicitud cambia al estado `accepted`, el sistema crea un nuevo documento en la colección `couples` y actualiza el campo `coupleId` de ambos usuarios.

---

## Flujo de estados

```text
             pending
            /   |    \
           /    |     \
 accepted  rejected  cancelled
```

- **pending:** Solicitud enviada y pendiente de respuesta.
- **accepted:** Solicitud aceptada y relación creada.
- **rejected:** Solicitud rechazada por el destinatario.
- **cancelled:** Solicitud cancelada por el remitente antes de ser aceptada.

Una vez que la solicitud abandona el estado `pending`, no debe volver a modificarse.

---

## Decisiones de diseño

### Mantener un historial de solicitudes

**Decisión**

Las solicitudes no se eliminan después de ser procesadas.

**Justificación**

- Permite conservar el historial de invitaciones.
- Facilita auditorías y depuración.
- Evita recrear solicitudes duplicadas por errores de sincronización.
- Permite implementar estadísticas futuras.

---

### Separar solicitudes y relaciones

**Decisión**

Las solicitudes de pareja se almacenan en una colección independiente de `couples`.

**Justificación**

- Separa claramente el proceso de invitación de la relación activa.
- Simplifica las reglas de seguridad.
- Evita crear relaciones incompletas.
- Hace más sencillo administrar los estados de la solicitud.

---

### Estado mediante enumeración

**Decisión**

El estado se almacena como un `string`.

**Valores permitidos**

- `pending`
- `accepted`
- `rejected`
- `cancelled`

**Justificación**

Utilizar valores de texto mejora la legibilidad de la base de datos y mantiene consistencia con el resto de las colecciones del proyecto.

---

## Alternativas de diseño

### Opción recomendada (actual)

Utilizar una colección exclusiva para solicitudes.

**Ventajas**

- Proceso de invitación desacoplado de la relación.
- Fácil implementación de reglas de Firestore.
- Historial completo.
- Escalable para futuras funcionalidades.

**Desventajas**

- Requiere una colección adicional.

---

### Alternativa

Crear directamente el documento en `couples` y esperar la aceptación.

**Ventajas**

- Menor número de documentos.

**Desventajas**

- Relaciones incompletas.
- Mayor complejidad para distinguir relaciones activas de pendientes.
- Incrementa la lógica de validación.
- Riesgo de documentos huérfanos.

---

### Motivo de la elección

Se eligió una colección independiente porque representa un proceso diferente al de una relación consolidada y mantiene una separación clara entre invitaciones y relaciones activas.

---

## Consideraciones

- `fromUserId` y `toUserId` deben corresponder a usuarios existentes.
- Un usuario no puede enviarse solicitudes a sí mismo.
- No debe existir más de una solicitud con estado `pending` entre los mismos dos usuarios.
- No debe permitirse crear solicitudes si alguno de los usuarios ya pertenece a una relación activa.
- `createdAt` nunca debe modificarse.
- `updatedAt` debe actualizarse en cada cambio de estado.
- Una solicitud procesada (`accepted`, `rejected` o `cancelled`) no debe volver al estado `pending`.
- Las solicitudes aceptadas deben conservarse como registro histórico.

---

## Utilizado por

### Funcionalidades actuales

- Envío de solicitudes de pareja.
- Recepción de solicitudes.
- Aceptación de solicitudes.
- Rechazo de solicitudes.
- Cancelación de solicitudes.
- Creación de relaciones.

### Funcionalidades planificadas

- Historial de invitaciones.
- Notificaciones.
- Recordatorios de solicitudes pendientes.
- Estadísticas de invitaciones.

---

## Referencias

- `docs/database/users.md`
- `docs/database/couples.md`
- `docs/features/authentication.md`
- `docs/architecture/firestore.md`
