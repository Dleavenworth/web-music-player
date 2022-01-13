import express from "express"
import mongodb, { ObjectId } from "mongodb"
import * as connection from "../connect.js"
export const router = express.Router()

router.get("/:songID", async (req, res) => {
	let songID
	let db = connection.getConnection()
	console.log(req.params.songID)

	try {
		songID = new ObjectId(String(req.params.songID))
		console.log("Song ID here: " + songID)
	} catch (err) {
		console.log("we're sending the 400 here")
		console.log(err)
		console.log(songID)
		return res.status(400).json({
			message:
				"Invalid trackID in URL parameter. Must be a single string of 12 bytes or 24 hex.",
		})
	}

	let length
	db.collection("fs.files")
		.find({ _id: songID }, { id: 0, length: 1 })
		.toArray(function (err, result) {
			console.log(result)
			length = result[0]["length"]
			console.log(length)
			let headers = {
				"content-type": "audio/mp3",
				"accept-ranges": "bytes",
				"content-length": length,
			}
			res.writeHead(200, headers)
		})

	let bucket = new mongodb.GridFSBucket(db)

	let downloadStream = bucket.openDownloadStream(songID)

	downloadStream.on("data", (chunk) => {
		console.log("writing audio")
		res.write(chunk)
	})

	downloadStream.on("error", () => {
		console.log("we're sending a 404 here")
		res.sendStatus(404)
	})

	downloadStream.on("end", () => {
		console.log(res)
		res.end()
	})
})
