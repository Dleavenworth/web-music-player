import React from "react"

export default function AudioElement(props) {

	let { audioSrc, audioRef, repeat } = props

	const startInterval = () => {
		props.startInterval()
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
			ref={audioRef}
			autoPlay
			onEnded={repeat ? repeatSong : nextSong}
			onPlay={() => startInterval()}
			crossOrigin="anonymous"
		>
				Your browser does not support the audio element
		</audio>
	)
}