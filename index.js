import makeWASocket, { useMultiFileAuthState } from "@index.js/baileys"
import qrcode from "qrcode-terminal"

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("auth_info")

    const sock = makeWASocket({
        printQRInTerminal: true,
        auth: state
    })

    sock.ev.on("creds.update", saveCreds)

    sock.ev.on("connection.update", ({ connection, qr }) => {
        if (qr) {
            qrcode.generate(qr, { small: true })
        }
        if (connection === "open") console.log("BOT IMEWASHWA ✔")
        if (connection === "close") console.log("Connection imefungwa ❌")
    })

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0]

        if (!msg.message) return

        const from = msg.key.remoteJid
        const text = msg.message.conversation || ""

        if (text.toLowerCase() === "hi") {
            await sock.sendMessage(from, { text: "Hello! Mimi ni bot wa Zuwa Entertainment 😎" })
        }

        if (text.toLowerCase() === "menu") {
            await sock.sendMessage(from, { text: "📌 *MENU YA BOT*\n1. Hi\n2. Menu\n" })
        }
    })
}

startBot()