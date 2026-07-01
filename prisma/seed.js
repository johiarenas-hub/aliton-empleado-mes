const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const criterios = [
    { nombre: "Puntualidad", peso: 1 },
    { nombre: "Trabajo en equipo", peso: 1 },
    { nombre: "Calidad del trabajo", peso: 1 },
    { nombre: "Actitud y disposición", peso: 1 },
    { nombre: "Presentación personal", peso: 1 },
  ];

  for (const c of criterios) {
    const existente = await prisma.criterio.findFirst({ where: { nombre: c.nombre } });
    if (!existente) await prisma.criterio.create({ data: c });
  }

  const empleados = [
    { nombre: "Ana Torres", cargo: "Ejecutiva de ventas", area: "Comercial", telefono: "573000000001" },
    { nombre: "Luis Ramírez", cargo: "Analista de soporte", area: "Servicio al cliente", telefono: "573000000002" },
    { nombre: "Sofía Gómez", cargo: "Coordinadora de logística", area: "Operaciones", telefono: "573000000003" },
  ];

  for (const e of empleados) {
    const existente = await prisma.empleado.findFirst({ where: { telefono: e.telefono } });
    if (!existente) await prisma.empleado.create({ data: e });
  }

  console.log("Datos iniciales creados.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
