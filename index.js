const express = require("express");
const cors = require("cors");

const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = 3000;

// Middleware para permitir CORS y parsear JSON
app.use(cors());
app.use(express.json());

// Ruta para obtener el token de autenticación
app.get("/auth", async (req, res) => {
  const url_auth = `https://apitestenv.vnforapps.com/api.security/v1/security`;

  try {
    const usuario ='integraciones.visanet@necomplus.com'
    const clave= 'd5e7nk$M'
    const base = Buffer.from(`${usuario}:${clave}`).toString('base64')
    const response = await fetch(url_auth, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: '*/*',
        Authorization: `Basic ${base}`,   
      },
    });
    console.log(`Basic ${base}`);   
    console.log("response:",JSON.stringify(response));
    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch token" });
    }

    const token = await response.text();
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para generar el QR
app.post("/generate-qr", async (req, res) => {
  const url_auth_qr = `https://apitestenv.vnforapps.com/api.qr.manager/v1/qr/ascii`; /// usar en produccion
  const { token, body } = req.body;

  try {
    const response = await fetch(url_auth_qr, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(body),
    });
    console.log("body: ",body);
    
    console.log("response: ",response);                                                                        
    
    const dataQr = await response.json();
    console.log("dataQr: ",dataQr);
    
    res.json(dataQr);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Proxy API running at http://localhost:${PORT}`);
});