import React, {useState} from "react"
import {Box, Button, Grid, Popover, TextField, Toolbar, Typography} from "@mui/material"

export default function PlaylistUpload(props) {
	const [name, setName] = useState("")
	const [open, setOpen] = useState(false)
	const [anchorEl, setAnchorEl] = useState(null)
	const drawerWidth = 240
	let id

	function newPlaylist(e) {
		if(props.curPlaylists.find(curPlaylist => curPlaylist.name === name) === undefined && name.replace(/\s/g, "").length) {
			props.onPlaylistAdd(name)
		}
		else {
			console.log("duplicate name")
			setOpen(true)
			setAnchorEl(e.target)
		}
		id = open ? "simple-popover" : undefined
		setName("")
	}

	function handleClose() {
		setOpen(false)
		setAnchorEl(null)
	}

	return (
		<Box sx={{
			display: "flex",
			flexGrow: 1,
			width: `calc(100% - ${drawerWidth}px)`,
			ml: "50vw"
		}}>
			<Grid container spacing={2}>
				<Box sx={{pt: 5, flexGrow: 1}}>
					<Toolbar/>
					<Grid item xs={12}>
						<TextField value={name}
							onChange={(e) => setName(e.target.value)} label="Playlist name" variant="outlined"/>
					</Grid>
					<Grid sx={{pt: 5}} item xs={12}>
						<Button onClick={(e) => newPlaylist(e)} variant="contained"
							component="label">
                            Create playlist
						</Button>
						<Popover open={open} anchorEl={anchorEl} onClose={handleClose} anchorOrigin={{vertical: "bottom", horizontal: "left"}}>
							<Typography sx={{p: 2}}>Duplicate playlist name or invalid playlist name!</Typography>
						</Popover>
					</Grid>
				</Box>
			</Grid>
		</Box>
	)
}