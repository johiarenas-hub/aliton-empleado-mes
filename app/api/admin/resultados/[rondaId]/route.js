import { prisma } from "../../../../../lib/prisma";

export const dynamic = "force-dynamic";

const MINIMO_VOTOS = 3;

export async function GET(_req, { params }) {
  const ronda = await prisma.ronda.findUnique({ where: { id: params.rondaId } });
  if (!ronda) return Response.json({ error: "Ronda no encontrada." }, { status: 404 });

  const calificaciones = await prisma.calificacion.findMany({
    where: { rondaId: params.rondaId },
    include: { evaluado: true },
  });

  const votosPorEmpleado = await prisma.controlVoto.groupBy({
    by: ["evaluadoId"],
    where: { rondaId: params.rondaId },
    _count: { evaluadoId: true },
  });
  const votosMap = Object.fromEntries(votosPorEmpleado.map((v) => [v.evaluadoId, v._count.evaluadoId]));

  const acumulado = {};
  for (const c of calificaciones) {
    if (!acumulado[c.evaluadoId]) {
      acumulado[c.evaluadoId] = { nombre: c.evaluado.nombre, cargo: c.evaluado.cargo, suma: 0, cuenta: 0 };
    }
    acumulado[c.evaluadoId].suma += c.puntaje;
    acumulado[c.evaluadoId].cuenta += 1;
  }

  const tabla = Object.entries(acumulado)
    .map(([empleadoId, d]) => ({
      empleadoId,
      nombre: d.nombre,
      cargo: d.cargo,
      promedio: d.cuenta ? d.suma / d.cuenta : 0,
      votosRecibidos: votosMap[empleadoId] || 0,
      elegible: (votosMap[empleadoId] || 0) >= MINIMO_VOTOS,
    }))
    .sort((a, b) => b.promedio - a.promedio);

  const elegibles = tabla.filter((t) => t.elegible);
  const ganador = elegibles.length > 0 ? elegibles[0] : null;

  return Response.json({ ronda, tabla, ganador, minimoVotos: MINIMO_VOTOS });
}