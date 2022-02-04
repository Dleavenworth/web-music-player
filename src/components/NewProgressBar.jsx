import React, { useState, useEffect } from "react"
import Paper from "@mui/material/Paper"
import { Grid, Box } from "@mui/material"
import PlaybackControl from "./PlaybackControl"
import AudioElement from "./AudioElement"
import CurrentStatus from "./CurrentStatus"

export default function ProgressBar(props) {
	const [isPlay, setIsPlay] = useState(false)
	const [audioSrc, setAudioSrc] = useState(undefined)
	const [volume, setVolume] = useState(20)
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
		}
		console.log(props)
	}, [props.curSong])

	const handlePlayToggle = () => {
		setIsPlay(!isPlay)
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
			<AudioElement audioSrc={audioSrc} audioRef={props.audioRef} />
		</Box>
	)
}
