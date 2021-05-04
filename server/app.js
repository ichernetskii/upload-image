const path = require("path");
const fs = require("fs");

// EXPRESS
const http = require("http");
const express = require("express");
const app = express();

// WebSocket
const WebSocket = require( "ws");
const server = http.createServer(app);
const webSocketServer = new WebSocket.Server({ server });
const wsSend = function(connection, data) {
    // readyState - true, если есть подключение
    if(!connection.readyState){
        setTimeout(function () {
            wsSend(data);
        },1000);
    } else {
        if (typeof data === "object") connection.send(JSON.stringify(data))
        else connection.send(data);
    }
};


app.use(express.json({ extended: true }));

// CONFIG
process.env["NODE_CONFIG_DIR"] = path.resolve("server", "config");
const cfg = require("config");
const config = {
    port: cfg.has("port") ? cfg.get("port") : 5001
}

async function start() {
    try {
        const dispatchEvent = (message, ws) => {
            console.log("File received");
            console.log(message);
            const buffer = new Buffer.from(new Uint8Array(message));
            const stream = fs.createWriteStream("server/received/out.jpg");
            stream.write(buffer);
            stream.end();

            // const {event, payload} = JSON.parse(message);
            // console.log(`event: ${event}, payload: ${JSON.stringify(payload)}`);
            // switch (event) {
            //     case "chat-message":
            //         webSocketServer.clients.forEach(client => wsSend(client, {
            //             event,
            //             payload: {
            //                 userName: payload.userName,
            //                 message: `Server response: ${payload.message}`
            //             }
            //         }));
            //         break;
            //     case "image":
            //         console.log("File received");
            //         console.log(event);
            //         console.log(payload);
            //         break;
            //     default: wsSend(ws, {
            //         event: "error",
            //         payload: {
            //             message: "Wrong event type"
            //         }
            //     })
            // }
        }

        webSocketServer.on("connection", ws => {
            ws.on("message", m => dispatchEvent(m, ws));
            ws.on("error", e => wsSend(ws, e));

            wsSend(ws, {
                event: "startup",
                payload: {
                    message: "Hi there, I am a WebSocket server"
                }
            });
        });

        // Listen
        server.listen(config.port, () => {
            console.log("\x1b[32m\x1b[1m%s\x1b[0m", `Application started on port ${config.port}`);
        });
    } catch (e) {
        console.error("Server error", e.message);
        process.exit(1);
    }
}
start();
