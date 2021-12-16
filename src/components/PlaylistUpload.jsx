import React, { Component } from 'react'
import {Box, Button, Grid, Popover, TextField, Toolbar, Typography} from "@mui/material";

export default class PlaylistUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            open: false,
            anchorEl: null
        }
    }

    setName = (newName) => {
        console.log(newName)
        this.setState({name: newName.target.value})
    }

    newPlaylist = (e) => {
        console.log(!this.state.name.replace(/\s/g, '').length)
        if(this.props.curPlaylists.find(curPlaylist => curPlaylist.name === this.state.name) === undefined && this.state.name.replace(/\s/g, '').length) {
            this.props.onPlaylistAdd(this.state.name)
        }
        else {
            console.log("duplicate name")
            this.setState({open: true, anchorEl: e.target})
        }
        this.setState({name: ""})
    }

    handleClose = () => {
        this.setState({open: false, anchorEl: null})
    }


    render() {
        console.log(this.state.name)
        const drawerWidth = 240
        const id = this.state.open ? 'simple-popover' : undefined
        return (
            <Box sx={{
                display: 'flex',
                flexGrow: 1,
                width: `calc(100% - ${drawerWidth}px)`,
                ml: `${drawerWidth}px`,
            }}>
                <Grid container spacing={2}>
                    <Box sx={{pt: 5, flexGrow: 1}}>
                        <Toolbar/>
                        <Grid item xs={12}>
                                <TextField ref={(ref) => this.name = ref} value={this.state.name}
                                           onChange={this.setName} label="Playlist name" variant="outlined"/>
                        </Grid>
                        <Grid sx={{pt: 5}} item xs={12}>
                            <Button onClick={(e) => this.newPlaylist(e)} variant="contained"
                                    component="label">
                                Create playlist
                            </Button>
                            <Popover id={id} open={this.state.open} anchorEl={this.state.anchorEl} onClose={this.handleClose} anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}>
                            <Typography sx={{p: 2}}>Duplicate playlist name or invalid playlist name!</Typography>
                        </Popover>
                        </Grid>
                    </Box>
                </Grid>
            </Box>
        )
    }
}