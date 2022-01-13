import express from "express"
import * as connection from "../connect.js"
import { Readable } from "readable-stream"
import mongodb, { ObjectId } from "mongodb"
import multer from "multer"

export const router = express.Router()

const uploadFile = (req, songName, id, res) => {
	let db = connection.getConnection()
	// Covert buffer to Readable Stream
	const readableTrackStream = new Readable()
	readableTrackStream.push(req.file.buffer)
	readableTrackStream.push(null)

	let bucket = new mongodb.GridFSBucket(db)

	let uploadStream = bucket.openUploadStream(songName)
	uploadStream.id = id
	readableTrackStream.pipe(uploadStream)

	uploadStream.on("error", () => {
		return res.status(500).json({ message: "Error uploading file" })
	})

	uploadStream.on("finish", () => {
		console.log("Stored under ID: " + id)
		return res.status(201).json({ message: "File uploaded successfully" })
	})
}

router.post("/", (req, res) => {
	let db = connection.getConnection()
	console.log("upload req")
	console.log(req)

	const storage = multer.memoryStorage()
	const upload = multer({
		storage: storage,
		limits: { fieldSize: 20000000, fileSize: 20000000, files: 1 },
	})

	upload.single("song")(req, res, (err) => {
		if (err) {
			console.log("Upload Request Validation Failed")
			console.log(err)
			return res.status(400).json({
				message:
					"Upload Request Validation Failed, something is wrong with the file format, or size",
			})
		} else if (!req.body.songName) {
			console.log("No track name in request body")
			return res.status(400).json({ message: "No track name in request body" })
		}

		console.log(req.body)

		let songName = req.body.songName
		let artist = req.body.artist
		let genre = req.body.genre
		let length = req.body.length
		let id = new ObjectId()

		db.collection("SongInfo")
			.insertOne({
				name: songName,
				artist: artist,
				genre: genre,
				length: length,
				playlist: [],
				fileID: id,
			})
			.then((response) => {
				console.log("Inserted at ID: " + response.insertedId)
				uploadFile(req, songName, id, res)
			})
			.catch((error) => {
				console.log(error)
				return res
					.status(400)
					.json({ message: "Document to insert failed validation" })
			})
	})
})
