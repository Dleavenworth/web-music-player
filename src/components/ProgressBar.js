import {BottomNavigation, BottomNavigationAction, Box, Grid, Slider, Typography,} from "@mui/material";
import Paper from "@mui/material/Paper";
import React, {Component} from "react";
import {
    Repeat,
    RepeatOn,
    ShuffleOn,
    SkipPrevious,
    PlayArrow,
    SkipNext,
    Pause,
    Shuffle,
    VolumeDown,
    VolumeUp
} from "@mui/icons-material";

export default class ProgressBar extends Component {
    constructor(props) {
        super(props)
        console.log(props)
        this.state = {
            isPlay: false,
            audioSrc: undefined,
            curSong: undefined,
            songList: [],
            curSongIndex: undefined,
            progress: 0,
            seeking: false,
            shuffle: false,
            repeat: false,
            interval: undefined,
            volumeSlider: 20,
            shuffleList: [],
            curShuffleIndex: 0,
            activeIndex: this.props.activeIndex,
            port: this.props.port,
            usePort: this.props.usePort
        }
        this.audioRef = React.createRef()
    }

    toggle = () => {
        if (this.state.isPlay && this.state.audioSrc != null) {
            this.audioRef.current.pause()
        } else if (this.state.audioSrc != null) {
            this.audioRef.current.play()
        }
        this.setState({isPlay: !this.state.isPlay})
    }


    startInterval = () => {
        this.setState({interval: setInterval(this.updateProgress, 100)})
    }

    updateProgress = () => {
        if (this.state.isPlay && !this.state.seeking) {
            let newTime = this.audioRef.current.currentTime
            let newProgress = Math.round((newTime / this.audioRef.current.duration) * 100)
            if (!isNaN(newProgress)) {
                this.setState({progress: newProgress})
            }
        }
    }

    handleSeek = (event, newValue) => {
        if (this.state.audioSrc) {
            this.setState({progress: newValue})
            let newTime = Math.round((newValue * this.audioRef.current.duration) / 100)
            this.audioRef.current.currentTime = parseFloat(String(newTime))
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.curSong !== this.props.curSong) {
            this.setState({
                audioSrc: window.location.protocol + "//" + window.location.hostname + (this.state.usePort ? ":" + this.state.port : "") +
                    "/audio/" + this.props.curSong.fileID,
                curSong: this.props.curSong,
                activeIndex: this.props.activeIndex
            })
            //this.setState({curSong: this.props.curSong})
            if (!this.state.isPlay) {
                this.toggle()
            }
            this.setState({songList: this.props.songList}, () => this.setCurIndex())
        }
    }

    setCurIndex = () => {
        console.log(this.state)
        for (let i = 0; i < this.state.songList.length; i++) {
            console.log(this.state.songList)
            console.log(this.state.curSong)
            if (this.state.songList[i]._id === this.state.curSong.id) {
                this.props.onActiveIndexChange(i)
                console.log("did find it at index " + i)
                this.setState({curSongIndex: i, activeIndex: i})
                if (this.state.shuffle && this.state.shuffleList[this.state.shuffleList.length - 1] !== i) {
                    this.state.shuffleList.push(i)
                    this.setState({curShuffleIndex: this.state.shuffleList.length - 1})
                }
                return;
            }
            console.log("did not find it")
        }
    }

    previousSong = () => {
        let previousSongIndex
        console.log("calling previous")
        if (this.state.curSong !== undefined) {
            this.setState({progress: 0})
            this.audioRef.current.volume = this.state.volumeSlider / 100
            console.log("curSong is not undefined")
            if (this.state.shuffle) {
                if (this.state.curShuffleIndex - 1 >= 0) {
                    console.log("inside of the if")
                    this.setState({curShuffleIndex: this.state.curShuffleIndex - 1}, () => {
                        previousSongIndex = this.state.shuffleList[this.state.curShuffleIndex]
                        console.log("previous song index inside of of: " + previousSongIndex)
                        this.setPreviousSong(previousSongIndex);
                    })
                } else {
                    return
                }
            } else {
                previousSongIndex = this.state.curSongIndex - 1;
                this.setPreviousSong(previousSongIndex);
            }

            //console.log("the used previous song index is: " + previousSongIndex + " of type " + typeof(previousSongIndex))
            //console.log("state view after if " + this.state.curShuffleIndex)

        }
        console.log("curSong is undefined")
    }

    setPreviousSong(previousSongIndex) {
        console.log("the song index used in the function is " + previousSongIndex)
        if (previousSongIndex >= 0) {
            this.setState({
                curSong: this.state.songList[previousSongIndex],
                audioSrc: window.location.protocol + "//" + window.location.hostname + (this.state.usePort ? ":" + this.state.port : "") + "/audio/" +
                    this.state.songList[previousSongIndex].fileID,
                curSongIndex: previousSongIndex
            })
            if (!this.state.isPlay) {
                this.toggle()
            }
        }
    }

    nextSong = () => {
        console.log("calling next")
        if (this.state.curSong !== undefined) {
            if (this.state.repeat) {
                this.toggleRepeat()
            }
            this.setState({progress: 0})
            clearInterval(this.state.interval)
            this.audioRef.current.volume = this.state.volumeSlider / 100
            if (!this.state.shuffle) {
                this.nextShuffleOff();
            } else {
                this.nextShuffleOn();


            }
            if (!this.state.isPlay) {
                this.toggle()
            }
        }
        console.log("curSong is undefined")
    }

