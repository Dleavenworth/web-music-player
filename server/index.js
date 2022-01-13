import express from "express"
import { router as audioRoute } from "./routes/audio.js"
import { router as songRoute } from "./routes/songs.js"
import { router as uploadRoute } from "./routes/upload.js"
import { router as playlistRoute } from "./routes/playlist.js"
import * as connection from "./connect.js"
import cors from "cors"
import dotenv from "dotenv"
import { dirname } from "path"
import { fileURLToPath } from "url"
import path from "path"

const app = express()
const __dirname = dirname(fileURLToPath(import.meta.url))
const port = process.env.PORT || 5000

dotenv.config({ path: "config.env" })
app.use(cors())
app.use(express.json())
//const Db = "mongodb+srv://root:<password>@songdb.17be8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

connection.connect()

app.use("/audio", audioRoute)
app.use("/upload", uploadRoute)
app.use("/playlist", playlistRoute)
app.use("/song", songRoute)
app.use(express.static(path.join(__dirname, "../build")))

app.listen(port, () =>
	console.log(
		"Listening on port " +
			port +
			" with static path " +
			path.join(__dirname, "../public")
	)
)
