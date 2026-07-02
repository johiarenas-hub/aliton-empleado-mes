export const dynamic = "force-dynamic";
const { prisma } = require("../../../../lib/prisma");
const { generarCodigo, armarLinkWhatsapp, armarMensajeCodigo } = require("../../../../lib/codigo");

async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const diasDuracion = body.diasDuracion || 25;
  const urlBase = body.urlBase || process.env.APP_URL || "http://localhost:3000";

  // Cierra cualquier ronda que siga abierta
  await prisma.ronda.updateMany({ where: { estado: "abierta" }, data: { estado: "cerrada" } });

  const ahora = new Date();
  const fechaCierre = new Date(ahora.getTime() + diasDuracion * 24 * 60 * 60 * 1000);

  const ronda = await prisma.ronda.create({
    data: {
      mes: ahora.getMonth() + 1,
      anio: ahora.getFullYear(),
      fechaInicio: ahora,
      fechaCierre,
      estado: "abierta",
    },
  });

  const empleados = await prisma.empleado.findMany({ where: { activo: true } });

  const enlaces = [];
  for (const empleado of empleados) {
    const codigo = generarCodigo();
    await prisma.codigo.create({
      data: {
        codigo,
        empleadoId: empleado.id,
        rondaId: ronda.id,
        expiraEn: fechaCierre,
      },
    });
    const mensaje = armarMensajeCodigo({ nombre: empleado.nombre, urlBase, codigo, fechaCierre });
    enlaces.push({
      empleadoId: empleado.id,
      nombre: empleado.nombre,
      telefono: empleado.telefono,
      linkCalificar: `${urlBase}/calificar/${codigo}`,
      linkWhatsapp: armarLinkWhatsapp(empleado.telefono, mensaje),
    });
  }

  return Response.json({ ronda, enlaces });
}

async function GET() {
  const ronda = await prisma.ronda.findFirst({ where: { estado: "abierta" }, orderBy: { fechaInicio: "desc" } });
  return Response.json({ ronda });
}

module.exports = { POST, GET };
