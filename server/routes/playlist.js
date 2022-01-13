import * as connection from "../connect.js"
import { ObjectId } from "mongodb"
import express from "express"

export const router = express.Router()

router.get("/", (req, res) => {
	let db = connection.getConnection()
	console.log(req.query)
	if (
		req.query.search === "" ||
		req.query.search === "undefined" ||
		req.query.search === undefined
	) {
		db.collection("Playlists")
			.find({})
			.toArray(function (err, result) {
				if (err) throw err
				res.send({ playlistData: result })
			})
	} else {
		db.collection("Playlists")
			.find({
				$text: {
					$search: req.query.search,
					$caseSensitive: false,
				},
			})
			.toArray(function (err, result) {
				if (err) throw err
				res.send({ playlistData: result })
			})
	}
})

router.get("/display", (req, res) => {
	let db = connection.getConnection()
	console.log("Query is " + req.query.search)
	if (
		req.query.search === "" ||
		req.query.search === "undefined" ||
		req.query.search === undefined
	) {
		console.log("in the undefined")
		db.collection("SongInfo")
			.find({ playlist: new ObjectId(req.query.playlist) })
			.toArray(function (err, result) {
				if (err) {
					throw err
				}
				res.send({ songList: result })
				console.log(result)
			})
	} else {
		console.log("in the else")
		db.collection("SongInfo")
			.find({
				playlist: new ObjectId(req.query.playlist),
				$text: {
					$search: req.query.search,
					$caseSensitive: false,
				},
			})
			.toArray(function (err, result) {
				res.send({ songList: result })
				console.log(result)
			})
	}
})

router.patch("/addSong", (req, res) => {
	let db = connection.getConnection()
	console.log(req.query)

	db.collection("SongInfo").updateOne(
		{ _id: new ObjectId(req.query.toAdd) },
		{ $push: { playlist: new ObjectId(req.query.playlist) } },
		function (err, result) {
			if (err) throw err
			console.log("result is ")
			console.log(result)
		}
	)

	db.collection("Playlists").updateOne(
		{ _id: new ObjectId(req.query.playlist) },
		{ $push: { songs: new ObjectId(req.query.toAdd) } }
	)
	return res.status(200).json({ message: "Added to playlist" })
})

router.post("/addPlaylist", (req, res) => {
	let db = connection.getConnection()
	db.collection("Playlists").insertOne(
		{ name: req.query.playlistName, songs: [] },
		function (err, result) {
			if (err) throw err
			console.log(result)
			return res.status(200).json({ message: "Created new playlist" })
		}
	)
})

router.delete("/", (req, res) => {
	let db = connection.getConnection()
	db.collection("Playlists").deleteOne(
		{ _id: new ObjectId(req.query.playlistID) },
		(err) => {
			if (err) throw err
			db.collection("SongInfo").updateMany(
				{},
				{ $pull: { playlist: new ObjectId(req.query.playlistID) } },
				(err) => {
					if (err) throw err
					res.status(200).json({ message: "Deleted playlist" })
				}
			)
		}
	)
})

router.delete("/display", (req, res) => {
	let db = connection.getConnection()
	db.collection("Playlists").updateOne(
		{ _id: new ObjectId(req.query.playlistID) },
		{ $pull: { songs: new ObjectId(req.query.songID) } },
		(err) => {
			if (err) throw err
			db.collection("SongInfo").updateOne(
				{ _id: new ObjectId(req.query.songID) },
				{ $pull: { playlist: new ObjectId(req.query.playlistID) } },
				(err) => {
					if (err) throw err
					res.status(200).json({ message: "Removed song from playlist" })
				}
			)
		}
	)
})
