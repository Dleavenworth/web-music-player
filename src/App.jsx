import Upload from "./components/Upload"
import {Routes, Route} from "react-router-dom"
import {Box, CssBaseline} from "@mui/material"
import SideBar from "./components/SideBar"
import React, {Component} from "react"
import ProgressBar from "./components/ProgressBar"
import TopBar from "./components/TopBar"
import PlaylistDisplay from "./components/PlaylistDisplay"
import PlaylistUpload from "./components/PlaylistUpload"
import Settings from "./components/Settings"
import SongDisplay from "./components/SongDisplay"

export default class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            curSong: undefined,
            songList: [],
            timeOut: 0,
            curPage: 'Home',
            curSearch: undefined,
            playlistList: [],
            playlistSongList: [],
            curPlaylist: undefined,
            activeIndex: undefined,
            songToAdd: undefined,
            port: process.env.PORT ? String(process.env.PORT) : "5000",
            usePort: true,
        }
        console.log(process.env.REACT_APP_PORT)
    }

    componentDidMount() {
        this.makeSearch(undefined, "/song", "songList", undefined)
        this.makeSearch(undefined, "/playlist", "playlist", undefined)
        console.log(window.location.pathname)
    }

    makeSearch = (query, route, stateVar, playlist) => {
        console.log("making search")
        console.log(window.location.hostname)
        console.log(query)
        console.log("statevar " + stateVar)
        console.log("route " + route)
        console.log(window.location.protocol + "//" + window.location.hostname  + (this.state.usePort ? ":" + this.state.port : "") + route + "?search=" +
            String(query) + "&playlist=" + playlist)
        this.setState({curSearch: query})
        fetch(window.location.protocol + "//" + window.location.hostname  + (this.state.usePort ? ":" + this.state.port : "") + route + "?search=" +
            String(query) + "&playlist=" + playlist, {
            method: 'GET'
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if (stateVar === "songList") {
                    console.log("Setting songlist")
                    this.setState({songList: data.songList})
                } else if (stateVar === "playlist") {
                    console.log("setting playlist")
                    this.setState({playlistList: data.playlistData})
                } else if (stateVar === "playlistList") {
                    console.log("setting playlist song display")
                    this.setState({playlistSongList: data.songList})
                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }

// This is the handleLang from SO (parent)
    setParentCurSong = (newSong) => {
        this.setState({curSong: newSong})
        console.log("printing state in APP")
        console.log(this.state)
    }

    setNewSearch = (newSearch, route, stateVar) => {
        const self = this
        console.log("timeout " + this.state.timeOut)
        if (this.state.timeOut) {
            console.log("clearing timeout")
            clearTimeout(this.state.timeOut)
        }
        self.setState({
            timeOut: setTimeout(() => {
                self.makeSearch(newSearch, route, stateVar, this.state.curPlaylist)
            }, 1000)
        })
    }

    setCurPage = (newPage) => {
        console.log("New page is : " + newPage)
        this.setState({curPage: newPage})
    }

    setSelectedPlaylist = (newPlaylist) => {
        console.log(newPlaylist)
        this.setState({curPlaylist: newPlaylist}, () => console.log(this.state))
        //console.log(window.location.protocol + "//" + window.location.hostname + ":5000/playlist/getPlaylist")
        fetch(window.location.protocol + "//" + window.location.hostname  + (this.state.usePort ? ":" + this.state.port : "") + "/playlist/display?playlist=" + newPlaylist, {
            method: 'GET'
        })
            .then(response => response.json())
            .then(data => {
                this.setState({playlistSongList: data.songList})
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    setActiveIndex = (newIndex) => {
        this.setState({activeIndex: newIndex})
        console.log("setting new active index at: " + newIndex)
    }

    addToPlaylist = async (newSong, playlist) => {
        console.log(window.location.protocol + "//" + window.location.hostname  + (this.state.usePort ? ":" + this.state.port : "") + "/playlist/add?toAdd=" +
            newSong + "&playlist=" + playlist._id)
        await this.makeRequest(newSong, playlist)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.makeSearch(undefined, "/song", "songList", undefined)
                this.makeSearch(undefined, "/playlist", "playlist", undefined)
            })
            .catch(function (error) {
                console.log(error)
            })
    }


    makeRequest = (newSong, playlist) => {
        return fetch(window.location.protocol + "//" + window.location.hostname  + (this.state.usePort ? ":" + this.state.port : "") + "/playlist/addSong?toAdd=" +
            newSong + "&playlist=" + playlist._id, {
            method: 'PATCH'
        });
    }

    addPlaylist = async (newPlaylist) => {
        await this.makeNewPlaylist(newPlaylist)
            .then(response => response.json())
            .then(data => {
                this.makeSearch(undefined, "/playlist", "playlist", undefined)
                console.log(data)
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    makeNewPlaylist = (newPlaylist) => {
        return fetch(window.location.protocol + "//" + window.location.hostname  + (this.state.usePort ? ":" + this.state.port : "") + "/playlist/addPlaylist?playlistName=" + newPlaylist, {
            method: 'POST'
        });
    }

    deleteSong = (songID, fileID) => {
        let url = new URL(window.location.protocol + "//" + window.location.hostname + (this.state.usePort ? ":" + this.state.port : ""))
        url.searchParams.append("songID", songID)
        url.searchParams.append("fileID", fileID)
        console.log(window.location.protocol + "//" + window.location.hostname  + (this.state.usePort ? ":" + this.state.port : "") + "?songID=" + songID + "&fileID=" + fileID)
        console.log(this.state.port)
        console.log(url)
        fetch(window.location.protocol + "//" + window.location.hostname  + (this.state.usePort ? ":" + this.state.port : "") + "/song/?songID=" + songID + "&fileID=" + fileID, {
            method: "DELETE"
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.makeSearch(undefined, "/song", "songList", undefined)
                this.makeSearch(undefined, "/playlist", "playlist", undefined)

            })
    }

    deletePlaylist = (playlistID) => {
        fetch(window.location.protocol + "//" + window.location.hostname  + (this.state.usePort ? ":" + this.state.port : "") + "/playlist?playlistID=" + playlistID, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.makeSearch(undefined, "/playlist", "playlist", undefined)
            })
    }

    removeFromPlaylist = (songID) => {
        fetch(window.location.protocol + "//" + window.location.hostname + (this.state.usePort ? ":" + this.state.port : "") + "/playlist/display?songID=" + songID +"&playlistID=" + this.state.curPlaylist, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.makeSearch(undefined, "/playlist", "playlist", undefined)
                this.setSelectedPlaylist(this.state.curPlaylist)
            })
    }

    handleChange = (isPlaylist, toChange) => {

    }

    render() {
        console.log(this.state)
        return (
            <Box className="App" sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: "100vh"
            }
            }>
                <CssBaseline/>
                <TopBar pageName={this.state.curPage} handleNewSearch={this.setNewSearch}/>
                <SideBar onCurPageChange={this.setCurPage}/>
                <Routes>
                    <Route exact path="/" element={<SongDisplay songList={this.state.songList}
                                            onCurSongChange={this.setParentCurSong}
                                            onActiveIndexChange={this.setActiveIndex}
                                            playlists={this.state.playlistList}
                                            onSongAdd={this.addToPlaylist}
                                            makeSearch={this.makeSearch} deleteSong={this.deleteSong}/>}/>
                    <Route exact path="Upload" element={<Upload handleAddedSong={this.setNewSearch} curSongs={this.state.songList}
                                             usePort={this.state.usePort} port={this.state.port}/>}/>
                    <Route exact path="PlaylistUpload" element={<PlaylistUpload onPlaylistAdd={this.addPlaylist}
                                                             curPlaylists={this.state.playlistList}/>}/>
                    <Route exact path="PlaylistDisplay" element={<PlaylistDisplay selectedPlaylist={this.state.selectedPlaylist}
                                                               playlistList={this.state.playlistList}
                                                               onPlaylistSelect={this.setSelectedPlaylist}
                                                               deletePlaylist={this.deletePlaylist}
                                                               handleChange={this.handleChange}/>}/>
                    <Route exact path="PlaylistDisplay/Playlist" element={<SongDisplay songList={this.state.playlistSongList}
                                                                    onCurSongChange={this.setParentCurSong}
                                                                    onActiveIndexChange={this.setActiveIndex}
                                                                    removeFromPlaylist={this.removeFromPlaylist}
                                                                    deleteSong={this.deleteSong}/>}/>
                    <Route exact path="Settings" element={<Settings/>}/>

                </Routes>
                <ProgressBar songList={this.state.songList} curSong={this.state.curSong}
                             onActiveIndexChange={this.setActiveIndex} usePort={this.state.usePort} port={this.state.port}/>
            </Box>
        )
    }
}