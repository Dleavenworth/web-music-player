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
	const [songList, setSongList] = useState(props.songList)

	const audioRef = useRef()

	let curSongIndex = undefined
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
		}
		console.log(props)
	}, [props.curSong])

	const nextSong = () => {
		if(props.curSong) {
		curSongIndex++
		setNextSong()
		}
	}

	const setNextSong = () => {
		setAudioSrc(window.location.protocol + "//" + window.location.hostname + (usePort ? ":" + port + "" ) + "/audio/" + props.curSong.fileID)
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
						<CurrentStatus curSong={props.curSong} />
					</Grid>
					<PlaybackControl
						isPlay={isPlay}
						audioSrc={audioSrc}
						volume={volume}
						handlePlayToggle={() => handlePlayToggle()}
					/>
				</Grid>
			</Paper>
			<AudioElement audioSrc={audioSrc} audioRef={audioRef} />
		</Box>
	)
}
