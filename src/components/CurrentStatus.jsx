import React from "react"
import { Typography } from "@mui/material"

export default function CurrentStatus(props) {

	let { curSong } = props
	
	return (
		<Typography variant="body1" sx={{ textAlign: "left" }}>
			{curSong !== undefined
				? curSong.name + " by " + curSong.artist
				: "No song currently playing"}
		</Typography>
	)
}