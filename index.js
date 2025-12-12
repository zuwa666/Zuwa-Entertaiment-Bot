import makeWASocket, { useMultiFileAuthState, Browsers } from "@whiskeysockets/baileys"
import qrcode from "qrcode-terminal"
import express from "express"

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info")

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    browser: Browsers.macOS("Safari")
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("connection.update", ({ connection, qr }) => {
    if (qr) qrcode.generate(qr, { small: true })
    if (connection === "open") console.log("BOT IMEWASHWA ✔️")
    if (connection === "close") console.log("Connection imefungwa ❌")
  })

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message) return

    const from = msg.key.remoteJid
    const text = msg.message.conversation || ""

    if (text.toLowerCase() === "hi") {
      await sock.sendMessage(from, {
        text: "Hello! Mimi ni bot wa Zuwa Entertaiment 😎"
      })
    }

    if (text.toLowerCase() === "menu") {
      await sock.sendMessage(from, {
        text: "📌 MENU YA BOT\n1. Hi\n2. Menu"
      })
    }
  })
}

startBot()

//  Server kwa ajili ya Koyeb
const app = express()
app.get("/", (req, res) => res.send("Zuwa Bot Inafanya Kazi ✔️"))
app.listen(3000, () => console.log("Server running"))


