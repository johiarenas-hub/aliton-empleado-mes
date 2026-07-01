const crypto = require("crypto");

function generarCodigo() {
  return crypto.randomBytes(6).toString("base64url"); // ~8 caracteres, difícil de adivinar
}

function armarLinkWhatsapp(telefono, mensaje) {
  const numero = telefono.replace(/[^0-9]/g, "");
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}

function armarMensajeCodigo({ nombre, urlBase, codigo, fechaCierre }) {
  const link = `${urlBase}/calificar/${codigo}`;
  const fecha = new Date(fechaCierre).toLocaleDateString("es-CO", { day: "numeric", month: "long" });
  return `Hola ${nombre}, ya puedes calificar a tus compañeros para elegir el empleado del mes en Alitón. Tu link personal (válido hasta el ${fecha}): ${link}`;
}

module.exports = { generarCodigo, armarLinkWhatsapp, armarMensajeCodigo };
