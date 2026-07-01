"use client";
import { useState, useEffect } from "react";

export default function ResultadosPage({ params }) {
  const [datos, setDatos] = useState(null);

  useEffect(() => {
    fetch(`/api/admin/resultados/${params.rondaId}`)
      .then((r) => r.json())
      .then(setDatos);
  }, [params.rondaId]);

  if (!datos) return <p>Cargando...</p>;
  if (datos.error) return <p>{datos.error}</p>;

  return (
    <div>
      <h1 style={{ color: "#4A2F1B" }}>Resultados</h1>

      <div style={{ background: "#4A2F1B", borderRadius: 12, padding: 16, marginBottom: 16, color: "white" }}>
        <p style={{ margin: 0, fontSize: 13, color: "#E8C99A" }}>Empleado del mes</p>
        <p style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
          {datos.ganador ? datos.ganador.nombre : `Aún sin ganador (mínimo ${datos.minimoVotos} votos)`}
        </p>
      </div>

      {datos.tabla.map((t, i) => (
        <div key={t.empleadoId} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #ddd", padding: "8px 0", opacity: t.elegible ? 1 : 0.5 }}>
          <span>
            {i + 1}. {t.nombre} {!t.elegible && "(votos insuficientes)"}
          </span>
          <span>
            {t.promedio.toFixed(1)} — {t.votosRecibidos} votos
          </span>
        </div>
      ))}
    </div>
  );
}
