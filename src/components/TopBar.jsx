import {alpha, AppBar, createTheme, InputBase, Toolbar, Typography} from "@mui/material"
import React, { Component } from "react"
import SearchIcon from '@mui/icons-material/Search'
import styled from "@emotion/styled"
import {ThemeProvider} from "@emotion/react"

const theme = createTheme({})

const Search = styled('div')(({theme}) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({theme}) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({theme}) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));


export default class TopBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pageName: this.props.pageName
        }
    }

    newSearch = (newSearch) => {
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
        this.props.handleNewSearch(newSearch.target.value, pathname, stateVar)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.pageName !== prevState.pageName) {
            this.setState({pageName: this.props.pageName})
        }
    }

    render() {
        return (
            <ThemeProvider theme={theme}>
                <AppBar position="fixed" sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}>
                    <Toolbar>
                        <Typography variant="h6" noWrap component="div">
                            {this.state.pageName}
                        </Typography>
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon/>
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search…"
                                defaultValue={undefined}
                                inputProps={{'aria-label': 'search'}}
                                onChange={this.newSearch}
                            />
                        </Search>
                    </Toolbar>
                </AppBar>
            </ThemeProvider>
        )
    }
}