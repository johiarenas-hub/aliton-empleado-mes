const { prisma } = require("../../../../lib/prisma");

async function validarCodigo(codigoTexto) {
  const codigo = await prisma.codigo.findUnique({
    where: { codigo: codigoTexto },
    include: { empleado: true, ronda: true },
  });
  if (!codigo) return { error: "Código no válido.", status: 404 };
  if (codigo.ronda.estado !== "abierta") return { error: "Esta ronda ya cerró.", status: 410 };
  if (new Date() > new Date(codigo.expiraEn)) return { error: "Tu código expiró.", status: 410 };
  return { codigo };
}

async function GET(_req, { params }) {
  const resultado = await validarCodigo(params.codigo);
  if (resultado.error) return Response.json({ error: resultado.error }, { status: resultado.status });

  const { codigo } = resultado;

  const compañeros = await prisma.empleado.findMany({
    where: { activo: true, id: { not: codigo.empleadoId } },
    select: { id: true, nombre: true, cargo: true, area: true },
  });

  const yaCalificados = await prisma.controlVoto.findMany({
    where: { rondaId: codigo.rondaId, evaluadorId: codigo.empleadoId },
    select: { evaluadoId: true },
  });

  const criterios = await prisma.criterio.findMany({ where: { activo: true } });

  return Response.json({
    evaluador: { nombre: codigo.empleado.nombre },
    ronda: { id: codigo.rondaId, fechaCierre: codigo.ronda.fechaCierre },
    compañeros,
    yaCalificados: yaCalificados.map((v) => v.evaluadoId),
    criterios,
  });
}

async function POST(req, { params }) {
  const resultado = await validarCodigo(params.codigo);
  if (resultado.error) return Response.json({ error: resultado.error }, { status: resultado.status });

  const { codigo } = resultado;
  const body = await req.json().catch(() => ({}));
  const { evaluadoId, puntajes } = body;

  if (!evaluadoId || !puntajes || typeof puntajes !== "object") {
    return Response.json({ error: "Datos incompletos." }, { status: 400 });
  }
  if (evaluadoId === codigo.empleadoId) {
    return Response.json({ error: "No puedes calificarte a ti mismo." }, { status: 400 });
  }

  const yaVoto = await prisma.controlVoto.findUnique({
    where: {
      rondaId_evaluadorId_evaluadoId: {
        rondaId: codigo.rondaId,
        evaluadorId: codigo.empleadoId,
        evaluadoId,
      },
    },
  });
  if (yaVoto) {
    return Response.json({ error: "Ya calificaste a este compañero en esta ronda." }, { status: 409 });
  }

  const entradas = Object.entries(puntajes);
  await prisma.$transaction([
    ...entradas.map(([criterioId, puntaje]) =>
      prisma.calificacion.create({
        data: {
          rondaId: codigo.rondaId,
          evaluadoId,
          criterioId,
          puntaje: Number(puntaje),
        },
      })
    ),
    prisma.controlVoto.create({
      data: {
        rondaId: codigo.rondaId,
        evaluadorId: codigo.empleadoId,
        evaluadoId,
      },
    }),
  ]);

  return Response.json({ ok: true });
}

module.exports = { GET, POST };
