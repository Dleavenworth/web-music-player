import {useEffect, useRef} from "react"

const usePrevious = (value) => {
	const ref = useRef()

	useEffect(() => {
		ref.current = value
	}, [value])

	return ref.current
}

export default function useEffectAllDepsChange(fn, deps) {
	const prevDeps = usePrevious(deps)
	const changeTarget = useRef()

	useEffect(() => {
		if (changeTarget.current == undefined) {
			changeTarget.current = prevDeps
		}

		if (changeTarget.current == undefined) {
			return fn()
		}

		if (changeTarget.current.every((dep, i) => dep !== deps[i])) {
			changeTarget.current = deps

			return fn()
		}
	}, [fn, prevDeps, deps])
}