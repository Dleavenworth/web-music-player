import React, {Component} from "react"
import Drawer from "@mui/material/Drawer"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import {Box, Toolbar} from "@mui/material"
import {Link, withRouter} from "react-router-dom"

class SideBar extends Component {
	constructor(props) {
		super(props)
		this.state = {
			activePage: ""
		}
	}

	handleNewPage = (newPageName, newPagePath) => {
		this.props.onCurPageChange(newPageName)
		this.props.history.push(newPagePath)
	}

	render() {
		const drawerWidth = 240
		console.log(this.props.history)
		return (
			<Drawer
				variant="permanent"
				anchor="left"
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					"& .MuiDrawer-paper": {width: drawerWidth, boxSizing: "border-box"}
				}}>
				<Toolbar/>
				<Box sx={{overflow: "auto"}}>
					<List>
						<ListItem button key="SongDisplay" component={Link} to={"/"} onClick={() => this.handleNewPage("Home", "/")}>
							<ListItemText primary="Home"/>
						</ListItem>
						<ListItem button key="Upload" component={Link} to={"/Upload"} onClick={() => this.handleNewPage("Upload", "/Upload")}>
							<ListItemText primary="Upload"/>
						</ListItem>
						<ListItem button key="PlaylistDisplay" component={Link} to={"/PlaylistDisplay"} onClick={() => this.handleNewPage("Playlist", "/PlaylistDisplay")}>
							<ListItemText primary="Playlists"/>
						</ListItem>
						<ListItem button key="PlaylistUpload" component={Link} to={"/PlaylistUpload"} onClick={() => this.handleNewPage("Create playlist", "/PlaylistUpload")}>
							<ListItemText primary="Create playlist"/>
						</ListItem>
					</List>
				</Box>
			</Drawer>
		)
	}
}

export default withRouter(SideBar)