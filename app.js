
const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode');
const app = express();
const port = 4000;
const secret = process.env.SECRET;
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  console.log('Cliente está listo');
});

client.on('message', async message => {
  console.log(message)
  if (message.from.endsWith("@g.us")) {
    const nameGroup = await message.getChat()
    console.log(nameGroup)
    if(nameGroup.name === "Test1" && message.body.toLowerCase().trim() === "cancelar"){
        await client.sendMessage(message.from, "Entiendo, hasta luego nos vemos despues :)");
    }
  }
})

client.initialize();

// Validar número
app.get('/whatsapp/:numero', async (req, res) => {
  try {
    let numero = req.params.numero;
    const token = req.headers.authorization.split(" ")[1];
    const payload = jwt.verify(token, secret);

    if (Date.now() / 1000 > payload.exp) {
      return res.status(401).send({ error: true, message: "Token expirado" });
    }

    const data = await client.getNumberId(`${numero}`);
    if (data === null) return res.json({ status: 200, numberExist: false });

    return res.json({ status: 200, numberExist: true, user: data.user, server: data.server, _serialized: data._serialized });
  } catch (error) {
    console.log(error);
    await avisarPorCliq(`❌ Error al validar número: ${error.message}`);
    return res.status(500).send({ message: "Error interno del servidor" });
  }
});

// Enviar mensaje
app.post('/whatsapp/messages/', async (req, res) => {
  const { numero, mensaje } = req.body;
  const datos = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  try {
    if (!token) {
      return res.status(400).send({ error: true, message: "Token no proporcionado" });
    }

    const payload = jwt.verify(token, secret);
    if (Date.now() / 1000 > payload.exp) {
      return res.status(401).send({ error: true, message: "Token expirado" });
    }

    const data = await client.getNumberId(`${numero}`);
    if (data === null) return res.json({ status_code: 404, numberExist: false, numero });

    const job = await apiQueue.add(datos, { delay: 5000 });
    return res.status(200).send({ mensaje: "Whatsapp enviado correctamente", id: job.id, numero });
  } catch (error) {
    console.error("Error en el servidor:", error);
    await avisarPorCliq(`❌ Error en endpoint /whatsapp/messages: ${error.message}`);
    return res.status(500).send({ message: "Error interno del servidor", error: error.message });
  }
});

// QR para conectar
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
  console.log('Servidor corriendo correctamente en el puerto', port);
});
