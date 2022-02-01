import React, { useState, useEffect } from "react"
import { Box, Menu, MenuItem, Toolbar, Typography } from "@mui/material"
import { Navigate } from "react-router-dom"
import { DataGrid } from "@mui/x-data-grid"
import PropTypes from "prop-types"

export default function PlaylistDisplay(props) {
	const [redirect, setRedirect] = useState(false)
	const [yPos, setYPos] = useState(undefined)
	const [xPos, setXPos] = useState(undefined)
	const [showMenu, setShowMenu] = useState(false)
	const [rows, setRows] = useState([])
	const [selectedRow, setSelectedRow] = useState(undefined)

	const drawerWidth = 240
	const columns = [
		{ field: "name", headerName: "Name", editable: true, flex: 1 },
		{ field: "num", headerName: "Number of songs", flex: 1 },
	]

	useEffect(() => {
		listPlaylist()

	}, [props.playlistList])

	const listPlaylist = () => {
		let newRows = []
		props.playlistList.forEach((curPlaylist) => {
			let newObject = {
				id: curPlaylist._id,
				name: curPlaylist.name,
				num: curPlaylist.songs.length,
			}
			newRows.push(newObject)
		})
		setRows(newRows)
	}

	const handlePlaylistClick = (e) => {
		props.onPlaylistSelect(e.row.id)
		setRedirect(true)
	}

	const handleClose = () => {
		setShowMenu(false)
	}

	const deletePlaylist = () => {
		props.deletePlaylist(selectedRow)
		handleClose()
	}

	const handleContextMenu = (e) => {
		e.preventDefault()
		setXPos(e.pageX)
		setYPos(e.pageY)
		setShowMenu(true)
		setSelectedRow(e.currentTarget.getAttribute("data-id"))
	}

	const handleChangedData = (changedData) => {
		console.log(changedData)
		props.onChange(true, changedData)
	}

	if (redirect) {
		return <Navigate to={"/PlaylistDisplay/Playlist"} />
	} else {
		return (
			<Box
				className="App"
				sx={{
					background: "#f9f9f9",
					display: "flex",
					flexGrow: 1,
					width: `calc(100% - ${drawerWidth}px)`,
					ml: `${drawerWidth}px`,
				}}
			>
				<Box sx={{ flexGrow: 1, p: 3 }}>
					<Toolbar />
					<DataGrid
						columns={columns}
						rows={rows}
						onRowClick={handlePlaylistClick}
						onCellEditCommit={handleChangedData}
						componentsProps={{
							row: {
								onContextMenu: handleContextMenu,
								style: { cursor: "context-menu" },
							},
						}}
					/>
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
						<MenuItem onClick={deletePlaylist}>
							<Typography>Delete playlist</Typography>
						</MenuItem>
					</Menu>
				</Box>
			</Box>
		)
	}
}

PlaylistDisplay.propTypes = {
	onPlaylistSelect: PropTypes.func,
	deletePlaylist: PropTypes.func,
	onChange: PropTypes.func,
	playlistList: PropTypes.array
}
