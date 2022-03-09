import makeWASocket, { AnyMessageContent, delay, DisconnectReason, makeInMemoryStore, useSingleFileAuthState } from "@adiwajshing/baileys";
import P from "pino";
import { Boom } from "@hapi/boom";

const err1="";

const store = makeInMemoryStore({ logger: P().child({ level: "debug", stream: "store" }) });
store.readFromFile("./baileys_store_multi.json");
// save every 10s
setInterval(() => {
	store.writeToFile("./baileys_store_multi.json");
}, 10000_000);

const { state, saveState } = useSingleFileAuthState("./auth_info_multi.json");
	const sock = makeWASocket({
		logger: P({ level: "trace" }),
		printQRInTerminal: true,
		auth: state,
		// implement to handle retries

	});
// start a connection
const startSock = () => {
    


	store.bind(sock.ev);

	const sendMessageWTyping = async(msg: AnyMessageContent, jid: string) => {
		await sock.presenceSubscribe(jid);
		await delay(500);

		await sock.sendPresenceUpdate("composing", jid);
		await delay(2000);

		await sock.sendPresenceUpdate("paused", jid);

		await sock.sendMessage(jid, msg);
	};
    
	sock.ev.on("chats.set", item => console.log(`recv ${item.chats.length} chats (is latest: ${item.isLatest})`));
	sock.ev.on("messages.set", item => console.log(`recv ${item.messages.length} messages (is latest: ${item.isLatest})`));
	sock.ev.on("contacts.set", item => console.log(`recv ${item.contacts.length} contacts`));



	sock.ev.on("messages.update", m => console.log(m));
	sock.ev.on("message-receipt.update", m => console.log(m));
	sock.ev.on("presence.update", m => console.log(m));
	sock.ev.on("chats.update", m => console.log(m));
	sock.ev.on("contacts.upsert", m => console.log(m));

	sock.ev.on("connection.update", (update) => {
		const { connection, lastDisconnect } = update;
	
		console.log("connection update", update);
	});
	// listen for when the auth credentials is updated
	sock.ev.on("creds.update", saveState);

	return sock;
};
startSock();

import express from "express";
import logger from "morgan";
import bodyParser from "body-parser";
import cors from "cors";
const app = express();
app.use(cors());

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

app.get("/" , async(req, res) => {



  res.json({
    "tutorial": "Construyendo una API REST con NodeJS 202222"
  });
});

app.post("/sendFile", async(req, res) => {
	const  data =req.body;
	const id = data.telefono+"@s.whatsapp.net" ;// the WhatsApp ID 
	// send a simple text!
	const sentMsg  = 	await sock.sendMessage(id, { document: { url: "sample.pdf" }, mimetype: "application/pdf",fileName:"sample.pdf" }) .then((result) => {
		res.json("Archivo enviado");
		})
		.catch((erro) => {
		console.error("Error when sending: ", erro); //return object error
		});
	
	});
		
		app.get("/sendText", async(req, res) => {
		const  data =req.body;
		const id = "56933237854"+"@s.whatsapp.net" ;// the WhatsApp ID 
		// send a simple text!
		const sentMsg  = await sock.sendMessage(id, { text: data.text});
			res.json(data.telefono+"Mensaje enviado :)"+data.text);
			
		
		});
        const port = process.env.PORT || 3001;

        app.listen(port,() => {
            console.log(`App Server Listening at ${port}`);
         });