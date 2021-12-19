import {Box, Toolbar} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import {Link} from "react-router-dom";
import ListItemText from "@mui/material/ListItemText";
import Drawer from "@mui/material/Drawer";
import React from "react";

export default function SideBar() {
    const drawerWidth = 240

    function handleNewPage(newPageName, newPagePath) {

    }

    return (
        <Drawer
            variant="permanent"
            anchor="left"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {width: drawerWidth, boxSizing: "border-box"}
            }}>
            <Toolbar/>
            <Box sx={{overflow: 'auto'}}>
                <List>
                    <ListItem button key="SongDisplay" component={Link} to={"/"} onClick={() => handleNewPage("Home", "/")}>
                        <ListItemText primary="Home"/>
                    </ListItem>
                    <ListItem button key="Upload" component={Link} to={"/Upload"} onClick={() => handleNewPage("Upload", "/Upload")}>
                        <ListItemText primary="Upload"/>
                    </ListItem>
                    <ListItem button key="PlaylistDisplay" component={Link} to={"/PlaylistDisplay"} onClick={() => handleNewPage("Playlist", "/PlaylistDisplay")}>
                        <ListItemText primary="Playlists"/>
                    </ListItem>
                    <ListItem button key="PlaylistUpload" component={Link} to={"/PlaylistUpload"} onClick={() => handleNewPage("Create playlist", "/PlaylistUpload")}>
                        <ListItemText primary="Create playlist"/>
                    </ListItem>
                </List>
            </Box>
        </Drawer>
    )
}