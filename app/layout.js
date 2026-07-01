export const metadata = {
  title: "Alitón — Empleado del mes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ fontFamily: "sans-serif", background: "#FAF7F2", margin: 0, padding: "24px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>{children}</div>
      </body>
    </html>
  );
}
