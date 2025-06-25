
const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode');
const app = express();
const port = 4000;
const secret = process.env.SECRET;
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const palabras = ["puto","huevos","pinche","loco","loca","locos","locas","metiche","metiches","ineptos","sexo"]

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


//FUNCION PARA MANEJAR LAS PALABRAS CLAVES
client.on('message', async message => {
  if (message.from.endsWith("@g.us")) {
    const nameGroup = await message.getChat()
    if (nameGroup.name === "QUEJAS y EMERGENCIAS 🚨🚨🚨") {
      console.log("ENTRO AL GRUPO QUEJAS y EMERGENCIAS 🚨🚨🚨")
      const prohibir = palabras.some(palabra => message.body.toLowerCase().trim().includes(palabra))
      if (prohibir) {
        try {
          await message.delete(true)

          const chat = await message.getChat();
          const contact = await message.getContact();

          chat.sendMessage(`⚠️ *${contact.pushname || contact.number}*, tu mensaje fue eliminado por contener lenguaje inapropiado.`);

        } catch (error) {
          console.log("Error al eliminar mensaje inapropiado", error);
        }
      }
      switch (message.body.toLowerCase().trim()) {
          case "emergencia":
              await client.sendMessage(message.from, "🛑 *PROTOCOLO DE ACCIDENTES* 🛑\n\nSi estás presentando una situación de accidente con un *bee*, reporta de inmediato con esta información:\n\n📍 *¿Qué pasó?* (caída, descarga eléctrica, otro):\n🧑‍🔧 *Nombre del bee accidentado:*\n📌 *Ubicación exacta* (dirección + referencias):\n⚠️ *Estado del bee* (¿consciente? ¿signos visibles?):\n🔢 *Número de servicio* (si aplica, en casa del cliente):\n📞 *Nombre y número de quien reporta*:\n📷 *Foto del accidente (si es posible):*\n\n🧘 Mantén la calma\n📲 Una vez enviado el reporte, permanece atento a este grupo y tu teléfono para seguimiento.");
              //await client.sendMessage(message.from, `2. ACTIVACIÓN DEL PROTOCOLO INTERNO\nMiguel Huitrón, Gisel Arellano ó Elena Urrutia continúan con el seguimiento y protocolo interno (ÚNICOS AUTORIZADOS PARA LLEVAR A CABO EL PROCESO) y evalúan el accidente que se reporta y toman acción de los siguientes pasos:\n• Urgencia: El bee está consciente, es un daño menor y puede desplazarse a una clínica del IMSS para atención inmediata o al término de ruta. Ejemplo: Cortaduras poco profundas.\n• Emergencia: Cualquier riesgo físico o mental que presente el bee. Es necesario llamar a la ambulancia Multi Care – Teléfono: 55 4571 5091\nIntegrantes del grupo ‘QUEJAS Y EMERGENCIAS’ para notificaciones internas inmediatas:\n1. Dirección de operaciones o jefe directo - Responsable: Miguel Huitrón. Cel: 55 6617 4338\n2. Dirección Bee Wow - Responsable: Gisel Arellano. Cel: 55 3038 2240\n3. Área de Recursos Humanos - Responsable: Elena Urrutia. Cel: 55 3007 8219\n4. Dirección General - Responsable: José Cantú\nTiempo máximo: 10 minutos desde la recepción del reporte.`);
              //await client.sendMessage(message.from, `3. APOYO AL PERSONAL EN CAMPO\nUna vez realizada la notificación con la información, debemos facilitar ayuda al técnico.\n1. Verificar si el técnico fue trasladado por ambulancia o requiere apoyo. Responsable: Miguel Huitrón ó Gisel Arellano\n• Coordinar que otro técnico o supervisor acuda al lugar si está cerca. Responsable: Miguel Huitrón ó Gisel Arellano\n• Avisar al cliente sobre la situación, si es necesario y con discreción. Responsable: Gisel Arellano`);
              break;
         /* case "reglas":
              // Aquí puedes añadir la lógica que quieras para "reglas"
              await client.sendMessage(message.from, `📜 Reglas del Grupo 📜\n\n1️⃣ Respeto ante todo  \nTrata a todos los miembros con cortesía y respeto. No se toleran insultos, burlas ni lenguaje ofensivo.\n\n2️⃣ Prohibido SPAM  \n🚫 Nada de publicidad, promociones o enlaces sin permiso de los administradores.\n\n3️⃣ Temática del grupo  \n💬 Mantén los mensajes dentro del propósito del grupo. Si es un grupo de soporte, evita desviar el tema.\n\n4️⃣ Evita mensajes innecesarios  \n⚠️ No envíes cadenas, stickers en exceso o mensajes repetitivos.\n\n5️⃣ Contenido inapropiado  \n🔞 No se permite contenido ofensivo, violento, discriminatorio o sexual.\n\n6️⃣ Privacidad y seguridad  \n🔐 No compartas información personal tuya o de otros miembros.\n\n7️⃣ Respeta a los administradores  \n👮‍♂️ Las decisiones de los admins son para mantener el orden y deben ser respetadas.\n\n---\n\n🛠️ Sugerencias o dudas  \nEnvía un mensaje con el comando *contacto* para hablar con un administrador.\n\n🙌 ¡Gracias por formar parte de este grupo!`)
              break;
          case "ayuda":
              await client.sendMessage(message.from, `🆘 Ayuda del Bot\nAquí tienes algunos comandos disponibles:\n\n🕒 *horario* – Ver el horario de atención\n📜 *reglas* – Ver las reglas del grupo\n🙋 *info* – Información general del grupo`);
              break;
          case "horario":
              await client.sendMessage(message.from, `🕒 *Horario de atención*\nLunes a Viernes: 9:00 AM – 6:00 PM\nSábados: 10:00 AM – 2:00 PM\n📵 Domingos y feriados sin atención`);
              break;
          case "info":
              await client.sendMessage(message.from, `ℹ️ Información del Grupo\nEste grupo fue creado para brindar soporte, compartir novedades y resolver tus dudas.\nPor favor revisa las reglas del grupo con el comando !reglas antes de participar.\nGracias por ser parte 🙌`);
              break;
          // Puedes agregar más casos si lo necesitas
          */
        }
    }
  }
})

// FUNCION PARA DETECTAR NUEVOS PARTICIPANTES EN EL GRUPO
/*
client.on('group_join', async (notification) => {
  const groupChat = await notification.getChat();
  console.log("GROUPCHAT", groupChat)
  const newParticipant = notification.recipientIds[0];
  console.log("NUEVO PARTICIPANTE", newParticipant)

  const contact = await client.getContactById(newParticipant);

  console.log("CONTACTO", contact)

  const nameParticipant = contact.pushname || contact.name || 'Usuario';
  console.log(newParticipant)

  groupChat.sendMessage(`👋 Bienvenido/a *${nameParticipant}* Por favor revisa las reglas del grupo con el comando: *reglas*`)
 })
  */


client.initialize();

// Validar número
/*
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
*/
// Enviar mensaje
/*
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
*/

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
