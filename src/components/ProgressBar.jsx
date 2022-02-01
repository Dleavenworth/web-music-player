import {
	BottomNavigation,
	BottomNavigationAction,
	Box,
	Grid,
	Slider,
	Stack,
	Typography,
} from "@mui/material"
import Paper from "@mui/material/Paper"
import React, { useState, useEffect, useRef } from "react"
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
	VolumeUp,
} from "@mui/icons-material"
import PropTypes from "prop-types"
import useEffectAllDepsChange from "./../util/useEffectAllDepsChange"

/**
 * @todo Hitting next when you are shuffling does not work 
 */

export default function ProgressBar(props) {
	const [isPlay, setIsPlay] = useState(false)
	const [audioSrc, setAudioSrc] = useState("")
	const [curSong, setCurSong] = useState(props.curSong)
	const [songList, setSongList] = useState(props.songList)
	const [curSongIndex, setCurSongIndex] = useState(undefined)
	const [progress, setProgress] = useState(0)
	const [seeking, setSeeking] = useState(false)
	const [shuffle, setShuffle] = useState(false)
	const [repeat, setRepeat] = useState(false)
	const [interval, setInter] = useState(undefined)
	const [volumeSlider, setVolumeSlider] = useState(20)
	const [shuffleList, setShuffleList] = useState([])
	const [curShuffleIndex, setCurShuffleIndex] = useState(0)
	const [activeIndex, setActiveIndex] = useState(props.activeIndex)
	const [lastOp, setLastOp] = useState(undefined)

	const audioRef = useRef()

	const port = props.port
	const usePort = props.usePort
	const PLUS = "+"
	const MINUS = "-"

	useEffectAllDepsChange(() => {
		shuffleSong(lastOp)
		setLastOp(undefined)
		console.log("both deps change")
		//The problem is that lastOp is resset here(I think) so we need to figure out another way to run shuffleSong() when the next button is pressed
	}, [curShuffleIndex, lastOp])
	
	useEffect(() => {
		setSongList(props.songList)
	}, [props.songList])

	useEffect(() => {
		console.log(props)
		if (props.curSong) {
			console.log(props.curSong.fileID)
			setAudioSrc(
				window.location.protocol +
					"//" +
					window.location.hostname +
					(usePort ? ":" + port : "") +
					"/audio/" +
					props.curSong.fileID
			)
			setCurSong(props.curSong)
			setActiveIndex(props.activeIndex)

			if (!isPlay) {
				toggle()
			}
		}
	}, [props.curSong])

	useEffectAllDepsChange(() => {
		console.log("curSong updated")
		console.log(curSong)
		setCurIndex()
	}, [curSong])

	useEffect(() => {
		if (songList && curSong) {
			console.log("setting curIndex")
			setCurIndex()
		}
	}, [songList])

	/*useEffect(() => {
		console.log("did change curShuffleIndex")
		console.log(lastOp)
		console.log(curShuffleIndex)
		console.log(curSong)
		if (lastOp === "-") {
			console.log("minus")
			let previousSongIndex = shuffleList[curShuffleIndex]
			console.log("previous song index inside of of: " + previousSongIndex)
			setPreviousSong(previousSongIndex)
		} else if (lastOp === "+") {
			console.log("plus")
			let nextSongIndex
			if (curShuffleIndex > shuffleList.length - 1) {
				nextSongIndex = Math.round(Math.random() * (songList.length - 1))

				while (nextSongIndex === curSongIndex) {
					nextSongIndex = Math.round(Math.random() * (songList.length - 1))
				}
				shuffleList.push(nextSongIndex)
			} else {
				console.log("in the else")
				nextSongIndex = shuffleList[curShuffleIndex]
			}

			setNextSong(nextSongIndex)
		}
		console.log("calling shuffle song")
		shuffleSong()
	}, [curShuffleIndex])*/

	const shuffleSong = (useOp) => {
		console.log("did change curShuffleIndex and lastOp")
		console.log(lastOp)
		console.log(curShuffleIndex)
		console.log(curSong)
		console.log(shuffleList)
		if (useOp === MINUS) {
			console.log("minus")
			let previousSongIndex = shuffleList[curShuffleIndex]
			console.log("previous song index inside of of: " + previousSongIndex)
			setPreviousSong(previousSongIndex)
		} else if (useOp === PLUS) {
			console.log("plus")
			let nextSongIndex
			if (curShuffleIndex > shuffleList.length - 1) {
				nextSongIndex = Math.round(Math.random() * (songList.length - 1))

				while (nextSongIndex === curSongIndex) {
					nextSongIndex = Math.round(Math.random() * (songList.length - 1))
				}
				shuffleList.push(nextSongIndex)
			} else {
				console.log("in the else")
				nextSongIndex = shuffleList[curShuffleIndex]
			}

			setNextSong(nextSongIndex)
		}
	}

	const toggle = () => {
		if (isPlay && audioSrc != null) {
			audioRef.current.pause()
		} else if (audioSrc != null) {
			audioRef.current.play()
				.then(() => {
					console.log("playing")
				})
				.catch((err) => {
					console.log(err)
					return
				})
		}
		setIsPlay(!isPlay)
	}

	const startInterval = () => {
		setInter(setInterval(updateProgress, 100))
	}

	const updateProgress = () => {
		if (isPlay && !seeking) {
			let newTime = audioRef.current.currentTime
			let newProgress = Math.round((newTime / audioRef.current.duration) * 100)
			if (!isNaN(newProgress)) {
				setProgress(newProgress)
			}
		}
	}

	const handleSeek = (event, newValue) => {
		if (audioSrc) {
			setProgress(newValue)
			let newTime = Math.round((newValue * audioRef.current.duration) / 100)
			audioRef.current.currentTime = parseFloat(String(newTime))
		}
	}

	const setCurIndex = () => {
		console.log(songList)
		console.log(curSong)
		let index = songList.findIndex((element) => element._id === curSong._id)
		if(index >= 0) {
			props.onActiveIndexChange(index)
			console.log("did find it at index " + index)
			setCurSongIndex(index)
			setActiveIndex(index)
			if (shuffle && shuffleList[shuffleList.length - 1] !== index) {
				shuffleList.push(index)
				setCurShuffleIndex(shuffleList.length - 1)
			}
		}
		else {
			console.log("did not find the songID in songList with index " + index)
		}
	}

	const previousSong = () => {
		console.log("calling previous")
		if (curSong !== undefined) {
			setProgress(0)
			audioRef.current.volume = volumeSlider / 100
			console.log("curSong is not undefined")
			if (shuffle) {
				if (curShuffleIndex - 1 >= 0) {
					console.log("inside of the if")
					setLastOp(MINUS)
					setCurShuffleIndex(curShuffleIndex - 1)
				} else {
					return
				}
			} else {
				console.log(curSongIndex)
				let previousSongIndex = curSongIndex - 1
				setPreviousSong(previousSongIndex)
			}

			//console.log("the used previous song index is: " + previousSongIndex + " of type " + typeof(previousSongIndex))
			//console.log("state view after if " + this.state.curShuffleIndex)
		}
		console.log("curSong is undefined")
	}

	const setPreviousSong = (previousSongIndex) => {
		console.log("the song index used in the function is " + previousSongIndex)
		if (previousSongIndex >= 0) {
			setCurSong(songList[previousSongIndex])
			setAudioSrc(
				window.location.protocol +
					"//" +
					window.location.hostname +
					(usePort ? ":" + port : "") +
					"/audio/" +
					songList[previousSongIndex].fileID
			)
			setCurSongIndex(previousSongIndex)
			if (!isPlay) {
				toggle()
			}
		}
	}

	const nextSong = () => {
		console.log("calling next")
		console.log(curSong)
		if (curSong !== undefined) {
			if (repeat) {
				toggleRepeat()
			}
			setProgress(0)
			clearInterval(interval)
			audioRef.current.volume = volumeSlider / 100
			if (!shuffle) {
				nextShuffleOff()
			} else {
				nextShuffleOn()
			}
			if (!isPlay) {
				toggle()
			}
		}
		else {
			console.log("curSong is undefined")
		}
	}

	const nextShuffleOn = () => {
		console.log("we are in the shuffle next part")
		setLastOp(PLUS)
		setCurShuffleIndex(curShuffleIndex + 1)
	}

	const setNextSong = (nextSongIndex) => {
		console.log("SET THE NEXT SONG ???")
		console.log("Next song index" + nextSongIndex)
		console.log("curSong index " + curSongIndex)
		console.log(songList[nextSongIndex])
		setCurSong(songList[nextSongIndex])
		setAudioSrc(
			window.location.protocol +
				"//" +
				window.location.hostname +
				(usePort ? ":" + port : "") +
				"/audio/" +
				songList[nextSongIndex].fileID
		)
		setCurSongIndex(nextSongIndex)
	}

	const nextShuffleOff = () => {
		console.log("we are in not shuffle next part")
		const nextSongIndex = curSongIndex + 1
		console.log(curSongIndex)
		console.log(nextSongIndex)
		if (nextSongIndex <= songList.length - 1) {
			setNextSong(nextSongIndex)
		}
	}

	const repeatSong = () => {
		audioRef.current.currentTime = 0
		audioRef.current.play()
	}

	const toggleSeeking = () => {
		if (audioSrc) {
			setSeeking(!seeking)
			toggle()
		}
	}

	const toggleShuffle = () => {
		console.log("toggling")
		console.log(shuffle)
		console.log(curSongIndex)
		if (repeat) {
			toggleRepeat()
		}
		if (shuffle) {
			console.log("toggle shuffle false")
			setShuffle(false)
			setShuffleList([])
			setCurShuffleIndex(0)
			//setLastOp(undefined)
		} else if (curSong) {
			console.log("toggle shuffle true")
			shuffleList.push(curSongIndex)
			setShuffle(true)
			//lastOp = undefined
			//setCurShuffleIndex(curShuffleIndex+1)
		}
	}

	const toggleRepeat = () => {
		if (shuffle) {
			toggleShuffle()
		}
		setRepeat(!repeat)
	}

	const handleVolumeChange = (event, newValue) => {
		setVolumeSlider(newValue)
		audioRef.current.volume = newValue / 100
	}

	return (
		<Box
			className="footer"
			sx={{
				zIndex: (theme) => theme.zIndex.drawer + 1,
				bottom: 0,
				left: 0,
				width: "100vw",
				position: "relative",
			}}
		>
			<Paper elevation={3}>
				<Grid container spacing={1}>
					<Grid item xs={4}>
						<Typography variant="body1" sx={{ textAlign: "left" }}>
							{curSong !== undefined
								? curSong.name + " by " + curSong.artist
								: "No song currently playing"}
						</Typography>
					</Grid>
					<Grid item xs={4}>
						<BottomNavigation>
							<BottomNavigationAction
								label="Shuffle"
								icon={!shuffle ? <Shuffle /> : <ShuffleOn />}
								onClick={() => toggleShuffle()}
							/>
							<BottomNavigationAction
								label="Previous"
								icon={<SkipPrevious />}
								onClick={() => previousSong()}
							/>
							<BottomNavigationAction
								label="Play"
								icon={isPlay && audioSrc != null ? <Pause /> : <PlayArrow />}
								onClick={() => toggle()}
							/>
							<BottomNavigationAction
								label="Next"
								icon={<SkipNext />}
								onClick={() => nextSong()}
							/>
							<BottomNavigationAction
								label="Loop"
								icon={!repeat ? <Repeat /> : <RepeatOn />}
								onClick={() => toggleRepeat()}
							/>
						</BottomNavigation>
					</Grid>
					<Grid item>
						<Stack direction="row">
							<VolumeDown sx={{ mr: 5 }} />
							<Slider
								sx={{ width: "25vw" }}
								aria-label="Volume"
								value={volumeSlider}
								onChange={(e, newValue) => handleVolumeChange(e, newValue)}
							/>
							<VolumeUp sx={{ ml: 5 }} />
						</Stack>
					</Grid>
					<Grid item xs={12}>
						<Slider
							aria-label="Progress"
							sx={{ ml: "1vw", width: "98vw" }}
							value={progress}
							onChange={(e, newValue) => handleSeek(e, newValue)}
							onMouseDown={() => toggleSeeking()}
							onMouseUp={() => toggleSeeking()}
						/>
					</Grid>
				</Grid>
			</Paper>
			<audio
				src={audioSrc}
				ref={audioRef}
				autoPlay
				onEnded={repeat ? repeatSong : nextSong}
				onPlay={() => startInterval()}
				crossOrigin="anonymous"
			>
				Your browser does not support the audio element
			</audio>
		</Box>
	)
}

ProgressBar.propTypes = {
	curSong: PropTypes.object,
	activeIndex: PropTypes.number,
	port: PropTypes.string,
	usePort: PropTypes.bool,
	songList: PropTypes.array,
	onActiveIndexChange: PropTypes.func
}