"use client";
import { useState, useEffect } from "react";

export default function AdminPage() {
  const [rondaActual, setRondaActual] = useState(null);
  const [enlaces, setEnlaces] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    fetch("/api/admin/rondas")
      .then((r) => r.json())
      .then((d) => setRondaActual(d.ronda));
  }, []);

  async function abrirRonda() {
    setCargando(true);
    const urlBase = window.location.origin;
    const res = await fetch("/api/admin/rondas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ urlBase }),
    });
    const data = await res.json();
    setRondaActual(data.ronda);
    setEnlaces(data.enlaces);
    setCargando(false);
  }

  return (
    <div>
      <h1 style={{ color: "#4A2F1B" }}>Panel de administrador</h1>

      {rondaActual ? (
        <p>
          Ronda actual: {rondaActual.mes}/{rondaActual.anio} — estado {rondaActual.estado} — cierra el{" "}
          {new Date(rondaActual.fechaCierre).toLocaleDateString("es-CO")}.{" "}
          <a href={`/admin/resultados/${rondaActual.id}`}>Ver resultados</a>
        </p>
      ) : (
        <p>No hay ninguna ronda abierta todavía.</p>
      )}

      <button
        onClick={abrirRonda}
        disabled={cargando}
        style={{ background: "#F5A623", border: "1px solid #4A2F1B", borderRadius: 8, padding: "10px 16px", fontWeight: 600, cursor: "pointer" }}
      >
        {cargando ? "Abriendo ronda..." : "Abrir nueva ronda y generar códigos"}
      </button>

      {enlaces.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <p>Da clic en cada botón para enviar el link por WhatsApp a cada empleado:</p>
          {enlaces.map((e) => (
            <div
              key={e.empleadoId}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #ddd", padding: "10px 0" }}
            >
              <span>{e.nombre}</span>
              <a
                href={e.linkWhatsapp}
                target="_blank"
                rel="noreferrer"
                style={{ background: "#25D366", color: "white", padding: "6px 12px", borderRadius: 6, textDecoration: "none", fontSize: 14 }}
              >
                Enviar por WhatsApp
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
