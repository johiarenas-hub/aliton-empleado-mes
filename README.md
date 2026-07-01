# Alitón — Empleado del mes

Sistema donde los propios empleados se califican entre sí de forma anónima para elegir al empleado del mes, con envío de códigos personales por WhatsApp.

## Instalación

```bash
npm install
cp .env.example .env
npx prisma migrate dev --name init
npm run seed
npm run dev
```

Abre `http://localhost:3000`.

## Cómo funciona

1. **Administrador** entra a `/admin` y da clic en "Abrir nueva ronda". Esto:
   - Cierra cualquier ronda anterior.
   - Genera un código único por empleado activo, válido hasta el cierre de la ronda (25 días por defecto).
   - Muestra un botón de WhatsApp por cada empleado con el mensaje y el link ya armados (`wa.me`) — solo debes darle clic para enviarlo.
2. **Empleado** recibe el link (`/calificar/<codigo>`), elige a un compañero, califica de 1 a 5 en cada criterio, y envía. No puede calificarse a sí mismo ni calificar dos veces a la misma persona en la misma ronda.
3. El **anonimato** se sostiene porque las calificaciones y el control de "quién ya votó" viven en tablas separadas — nunca se guarda qué puntaje dio cada evaluador.
4. En `/admin/resultados/<rondaId>` el administrador ve el ranking y el ganador. Se exige un mínimo de 3 votos recibidos para poder ganar, y si alguien repite como ganador varios meses, se permite (es por mérito).

## Administrar empleados y criterios

Por ahora se agregan directo en la base de datos. La forma más rápida sin escribir código:

```bash
npx prisma studio
```

Esto abre una interfaz visual en el navegador donde puedes agregar, editar o desactivar empleados y criterios.

## Desplegar en producción (Vercel)

SQLite no persiste bien en Vercel porque el disco es efímero. Antes de desplegar:

1. Crea una base de datos Postgres gratuita en [Supabase](https://supabase.com) o [Neon](https://neon.tech).
2. Cambia en `prisma/schema.prisma` el `provider` de `sqlite` a `postgresql`.
3. Actualiza `DATABASE_URL` en las variables de entorno de Vercel con la cadena de conexión de tu base de datos.
4. Sube el proyecto a un repositorio de GitHub y conéctalo en Vercel.
5. Define también `APP_URL` en Vercel con tu dominio real (ej. `https://empleadodelmes.aliton.com`), para que los links de WhatsApp apunten correctamente.

## Automatizar el envío por WhatsApp (siguiente paso opcional)

Hoy el envío es semiautomático: el sistema arma el link, tú das clic. Para automatizarlo por completo (sin que nadie tenga que dar clic), se integraría la API oficial de WhatsApp Business (Meta Cloud API o Twilio), lo cual requiere verificación de la cuenta empresarial y tiene costo por mensaje. Es una mejora que se puede agregar después sin rediseñar el resto del sistema.

## Programar la apertura y cierre automático de rondas

Para que la ronda se abra sola cada mes, agrega un cron job (por ejemplo con [Vercel Cron](https://vercel.com/docs/cron-jobs)) que llame una vez al mes a:

```
POST /api/admin/rondas
```

Esto abrirá la ronda y generará los códigos automáticamente; el envío por WhatsApp seguiría siendo manual (un clic por persona) a menos que integres la API oficial mencionada arriba.
