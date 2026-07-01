"use client";
import { useState, useEffect } from "react";

export default function CalificarPage({ params }) {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);
  const [evaluadoId, setEvaluadoId] = useState("");
  const [puntajes, setPuntajes] = useState({});
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    fetch(`/api/calificar/${params.codigo}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) {
          setError(d.error);
        } else {
          setDatos(d);
          if (d.compañeros.length > 0) setEvaluadoId(d.compañeros[0].id);
          const inicial = {};
          d.criterios.forEach((c) => (inicial[c.id] = 3));
          setPuntajes(inicial);
        }
      });
  }, [params.codigo]);

  async function enviar() {
    setMensaje("");
    const res = await fetch(`/api/calificar/${params.codigo}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ evaluadoId, puntajes }),
    });
    const data = await res.json();
    if (data.error) {
      setMensaje(data.error);
    } else {
      setMensaje("Calificación enviada. Gracias por tu aporte.");
      setDatos((prev) => ({ ...prev, yaCalificados: [...prev.yaCalificados, evaluadoId] }));
    }
  }

  if (error) return <p>{error}</p>;
  if (!datos) return <p>Cargando...</p>;

  const disponibles = datos.compañeros.filter((c) => !datos.yaCalificados.includes(c.id));

  return (
    <div>
      <div style={{ background: "#4A2F1B", borderRadius: 12, padding: "16px 20px", marginBottom: 24 }}>
        <p style={{ margin: 0, color: "#F5A623", fontSize: 18, fontWeight: 600, textAlign: "center" }}>Empleado del mes</p>
      </div>

      <p>
        Hola {datos.evaluador.nombre}, tu calificación es anónima. Elige a un compañero y puntúa cada criterio de 1 a 5.
      </p>

      {disponibles.length === 0 ? (
        <p>Ya calificaste a todos tus compañeros disponibles en esta ronda. ¡Gracias!</p>
      ) : (
        <>
          <select value={evaluadoId} onChange={(e) => setEvaluadoId(e.target.value)} style={{ width: "100%", padding: 8, marginBottom: 16 }}>
            {disponibles.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre} {c.cargo ? `— ${c.cargo}` : ""}
              </option>
            ))}
          </select>

          {datos.criterios.map((c) => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <label style={{ width: 170, fontSize: 14 }}>{c.nombre}</label>
              <input
                type="range"
                min="1"
                max="5"
                value={puntajes[c.id] || 3}
                onChange={(e) => setPuntajes((p) => ({ ...p, [c.id]: Number(e.target.value) }))}
                style={{ flex: 1 }}
              />
              <span style={{ width: 16, textAlign: "right" }}>{puntajes[c.id] || 3}</span>
            </div>
          ))}

          <button
            onClick={enviar}
            style={{ width: "100%", background: "#F5A623", border: "1px solid #4A2F1B", borderRadius: 8, padding: "10px 16px", fontWeight: 600, cursor: "pointer", marginTop: 8 }}
          >
            Enviar calificación anónima
          </button>
        </>
      )}

      {mensaje && <p style={{ color: "#4A2F1B", marginTop: 12 }}>{mensaje}</p>}
    </div>
  );
}
