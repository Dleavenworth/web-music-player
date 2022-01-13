import express from "express"
const app = express()
import cors from "cors"
import dotenv from "dotenv"
import { dirname } from "path"
import { fileURLToPath } from "url"
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({path: "config.env"})
const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json())
import mongodb, { ObjectId } from "mongodb"
const MongoClient = mongodb.MongoClient
import multer from "multer"
import { Readable } from "readable-stream"
import path from "path"
const Db = process.env.ATLAS_URI
//const Db = "mongodb+srv://root:<password>@songdb.17be8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const audioRoute = express.Router()
const uploadRoute = express.Router()
const playlistRoute = express.Router()
const songRoute = express.Router()
app.use("/audio", audioRoute)
app.use("/upload", uploadRoute)
app.use("/playlist", playlistRoute)
app.use("/song", songRoute)
app.use(express.static(path.join(__dirname, "../build")))


let db
MongoClient.connect(Db, {useUnifiedTopology: true}, (err, client) => {
	if (err) {
		console.log(process.env)
		console.log(process.env.ATLAS_URI)
		console.log(process.env.PORT)
		console.log("MongoDB connection error. Please check the connection string or DB.")
		process.exit(1)
	}
	db = client.db("SongDB")
	console.log("Connection to DB successful")
})

/*app.get("*", (req, res) => {
    res.sendFile(path.join(path.join(__dirname, '../build')))
})*/

songRoute.get("/", (req, res) => {
	console.log("this is req")
	console.log(req.query)
	if (req.query.search === "" || req.query.search === "undefined" || req.query.search === undefined) {
		db.collection("SongInfo").find({}).toArray(function (err, result) {
			if (err) throw err
			res.send({songList: result})
		})
	} else {
		db.collection("SongInfo").find({
			$text: {
				$search: req.query.search,
				$caseSensitive: false
			}
		}).toArray(function (err, result) {
			if (err) throw err
			res.send({express: "EXPRESS IS CONNECTED TO REACT", songList: result})
		})
	}
})

songRoute.post("/", (req, res) => {
	console.log(req.body)
	res.send("POST REQUEST MADE")
})