    nextShuffleOn = () => {
        let nextSongIndex
        console.log("we are in the shuffle next part")
        this.setState({curShuffleIndex: this.state.curShuffleIndex + 1}, () => {
            console.log(this.state.curShuffleIndex)
            console.log(this.state.shuffleList.length)
            console.log(nextSongIndex)
            if (this.state.curShuffleIndex > this.state.shuffleList.length - 1) {
                nextSongIndex = Math.round(Math.random() * (this.state.songList.length - 1))

                while (nextSongIndex === this.state.curSongIndex) {
                    nextSongIndex = Math.round(Math.random() * (this.state.songList.length - 1))
                }
                this.state.shuffleList.push(nextSongIndex)
            } else {
                console.log("in the else")
                nextSongIndex = this.state.shuffleList[this.state.curShuffleIndex]
            }

            this.setNextSong(nextSongIndex);
            console.log(this.state.songList.length)
            console.log(nextSongIndex)
        })
    }

    setNextSong = (nextSongIndex) => {
        console.log("Next song index" + nextSongIndex)
        this.setState({
            curSong: this.state.songList[nextSongIndex],
            audioSrc: window.location.protocol + "//" + window.location.hostname  + (this.state.usePort ? ":" + this.state.port : "") + "/audio/" +
                this.state.songList[nextSongIndex].fileID,
            curSongIndex: nextSongIndex
        })
    }

    nextShuffleOff = () => {
        console.log("we are in not shuffle next part")
        const nextSongIndex = this.state.curSongIndex + 1;
        if (nextSongIndex <= this.state.songList.length - 1) {
            this.setNextSong(nextSongIndex)
        }
    }

    repeatSong = () => {
        this.audioRef.current.currentTime = 0
        this.audioRef.current.play()
    }

    toggleSeeking = () => {
        if (this.state.audioSrc) {
            this.setState({seeking: !this.state.seeking})
            this.toggle()
        }
    }

    toggleShuffle = () => {
        if (this.state.repeat) {
            this.toggleRepeat()
        }
        if (this.state.shuffle) {
            this.setState({shuffle: false, shuffleList: [], curShuffleIndex: 0})
        } else if (this.state.curSongIndex !== undefined) {
            this.state.shuffleList.push(this.state.curSongIndex)
            this.setState({
                shuffle: true,
                curShuffleIndex: this.state.curShuffleIndex + 1
            })
        }
    }

    toggleRepeat = () => {
        if (this.state.shuffle) {
            this.toggleShuffle()
        }
        this.setState({repeat: !this.state.repeat})
    }

    handleVolumeChange = (event, newValue) => {
        this.setState({volumeSlider: newValue}, () => console.log(this.state.volumeSlider))
        this.audioRef.current.volume = newValue / 100
    }

    render() {
        console.log(this.state)
        return (
            <Box className="footer" sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                bottom: 0,
                left: 0,
                width: "100vw",
                position: "relative",
            }}>
                <Paper elevation={3}>
                    <Grid container spacing={1}>
                        <Grid item xs={4}>
                            <Typography variant="body1" sx={{textAlign: "left"}}>
                                {this.state.curSong !== undefined ? this.state.curSong.name + " by " +
                                    this.state.curSong.artist : "No song currently playing"}
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <BottomNavigation>
                                <BottomNavigationAction label="Shuffle"
                                                        icon={!this.state.shuffle ? <Shuffle/> : <ShuffleOn/>}
                                                        onClick={this.toggleShuffle}/>
                                <BottomNavigationAction label="Previous" icon={<SkipPrevious/>}
                                                        onClick={this.previousSong}/>
                                <BottomNavigationAction label="Play"
                                                        icon={(this.state.isPlay && this.state.audioSrc != null) ?
                                                            <Pause/> : <PlayArrow/>} onClick={this.toggle}/>
                                <BottomNavigationAction label="Next" icon={<SkipNext/>} onClick={this.nextSong}/>
                                <BottomNavigationAction label="Loop" icon={!this.state.repeat ? <Repeat/> : <RepeatOn/>}
                                                        onClick={this.toggleRepeat}/>
                            </BottomNavigation>
                        </Grid>
                        <Grid container justifyContent={"flex-end"}>
                            <Grid item xs={1}>
                                <VolumeDown/>
                            </Grid>
                            <Grid item xs={2}>
                                <Slider aria-label="Volume"
                                        value={this.state.volumeSlider} onChange={this.handleVolumeChange}/>
                            </Grid>
                            <Grid item xs={1}>
                                <VolumeUp/>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Slider aria-label="Progress" sx={{width: "98vw"}} value={this.state.progress}
                                    onChange={this.handleSeek}
                                    onMouseDown={this.toggleSeeking}
                                    onMouseUp={this.toggleSeeking}/>
                        </Grid>
                    </Grid>

                </Paper>
                <audio src={this.state.audioSrc} ref={this.audioRef} autoPlay
                       onEnded={this.state.repeat ? this.repeatSong : this.nextSong}
                       onPlay={this.startInterval}>
                    Your browser does not support the audio element
                </audio>
            </Box>
        )
    }
}