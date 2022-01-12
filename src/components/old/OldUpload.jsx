import React, {Component} from "react"
import {Box, Button, Grid, Popover, TextField, Toolbar, Typography} from "@mui/material"
import PropTypes from "prop-types"

class Upload extends Component {
	constructor(props) {
		super(props)
		this.state = {
			file: "",
			artist: "",
			genre: "",
			length: "",
			name: "",
			anchorEl: null,
			open: false,
			usePort: this.props.usePort,
			port: this.props.port
		}

	}


	createNewEntry = () => {
		if (this.state.artist !== "" && this.state.genre !== "") {
			let toPost = new FormData()
			toPost.append("songName", this.state.name)
			toPost.append("artist", this.state.artist)
			toPost.append("genre", this.state.genre)
			toPost.append("length", String(this.state.length))
			toPost.append("song", this.state.file)

			fetch(window.location.protocol + "//" + window.location.hostname + (this.state.usePort ? ":" + this.state.port : "") + "/upload", {
				method: "POST",
				body: toPost
			}).then(response => {
				response.json().catch(error => console.log(error))
			})

			this.setState({
				file: "",
				artist: "",
				genre: "",
				length: "",
				name: ""
			}, () => this.props.handleAddedSong("undefined", "/song", "songList"))
		}
	}

	unicodeToChar = (text) => {
		return text.replace(/\\u[\dA-F]{4}/gi,
			function (match) {
				return String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16))
			})
	}

	newFile = (e) => {
		console.log(this.fileInput.files.item(0))
		if (this.fileInput.files.item(0)) {
			e.preventDefault()
			console.log(e)

			let newAudio = new Audio()
			newAudio.preload = "metadata"
			newAudio.src = URL.createObjectURL(this.fileInput.files.item(0))

			newAudio.onloadeddata = () => {
				console.log(!this.state.name.replace(/\s/g, "").length)
				if(this.props.curSongs.find((curSong) => curSong.name === this.state.name) === undefined &&
                    this.state.name.replace(/\s/g, "").length && this.state.genre.replace(/\s/g, "").length
                && this.state.artist.replace(/\s/g, "").length) {
					console.log(newAudio)
					this.setState({length: newAudio.duration})
					this.setFile(this.fileInput.files.item(0))
					this.createNewEntry()
				}
				else {
					this.setState({open: true, anchorEl: e.target})
				}
			}
		}
	}

	setFile = (newFile) => {
		if (newFile !== undefined) {
			this.setState({file: newFile})
		}
	}

	setName = (newName) => {
		if (newName !== undefined) {
			this.setState({name: newName.target.value})
		}
	}

	setArtist = (newArtist) => {
		if (newArtist !== undefined) {
			this.setState({artist: newArtist.target.value})
		}
	}

	setGenre = (newGenre) => {
		if (newGenre !== undefined) {
			this.setState({genre: newGenre.target.value})
		}
	}

	handleClose = () => {
		this.setState({anchorEl: null, open: false})
	}

	render() {
		const drawerWidth = 240
		const id = this.state.open ? "simple-popover" : undefined
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
								<input type="file" ref={(ref) => this.fileInput = ref}
									style={{display: "none"}}/>
								<TextField ref={(ref) => this.name = ref} value={this.state.name}
									onChange={this.setName} label="Song name" variant="outlined"/>
								<TextField ref={(ref) => this.artist = ref} value={this.state.artist}
									onChange={this.setArtist} label="Artist name" variant="outlined"/>
								<TextField ref={(ref) => this.genre = ref} value={this.state.genre}
									onChange={this.setGenre} label="Genre" variant="outlined"/>
								<TextField label="Song file" variant="outlined" onClick={() => this.fileInput.click()}
									value={this.state.file}/>
							</form>
						</Grid>
						<Grid sx={{ml: 50, pt: 5}} item xs={12}>
							<Button onClick={(e) => this.newFile(e)} type="submit" variant="contained"
								component="label">
                                Upload File
							</Button>
							<Popover id={id} open={this.state.open} anchorEl={this.state.anchorEl} onClose={this.handleClose} anchorOrigin={{vertical: "bottom", horizontal: "left"}}>
								<Typography sx={{p: 2}}>Duplicate song name or invalid field!</Typography>
							</Popover>
						</Grid>
					</Box>
				</Grid>
			</Box>
		)
	}
}

Upload.propTypes = {
	usePort: PropTypes.bool.isRequired,
	handleAddedSong: PropTypes.func.isRequired,
	port: PropTypes.string.isRequired,
	curSongs: PropTypes.array.isRequired
}

export default Upload