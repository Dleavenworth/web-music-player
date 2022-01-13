import mongodb from "mongodb"
import dotenv from "dotenv"
import { dirname } from "path"
import { fileURLToPath } from "url"
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: "config.env" })

const Db = process.env.ATLAS_URI
const MongoClient = mongodb.MongoClient

let db

export function connect() {
	MongoClient.connect(Db, { useUnifiedTopology: true }, (err, client) => {
		if (err) {
			console.log(err)
			console.log(process.env)
			console.log(process.env.ATLAS_URI)
			console.log(process.env.PORT)
			console.log(
				"MongoDB connection error. Please check the connection string or DB."
			)
			process.exit(1)
		}
		db = client.db("SongDB")
		console.log("Connection to DB successful")
	})
}

export function getConnection() {
	return db
}
