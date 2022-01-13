import React, { useEffect, useState } from "react"
import { Box, Menu, MenuItem, Toolbar, Typography } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"

export default function SongDisplay(props) {
	const [rows, setRows] = useState([])
	const [showMenu, setShowMenu] = useState(false)
	const [xPos, setXPos] = useState(0)
	const [yPos, setYPos] = useState(0)
	const [selectedRow, setSelectedRow] = useState(undefined)

	const showPlaylist = window.location.pathname === "/"
	const drawerWidth = 240
	const columns = [
		{ field: "name", headerName: "Name", editable: true, flex: 1 },
		{ field: "artist", headerName: "Artist", editable: true, flex: 1 },
		{ field: "genre", headerName: "Genre", editable: true, flex: 1 },
	]

	// If the songList prop changes then update the rows
	useEffect(() => {
		let newRows = []
		if (props.songList) {
			props.songList.forEach((currentSong) => {
				console.log(currentSong.playlist)
				let newObject = {
					id: currentSong._id,
					name: currentSong.name,
					artist: currentSong.artist,
					length: currentSong.length,
					genre: currentSong.genre,
					fileID: currentSong.fileID,
					playlist: currentSong.playlist,
				}
				console.log(newRows)
				newRows.push(newObject)
			})
		}
		setRows(newRows)
	}, [props.songList])

	function handleSongClick(selectedRowProps) {
		props.onCurSongChange(selectedRowProps.row)
	}

	function handleContextMenu(e) {
		e.preventDefault()
		setXPos(e.pageX)
		setYPos(e.pageY)
		setShowMenu(true)
		setSelectedRow(e.currentTarget.getAttribute("data-id"))
	}

	function handleClose() {
		setShowMenu(false)
		setSelectedRow(undefined)
	}

	function handleClick(e, playlist) {
		e.preventDefault()
		props.onSongAdd(selectedRow, playlist)
		handleClose()
	}

	function listPlaylist() {
		if (showPlaylist) {
			if (props.playlists.length !== 0) {
				return props.playlists.map((curPlaylist, i) => {
					return (
						<MenuItem key={i} onClick={(e) => handleClick(e, curPlaylist)}>
							<Typography>
								Add to <strong>{props.playlists[i].name}</strong>
							</Typography>
						</MenuItem>
					)
				})
			} else {
				return (
					<MenuItem>
						<Typography>No playlists!</Typography>
					</MenuItem>
				)
			}
		}
	}

	function deleteSong() {
		let fileID = props.songList.find((song) => song._id === selectedRow).fileID
		props.deleteSong(selectedRow, fileID)
		handleClose()
	}

	function removeFromPlaylist() {
		if (window.location.pathname === "/PlaylistDisplay/Playlist") {
			return (
				<MenuItem onClick={handleRemoveFromPlaylist}>
					<Typography>Remove song from playlist</Typography>
				</MenuItem>
			)
		}
	}

	function handleRemoveFromPlaylist() {
		props.removeFromPlaylist(selectedRow)
		handleClose()
	}

	return (
		<Box
			className="App"
			sx={{
				background: "#f9f9f9",
				display: "flex",
				position: "relative",
				flexGrow: 1,
				flexShrink: 0,
				width: `calc(100% - ${drawerWidth}px)`,
				ml: `${drawerWidth}px`,
			}}
		>
			<Box sx={{ flexGrow: 1, p: 3 }}>
				<Toolbar />
				<div style={{ height: "72vh" }}>
					<DataGrid
						columns={columns}
						rows={rows}
						onRowClick={handleSongClick}
						componentsProps={{
							row: {
								onContextMenu: handleContextMenu,
								style: { cursor: "context-menu" },
							},
						}}
					/>
				</div>
				<Menu
					open={showMenu}
					onClose={handleClose}
					anchorReference="anchorPosition"
					anchorPosition={
						showMenu
							? {
								top: yPos,
								left: xPos,
							}
							: null
					}
					componentsProps={{
						root: {
							onContextMenu: (e) => {
								e.preventDefault()
								handleClose()
							},
						},
					}}
				>
					{listPlaylist()}
					<MenuItem onClick={deleteSong}>
						<Typography>Delete song</Typography>
					</MenuItem>
					{removeFromPlaylist()}
				</Menu>
			</Box>
		</Box>
	)
}
