// // event driven architecture

// import http from "http"
// import events from "events"

// const entry = new events.EventEmitter()

// entry.on("signin", () => {
//     console.log("user is signed")
// })

// const Server = http.createServer((req, res) => {
//     if(req.url === "/signin") {
//         entry.emit("signin")
//         res.end("server is running")
//     } else {
//         res.end("server not found error")
//     }
// })
// Server.listen(3000)

import express from "express"
import events from "events"

const app = express()
const PORT = 3000

const entry = new events.EventEmitter()
entry.on("signin", () => {
    console.log("user signed sucessfully")
})


app.get("/signin", (req, res) => {
    res.send("user signed in")
    entry.emit("signin")
})


app.listen(PORT, () => {
    console.log(`server is run on the ${PORT}`);
})