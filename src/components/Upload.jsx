import React, { useState, useEffect, useRef} from "react"
import useEffectAllDepsChange from "./../util/useEffectAllDepsChange"
import {Grid, Box, TextField, Popover, Button, Typography, Toolbar} from "@mui/material"
import PropTypes from "prop-types"

export default function Upload(props) {
	const [file, setFile] = useState("")
	const [artist, setArtist] = useState("")
	const [genre, setGenre] = useState("")
	const [length, setLength] = useState("")
	const [name, setName] = useState("")
	const [anchorEl, setAnchorEl] = useState(null)
	const [open, setOpen] = useState(false)
	const [usePort] = useState(props.usePort)
	const [port]= useState(props.port)

	const fileInput = useRef(null)
	const nameRef = useRef(null)
	const artistRef = useRef(null)
	const genreRef = useRef(null)

	const drawerWidth = 240
	let id = open ? "simple-popover" : undefined

	useEffectAllDepsChange(() => {
		console.log("all deps change")
		createNewEntry()
	}, [file, length])

	useEffect(() => {
		id = open ? "simple-popover" : undefined
	}, [open])

	const createNewEntry = () => {
		if (artist !== "" && genre !== "") {
			let toPost = new FormData()

			toPost.append("songName", name)
			toPost.append("artist", artist)
			toPost.append("genre", genre)
			toPost.append("length", String(length))
			toPost.append("song", file)

			fetch(window.location.protocol + "//" + window.location.hostname + (usePort ? ":" + port : "") + "/upload", {
				method: "POST",
				body: toPost
			}).then(response => {
				response.json().catch(error => console.log(error))
				props.handleAddedSong("undefined", "/song", "songList")
			})

			setFile("")
			setArtist("")
			setGenre("")
			setLength("")
			setName("")
		}
	}

	const newFile = (e) => {
		e.preventDefault()
		if (fileInput.current.files.item(0)) {

			let newAudio = new Audio()
			newAudio.preload = "metadata"
			newAudio.src = URL.createObjectURL(fileInput.current.files.item(0))

			newAudio.onloadeddata = () => {
				if (props.curSongs.find((curSong) => curSong.name === name) === undefined && 
				name.replace(/\s/g, "").length && genre.replace(/\s/g, "").length && 
				artist.replace(/\s/g, "").length) {
					console.log(newAudio.duration)
					setLength(newAudio.duration)
					console.log(fileInput.current.files.item(0))
					setFile(fileInput.current.files.item(0))
				}
				else {
					setOpen(true)
					setAnchorEl(e.target)
				}
			}
		}
	}

	const handleClose = () => {
		setAnchorEl(null)
		setOpen(false)
	}

	const handleSet = (e, stateVar) => {
		console.log(e.target.value)
		switch (stateVar) {
			case "name":
				setName(e.target.value)
				break
			case "artist":
				setArtist(e.target.value)
				break
			case "genre":
				setGenre(e.target.value)
				break
		}
	}

	return (
		<Box sx={{
			display: "flex",
			flexGrow: 1,
			ml: `calc(20% + ${drawerWidth}px)`,
		}}>
			<Grid container spacing={2}>
				<Box sx={{pt: 5, flexGrow: 1}}>
					<Toolbar/>
					<Grid item xs={12}>
						<form>
							<input type="file" ref={fileInput}
								style={{display: "none"}}/>
							<TextField ref={nameRef} value={name}
								onChange={(e) => handleSet(e, "name")} label="Song name" variant="outlined"/>
							<TextField ref={artistRef} value={artist}
								onChange={(e) => handleSet(e, "artist")} label="Artist name" variant="outlined"/>
							<TextField ref={genreRef} value={genre}
								onChange={(e) => handleSet(e, "genre")} label="Genre" variant="outlined"/>
							<TextField label="Song file" variant="outlined" onClick={() => fileInput.current.click()}
								value={file}/>
						</form>
					</Grid>
					<Grid sx={{ml: 50, pt: 5}} item xs={12}>
						<Button onClick={(e) => newFile(e)} type="submit" variant="contained"
							component="label">
                                Upload File
						</Button>
						<Popover id={id} open={open} anchorEl={anchorEl} onClose={handleClose} anchorOrigin={{vertical: "bottom", horizontal: "left"}}>
							<Typography sx={{p: 2}}>Duplicate song name or invalid field!</Typography>
						</Popover>
					</Grid>
				</Box>
			</Grid>
		</Box>
	)
}

Upload.propTypes = {
	usePort: PropTypes.bool.isRequired,
	handleAddedSong: PropTypes.func.isRequired,
	port: PropTypes.string.isRequired,
	curSongs: PropTypes.array.isRequired
}