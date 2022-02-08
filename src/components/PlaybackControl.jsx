import React, { useEffect, useState } from "react"
import { Grid, BottomNavigation, BottomNavigationAction, Stack, Slider } from "@mui/material"
import {
	Shuffle,
	ShuffleOn,
	Repeat,
	RepeatOn,
	Pause,
	PlayArrow,
	SkipPrevious,
	SkipNext,
	VolumeDown,
	VolumeUp
} from "@mui/icons-material"

export default function PlayBackControl(props) {

	let { isPlay, audioSrc, volume } = props
	const [repeat, setRepeat] = useState(false)
	const [shuffle, setShuffle] = useState(false)


	let curSongIndex = undefined
	let seek = false
	let progress = 0

	const previousSong = () => {
		props.previousSong()
	}

	const togglePlay = () => {
		props.handlePlayToggle()
	}

	const nextSong = () => {
		props.nextSong()
	}

	const handleVolumeChange = (e, newValue) => {
		props.handleVolumeChange(e, newValue)
	}

	const handleSeek = (e, newValue) => {
		props.handleSeek(e, newValue)
	}

	const toggleSeeking = () => {
		seek = !seek
	}

	return (
		<>
			<Grid item xs={4}>
				<BottomNavigation>
					<BottomNavigationAction
						label="Shuffle"
						icon={!shuffle ? <Shuffle /> : <ShuffleOn />}
						onClick={() => setShuffle(!shuffle)}
					/>
					<BottomNavigationAction
						label="Previous"
						icon={<SkipPrevious />}
						onClick={() => previousSong()}
					/>
					<BottomNavigationAction
						label="Play"
						icon={isPlay && audioSrc != null ? <Pause /> : <PlayArrow />}
						onClick={() => togglePlay()}
					/>
					<BottomNavigationAction
						label="Next"
						icon={<SkipNext />}
						onClick={() => nextSong()}
					/>
					<BottomNavigationAction
						label="Loop"
						icon={!repeat ? <Repeat /> : <RepeatOn />}
						onClick={() => setRepeat(!repeat)}
					/>
				</BottomNavigation>
			</Grid>
			<Grid item>
				<Stack direction="row">
					<VolumeDown sx={{ mr: 5 }} />
					<Slider
						sx={{ width: "25vw" }}
						aria-label="Volume"
						value={volume}
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
		</>
	)
}
