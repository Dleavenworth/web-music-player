import express from "express"
import mongodb, { ObjectId } from "mongodb"
import * as connection from "../connect.js"

export const router = express.Router()

router.get("/", async (req, res) => {
	let db = connection.getConnection()
	console.log("this is req")
	console.log(req.query)
	console.log(connection.getConnection())
	console.log("DB IS " + db)
	if (
		req.query.search === "" ||
		req.query.search === "undefined" ||
		req.query.search === undefined
	) {
		db.collection("SongInfo")
			.find({})
			.toArray(function (err, result) {
				if (err) throw err
				res.send({ songList: result })
			})
	} else {
		db.collection("SongInfo")
			.find({
				$text: {
					$search: req.query.search,
					$caseSensitive: false,
				},
			})
			.toArray(function (err, result) {
				if (err) throw err
				res.send({
					express: "EXPRESS IS CONNECTED TO REACT",
					songList: result,
				})
			})
	}
})

router.delete("/", (req, res) => {
	let db = connection.getConnection()
	console.log(req.query)
	if (req.query.songID !== "undefined" && req.query.fileID !== "undefined") {
		db.collection("SongInfo").deleteOne(
			{ _id: new ObjectId(req.query.songID) },
			(err) => {
				if (err) throw err
				db.collection("Playlists").updateMany(
					{},
					{ $pull: { songs: new ObjectId(req.query.songID) } },
					(err) => {
						if (err) throw err
						db.collection("fs.files").deleteOne(
							{ _id: new ObjectId(req.query.fileID) },
							(err) => {
								if (err) throw err
								db.collection("fs.chunks").deleteMany(
									{ files_id: new ObjectId(req.query.fileID) },
									(err) => {
										if (err) throw err
										res.status(200).json({ message: "Deleted song" })
									}
								)
							}
						)
					}
				)
			}
		)
	} else {
		console.log(req.query)
		console.log("req.query is undefined")
	}
})
