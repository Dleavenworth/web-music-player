import React, { useState, useEffect, useRef} from "react"
import { alpha, AppBar, createTheme, InputBase, Toolbar, Typography } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import styled from "@emotion/styled"
import { ThemeProvider } from "@emotion/react"
import PropTypes from "prop-types"

const theme = createTheme({})

const Search = styled("div")(({theme}) => ({
	position: "relative",
	borderRadius: theme.shape.borderRadius,
	backgroundColor: alpha(theme.palette.common.white, 0.15),
	"&:hover": {
		backgroundColor: alpha(theme.palette.common.white, 0.25),
	},
	marginRight: theme.spacing(2),
	marginLeft: 0,
	width: "100%",
	[theme.breakpoints.up("sm")]: {
		marginLeft: theme.spacing(3),
		width: "auto",
	},
}))

const SearchIconWrapper = styled("div")(({theme}) => ({
	padding: theme.spacing(0, 2),
	height: "100%",
	position: "absolute",
	pointerEvents: "none",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
}))

const StyledInputBase = styled(InputBase)(({theme}) => ({
	color: "inherit",
	"& .MuiInputBase-input": {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
		transition: theme.transitions.create("width"),
		width: "100%",
		[theme.breakpoints.up("md")]: {
			width: "20ch",
		},
	},
}))

export default function TopBar(props) {
	const [pageName, setPageName] = useState(props.pageName)

	const inputRef = useRef()

	useEffect(() => {
		setPageName(props.pageName)
		inputRef.current.value = ""
		props.handleNewSearch(undefined, "/song", "songList")
		props.handleNewSearch(undefined, "/playlist", "playlist")
		if(window.location.pathname === "/PlaylistDisplay/Playlist") {
			props.handleNewSearch(undefined, "/playlist/display", "playlistList")
		}
	}, [props.pageName])

	const newSearch = (newSearch) => {
		let stateVar
		let pathname = window.location.pathname
		console.log("pre-logic " + pathname)
		if(pathname === "/PlaylistDisplay") {
			pathname = "/playlist"
			stateVar = "playlist"
		}
		else if(pathname === "/PlaylistDisplay/Playlist") {
			pathname = "/playlist/display"
			stateVar = "playlistList"
		}
		else {
			pathname = "/song"
			stateVar = "songList"
		}
		console.log("statevar " + stateVar)
		console.log("pathname" + pathname)
		props.handleNewSearch(newSearch.target.value, pathname, stateVar)
	}

	return (
		<ThemeProvider theme={theme}>
			<AppBar position="fixed" sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}>
				<Toolbar>
					<Typography variant="h6" noWrap component="div">
						{pageName}
					</Typography>
					<Search>
						<SearchIconWrapper>
							<SearchIcon/>
						</SearchIconWrapper>
						<StyledInputBase
							inputRef={inputRef}
							placeholder="Search…"
							defaultValue={""}
							inputProps={{"aria-label": "search"}}
							onChange={newSearch}
						/>
					</Search>
				</Toolbar>
			</AppBar>
		</ThemeProvider>
	)
}

TopBar.propTypes = {
	pageName: PropTypes.string,
	handleNewSearch: PropTypes.func
}