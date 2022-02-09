import React, { useRef } from "react"

export default function AudioElement(props) {

	let { audioSrc, repeat } = props

	const startInterval = () => {
	}

	const repeatSong = () => {
		props.repeatSong()
	}	

	const nextSong = () => {
		props.nextSong()
	}
 
	return (
		<audio
			src={audioSrc}
			ref={props.audioRef}
			autoPlay
			onEnded={repeat ? repeatSong : nextSong}
			onPlay={() => startInterval()}
			crossOrigin="anonymous"
		>
				Your browser does not support the audio element
		</audio>
	)
}