import React, { useState, useEffect, useRef } from "react"
import Paper from "@mui/material/Paper"
import { Grid, Box } from "@mui/material"
import PlaybackControl from "./PlaybackControl"
import AudioElement from "./AudioElement"
import CurrentStatus from "./CurrentStatus"

export default function ProgressBar(props) {
	const [isPlay, setIsPlay] = useState(false)
	const [audioSrc, setAudioSrc] = useState(undefined)
	const [volume, setVolume] = useState(20)
	const [curSong, setCurSong] = useState(props.curSong)

	const audioRef = useRef()

	let curSongIndex = useRef(undefined)
	let usePort = true
	let port = 5000

	useEffect(() => {
		if (props.curSong) {
			setAudioSrc(
				window.location.protocol +
					"//" +
					window.location.hostname +
					(usePort ? ":" + port : "") +
					"/audio/" +
					props.curSong.fileID
			)
			setIsPlay(true)
			setCurSong(props.curSong)
		}
		console.log(props)
	}, [props.curSong])

	useEffect(() => {
		console.log(curSong)
		if(curSong) {
			findSongIndex()
			console.log("WE ARE IN THE RIGHT USE EFFECT")
			setAudioSrc(window.location.protocol + "//" + window.location.hostname + (usePort ? ":" + port + "" : "") + "/audio/" + curSong.fileID)
		}
	}, [curSong])

	const findSongIndex = () => {
		curSongIndex.current = props.songList.findIndex(song => song._id === curSong._id)
		console.log("FOUND IT AT INDEX: " + curSongIndex.current)
	}

	const nextSong = () => {
		if(props.curSong) {
			console.log("in nextSong")
			curSongIndex.current++
			console.log(curSongIndex.curent)
			setSong()
		}
	}

	const previousSong = () => {
		console.log(curSongIndex.current)
		if(props.curSong && curSongIndex.current-1 >= 0) {
			console.log("in prev song")
			curSongIndex.current--
			console.log(curSongIndex.current)
			setSong()
		}
	} 

	const setSong = () => {
		console.log(props.songList[curSongIndex.current])
		console.log(props.songList)
		setCurSong(props.songList[curSongIndex.current])
	}

	const handlePlayToggle = () => {
		setIsPlay(!isPlay)
		if(audioRef.current.paused) {
			audioRef.current.play()
		}
		else {
			audioRef.current.pause()
		}
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
						<CurrentStatus curSong={curSong} />
					</Grid>
					<PlaybackControl
						isPlay={isPlay}
						audioSrc={audioSrc}
						volume={volume}
						handlePlayToggle={() => handlePlayToggle()}
						nextSong={() => nextSong()}
						previousSong={() => previousSong()}
					/>
				</Grid>
			</Paper>
			<AudioElement audioSrc={audioSrc} audioRef={audioRef} />
		</Box>
	)
}