audioRoute.get("/:songID", (req, res) => {
	let songID

	try {
		songID = new ObjectId(req.params.songID)
		console.log("Song ID here: " + songID)
	} catch (err) {
		console.log("we're sending the 400 here")
		return res.status(400).json({message: "Invalid trackID in URL parameter. Must be a single string of 12 bytes or 24 hex."})
	}


	//res.set('content-type', 'audio/mp3')
	//res.set('accept-ranges', 'bytes')
	let length
	db.collection("fs.files").find({_id: songID}, {id: 0, length: 1}).toArray(function (err, result) {
		console.log(result)
		length = result[0]["length"]
		console.log(length)
		let headers = {"content-type": "audio/mp3", "accept-ranges": "bytes", "content-length": length}
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

function uploadFile(req, songName, id, res) {
	// Covert buffer to Readable Stream
	const readableTrackStream = new Readable()
	readableTrackStream.push(req.file.buffer)
	readableTrackStream.push(null)

	let bucket = new mongodb.GridFSBucket(db)

	let uploadStream = bucket.openUploadStream(songName)
	uploadStream.id = id
	readableTrackStream.pipe(uploadStream)


	uploadStream.on("error", () => {
		return res.status(500).json({message: "Error uploading file"})
	})

	uploadStream.on("finish", () => {
		console.log("Stored under ID: " + id)
		return res.status(201).json({message: "File uploaded successfully"})
	})
}

uploadRoute.post("/", (req, res) => {

	console.log("upload req")
	console.log(req)

	const storage = multer.memoryStorage()
	const upload = multer({storage: storage, limits: {fieldSize: 20000000, fileSize: 20000000, files: 1}})

	upload.single("song")(req, res, (err) => {
		if (err) {
			console.log("Upload Request Validation Failed")
			console.log(err)
			return res.status(400).json({message: "Upload Request Validation Failed, something is wrong with the file format, or size"})
		} else if (!req.body.songName) {
			console.log("No track name in request body")
			return res.status(400).json({message: "No track name in request body"})
		}

		console.log(req.body)

		let songName = req.body.songName
		let artist = req.body.artist
		let genre = req.body.genre
		let length = req.body.length
		let id = new ObjectId()

		db.collection("SongInfo").insertOne({
			"name": songName,
			"artist": artist,
			"genre": genre,
			"length": length,
			"playlist": [],
			"fileID": id
		})
			.then(response => {
				console.log("Inserted at ID: " + response.insertedId)
				uploadFile(req, songName, id, res)
			})
			.catch(error => {
				console.log(error)
				return res.status(400).json({message: "Document to insert failed validation"})
			})
	})
})

songRoute.delete("/", (req, res) => {
	console.log(req.query)
	if(req.query.songID !== "undefined" && req.query.fileID !== "undefined") {
		db.collection("SongInfo").deleteOne({_id: new ObjectId(req.query.songID)}, (err) => {
			if (err) throw err
			db.collection("Playlists").updateMany({}, {$pull: {"songs": new ObjectId(req.query.songID)}}, (err) => {
				if (err) throw err
				db.collection("fs.files").deleteOne({_id: new ObjectId(req.query.fileID)}, (err) => {
					if (err) throw err
					db.collection("fs.chunks").deleteMany({files_id: new ObjectId(req.query.fileID)}, (err) => {
						if (err) throw err
						res.status(200).json({message: "Deleted song"})
					})
				})
			})
		})
	}
	else {
		console.log(req.query)
		console.log("req.query is undefined")
	}
})

playlistRoute.get("/", (req, res) => {
	console.log(req.query)
	if (req.query.search === "" || req.query.search === "undefined" || req.query.search === undefined) {
		db.collection("Playlists").find({}).toArray(function (err, result) {
			if (err) throw err
			res.send({playlistData: result})
		})
	} else {
		db.collection("Playlists").find({
			$text: {
				$search: req.query.search,
				$caseSensitive: false
			}
		}).toArray(function (err, result) {
			if (err) throw err
			res.send({playlistData: result})
		})
	}
	//console.log(res)
})

playlistRoute.get("/display", (req, res) => {
	console.log("Query is " + req.query.search)
	if (req.query.search === "" || req.query.search === "undefined" || req.query.search === undefined) {
		console.log("in the undefined")
		db.collection("SongInfo").find({playlist: new ObjectId(req.query.playlist)}).toArray(function (err, result) {
			res.send({songList: result})
			console.log(result)
		})
	} else {
		console.log("in the else")
		db.collection("SongInfo").find({
			playlist: new ObjectId(req.query.playlist),
			$text: {
				$search: req.query.search,
				$caseSensitive: false
			}
		}).toArray(function (err, result) {
			res.send({songList: result})
			console.log(result)
		})
	}
})

playlistRoute.patch("/addSong", (req, res) => {
	console.log(req.query)

	db.collection("SongInfo").updateOne({_id: new ObjectId(req.query.toAdd)},
		{$push: {playlist: new ObjectId(req.query.playlist)}},
		function (err, result) {
			if (err) throw err
			console.log("result is ")
			console.log(result)
		})

	db.collection("Playlists").updateOne({_id: new ObjectId(req.query.playlist)}, {$push: {"songs": new ObjectId(req.query.toAdd)}})
	return res.status(200).json({message: "Added to playlist"})
})

playlistRoute.post("/addPlaylist", (req, res) => {
	db.collection("Playlists").insertOne({name: req.query.playlistName, songs: []}, function (err, result) {
		if (err) throw err
		console.log(result)
		return res.status(200).json({message: "Created new playlist"})
	})
})

playlistRoute.delete("/", (req, res) => {
	db.collection("Playlists").deleteOne({_id: new ObjectId(req.query.playlistID)}, (err) => {
		if (err) throw err
		db.collection("SongInfo").updateMany({}, {$pull: {"playlist": new ObjectId(req.query.playlistID)}}, (err) => {
			if (err) throw err
			res.status(200).json({message: "Deleted playlist"})
		})
	})
})

playlistRoute.delete("/display", (req, res) => {
	db.collection("Playlists").updateOne({_id: new ObjectId(req.query.playlistID)}, {$pull: {"songs": new ObjectId(req.query.songID)}}, (err) => {
		if (err) throw err
		db.collection("SongInfo").updateOne({_id: new ObjectId(req.query.songID)}, {$pull: {"playlist": new ObjectId(req.query.playlistID)}}, (err) => {
			if (err) throw err
			res.status(200).json({message: "Removed song from playlist"})
		})
	})
})


app.listen(port, () => console.log("Listening on port " + port + " with static path " + path.join(__dirname, "../public")))