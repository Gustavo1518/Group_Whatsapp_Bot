
const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode');
const app = express();
const port = 4000;
const secret = process.env.SECRET;
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const keywords = ['emergencia', 'problema', 'accidente'];



const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

let qrCodeData = '';

client.on('qr', (qr) => {
  qrcode.toDataURL(qr, (err, url) => {
    if (err) {
      console.error('Error al generar el QR:', err);
      return;
    }
    qrCodeData = url;
  });
});

client.on('ready', async (message) => {
  //await client.sendMessage('5215614562120@c.us', `[SUCCESS] Chatbot Whatsapp Conectado exitosamente.`)
  console.log("CLIENTE ESTA LISTO");
});


//FUNCION PARA MANEJAR LAS PALABRAS CLAVES
client.on('message', async message => {
  try {
    if (message.from.endsWith("@g.us")) {
    const nameGroup = await message.getChat();

    if (nameGroup.name === "QUEJAS y EMERGENCIAS 🚨🚨🚨") {
      console.log("ENTRO AL GRUPO QUEJAS y EMERGENCIAS 🚨🚨🚨");

      if (keywords.some(keyword => message.body.toLowerCase().trim().includes(keyword))) {
        await client.sendMessage(message.from, "🛑 *PROTOCOLO DE ACCIDENTES* 🛑\n\nSi estás presentando una situación de accidente con un colaborador o cliente, realiza tu reporte de inmediato con esta información:\n\n📍 *¿Qué pasó?* (caída, descarga eléctrica, otro):\n🧑‍🔧 *Nombre de la persona accidentada:*\n📌 *Ubicación exacta* (dirección + referencias):\n⚠️ *Estado de la persona accidentada* (¿consciente? ¿signos visibles?):\n🔢 *Número de servicio* (si está relacionado con el servicio de un cliente):\n📞 *Nombre y número de quien reporta*:\n📷 *Foto del accidente (si es posible):*\n\n🧘 Mantén la calma\n📲 Una vez enviado el reporte, permanece atento a este grupo y tu teléfono para seguimiento.");
      }

      if (message.body.toLowerCase().trim().includes('ambulancia')){
        await client.sendMessage(message.from, "🛑 *AMBULANCIA* 🛑\n\nEn caso de requerir una ambulancia llamar a *Multi Care:*\n\n📲  55 4571 5091\n\n🧘 Mantén la calma y déjanos saber en este grupo cuando la ambulancia 🚑 llegue al lugar.");
      }

    }
  }
  } catch (error) {
    //await client.sendMessage('5215614562120@c.us', `[ERROR] Chatbot Whatsapp\n\n${error}`)
    console.log("[ERROR] se produjo el siguiente error: ", error);
  }
})

client.initialize();

// RUTA DONDE SE MANDA EL CODIGO QR A ESCANEAR
app.get('/', (req, res) => {
  if (qrCodeData) {
    res.send(`
      <h1>Escanea el código QR con tu aplicación de WhatsApp</h1>
      <img src="${qrCodeData}" alt="QR Code"/>
    `);
  } else {
    res.send('<h1>El código QR aún no está disponible. Inténtalo de nuevo más tarde.</h1>');
  }
});

// Inicio de servidor
app.listen(port, () => {
  console.log(`Servidor corriendo correctamente en http://localhost:${port}`);
});
