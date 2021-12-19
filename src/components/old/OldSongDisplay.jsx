import '../../App.css'
import React, {Component} from "react"
import {
    Box, Menu, MenuItem,
    Toolbar, Typography,
} from "@mui/material"
import {DataGrid} from '@mui/x-data-grid';

export default class OldSongDisplay extends Component {
    constructor(props) {
        super(props)
        this.state = {
            res: "",
            songList: this.props.songList,
            curSong: null,
            activeIndex: this.props.activeIndex,
            contextMenu: null,
            rows: [],
            columns: [{"field": "name", "headerName": "Name", editable: true, flex: 1}, {
                "field": "artist",
                "headerName": "Artist",
                editable: true,
                flex: 1
            },
                {"field": "genre", "headerName": "Genre", editable: true, flex: 1}],
            showMenu: false,
            playlists: this.props.playlists,
            selectedRow: undefined,
            selectedRowPlaylistsNum: undefined,
            showPlaylist: false,
            xPos: undefined,
            yPos: undefined
        }
    }

    handleSongClick = (props) => {
        console.log(props)
        this.setCurSong(props.row)
        this.setState({activeIndex: props.index})
        this.props.onActiveIndexChange(props.index)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps !== this.props) {
            console.log(this.state)
            this.setState({
                songList: this.props.songList,
                activeIndex: this.props.activeIndex,
                playlists: this.props.playlists,
                showPlaylist: window.location.pathname === "/",
                showMenu: false,
            }, () => {
                this.songList()
            })
        }
    }

    componentDidMount() {
        this.songList()
        this.setState({showPlaylist: window.location.pathname === "/"})
    }


    // This is handleLangChange from SO (child)
    setCurSong = (curSong) => {
        this.setState({curSong: curSong})
        this.props.onCurSongChange(curSong)
    }

    handleContextMenu = (e) => {
        e.preventDefault()
        console.log(e)
        console.log(e.currentTarget)
        this.setState({
            xPos: e.pageX, yPos: e.pageY, showMenu: true, selectedRow:
                e.currentTarget.getAttribute('data-id'),
            selectedRowPlaylistNum: e.currentTarget.getAttribute('playlist')
        })
    }

    handleClose = () => {
        this.setState({showMenu: false, selectedRow: undefined})
    }

    songList = () => {
        console.log(this.state.songList)
        let newRows = []
        this.state.songList.forEach((currentSong) => {
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
        this.setState({rows: newRows})
    }

    handleClick = (e, playlist) => {
        e.preventDefault()
        // we have the current row data, and the entire list of songs, so we need to find the id in the current row in the entire list
        console.log(this.state.selectedRow)
        this.props.onSongAdd(this.state.selectedRow, playlist)
        this.handleClose()
    }

    listPlaylist = () => {
        if (this.state.showPlaylist) {
            console.log(this.state.playlists[0])
            if (this.state.playlists.length !== 0) {
                return this.state.playlists.map((curPlaylist, i) => {
                    console.log(curPlaylist)
                    return (
                        <MenuItem key={i} onClick={(e) => this.handleClick(e, curPlaylist)}>
                            <Typography>Add to <strong>{this.state.playlists[i].name}</strong></Typography>
                        </MenuItem>

                    )
                })
            } else {
                return (<MenuItem><Typography>No playlists!</Typography></MenuItem>)
            }
        }
    }

    deleteSong = () => {
        let fileID = this.state.songList.find(song => song._id === this.state.selectedRow).fileID
        this.props.deleteSong(this.state.selectedRow, fileID)
        this.handleClose()
    }

    removeFromPlaylist = () => {
        if(window.location.pathname === "/PlaylistDisplay/Playlist") {
            return(<MenuItem onClick={this.handleRemoveFromPlaylist}><Typography>Remove song from playlist</Typography></MenuItem>)
        }
    }

    handleRemoveFromPlaylist = () => {
        this.props.removeFromPlaylist(this.state.selectedRow)
        this.handleClose()
    }

    render() {
        console.log(this.state)
        const drawerWidth = 240
        return (
            <Box className="App"
                 sx={{
                     background: "#f9f9f9",
                     display: 'flex',
                     position: "relative",
                     flexGrow: 1,
                     flexShrink: 0,
                     width: `calc(100% - ${drawerWidth}px)`,
                     ml: `${drawerWidth}px`,
                 }}
            >
                <Box sx={{flexGrow: 1, p: 3}}>
                    <Toolbar/>
                    <div style={{height: "72vh"}}>
                        <DataGrid columns={this.state.columns} rows={this.state.rows}
                                  onRowClick={this.handleSongClick}
                                  componentsProps={{
                                      row:
                                          {
                                              onContextMenu: this.handleContextMenu, style: {cursor: 'context-menu'}

                                          }
                                  }}/>
                    </div>
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
                        {this.listPlaylist()}
                        <MenuItem onClick={this.deleteSong}><Typography>Delete song</Typography></MenuItem>
                        {this.removeFromPlaylist()}
                    </Menu>
                </Box>
            </Box>
        );
    }
}