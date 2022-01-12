import React, {Component} from "react"
import {Box, Menu, MenuItem, Toolbar, Typography} from "@mui/material"
import {Navigate} from "react-router-dom"
import {DataGrid} from "@mui/x-data-grid"

export default class PlaylistDisplay extends Component {
	constructor(props) {
		super(props)
		this.state = {
			playlistList: this.props.playlistList,
			activeIndex: undefined,
			columns: [{"field": "name", "headerName": "Name", editable: true, flex: 1}, {
				"field": "num",
				"headerName": "Number of songs",
				flex: 1
			}],
			redirect: false,
			yPos: undefined,
			xPos: undefined,
			showMenu: false
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevProps !== this.props) {
			console.log(this.state)
			this.setState({playlistList: this.props.playlistList}, () => {
				this.listPlaylist()
			})
		}
	}

	componentDidMount() {
		this.listPlaylist()
	}


	listPlaylist = () => {
		let newRows = []
		this.state.playlistList.forEach(curPlaylist => {
			let newObject = {id: curPlaylist._id, name: curPlaylist.name, num: curPlaylist.songs.length}
			newRows.push(newObject)
		})
		this.setState({rows: newRows})
	}

	handlePlaylistClick = (props) => {
		this.setState({activeIndex: props.index})
		this.props.onPlaylistSelect(props.row.id)
		this.setState({redirect: true})
	}

	handleClose = () => {
		this.setState({showMenu: false})
	}

	deletePlaylist = () => {
		this.props.deletePlaylist(this.state.selectedRow)
		this.handleClose()
	}

	handleContextMenu = (e) => {
		e.preventDefault()
		this.setState({
			xPos: e.pageX,
			yPos: e.pageY,
			showMenu: true,
			selectedRow: e.currentTarget.getAttribute("data-id")
		})
	}

	handleChangedData = (changedData) => {
		console.log(changedData)
		this.props.onChange(true, changedData)
	}

	render() {
		const drawerWidth = 240
		console.log(this.state.playlistList)
		if (this.state.redirect) {
			return (<Navigate to={"/PlaylistDisplay/Playlist"}/>)
		} else {
			return (
				<Box className="App"
					sx={{
						background: "#f9f9f9",
						display: "flex",
						flexGrow: 1,
						width: `calc(100% - ${drawerWidth}px)`,
						ml: `${drawerWidth}px`,
					}}
				>
					<Box sx={{flexGrow: 1, p: 3}}>
						<Toolbar/>
						<DataGrid columns={this.state.columns} rows={this.state.rows}
							onRowClick={this.handlePlaylistClick}
							onCellEditCommit={this.handleChangedData}
							componentsProps={{
								row:
                                          {
                                          	onContextMenu: this.handleContextMenu, style: {cursor: "context-menu"}

                                          }
							}}/>
						<Menu open={this.state.showMenu}
							onClose={this.handleClose}
							anchorReference="anchorPosition"
							anchorPosition={this.state.showMenu ? {
								top: this.state.yPos,
								left: this.state.xPos
							} : null}
							componentsProps={{
								root: {
									onContextMenu: (e) => {
										e.preventDefault()
										this.handleClose()
									}
								}
							}}>
							<MenuItem onClick={this.deletePlaylist}><Typography>Delete playlist</Typography></MenuItem>
						</Menu>
					</Box>
				</Box>
			)
		}
	}
}
