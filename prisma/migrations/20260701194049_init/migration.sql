-- CreateTable
CREATE TABLE "Empleado" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "cargo" TEXT,
    "area" TEXT,
    "telefono" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Empleado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ronda" (
    "id" TEXT NOT NULL,
    "mes" INTEGER NOT NULL,
    "anio" INTEGER NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaCierre" TIMESTAMP(3) NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'abierta',

    CONSTRAINT "Ronda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Codigo" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "empleadoId" TEXT NOT NULL,
    "rondaId" TEXT NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiraEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Codigo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Criterio" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "peso" INTEGER NOT NULL DEFAULT 1,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Criterio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Calificacion" (
    "id" TEXT NOT NULL,
    "rondaId" TEXT NOT NULL,
    "evaluadoId" TEXT NOT NULL,
    "criterioId" TEXT NOT NULL,
    "puntaje" INTEGER NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Calificacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ControlVoto" (
    "id" TEXT NOT NULL,
    "rondaId" TEXT NOT NULL,
    "evaluadorId" TEXT NOT NULL,
    "evaluadoId" TEXT NOT NULL,
    "votadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ControlVoto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Codigo_codigo_key" ON "Codigo"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "ControlVoto_rondaId_evaluadorId_evaluadoId_key" ON "ControlVoto"("rondaId", "evaluadorId", "evaluadoId");

-- AddForeignKey
ALTER TABLE "Codigo" ADD CONSTRAINT "Codigo_empleadoId_fkey" FOREIGN KEY ("empleadoId") REFERENCES "Empleado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Codigo" ADD CONSTRAINT "Codigo_rondaId_fkey" FOREIGN KEY ("rondaId") REFERENCES "Ronda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calificacion" ADD CONSTRAINT "Calificacion_rondaId_fkey" FOREIGN KEY ("rondaId") REFERENCES "Ronda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calificacion" ADD CONSTRAINT "Calificacion_evaluadoId_fkey" FOREIGN KEY ("evaluadoId") REFERENCES "Empleado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calificacion" ADD CONSTRAINT "Calificacion_criterioId_fkey" FOREIGN KEY ("criterioId") REFERENCES "Criterio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ControlVoto" ADD CONSTRAINT "ControlVoto_rondaId_fkey" FOREIGN KEY ("rondaId") REFERENCES "Ronda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ControlVoto" ADD CONSTRAINT "ControlVoto_evaluadorId_fkey" FOREIGN KEY ("evaluadorId") REFERENCES "Empleado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ControlVoto" ADD CONSTRAINT "ControlVoto_evaluadoId_fkey" FOREIGN KEY ("evaluadoId") REFERENCES "Empleado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
