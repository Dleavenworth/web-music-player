import React, {Component} from 'react'
import {Box, Toolbar} from "@mui/material";

export default class Settings extends Component {
    constructor() {
        super();
        this.state = {
            fileContents: undefined
        }
    }

    componentDidMount() {
        console.log(process.env.REACT_APP_ATLAS_URI)
    }

    render() {
        const drawerWidth = 240
        return (
            <Box className="App"
                 sx={{
                     background: "#f9f9f9",
                     display: 'flex',
                     position: "relative",
                     flexGrow: 1,
                     flexShrink: 0,
                     width: `calc(100% - ${drawerWidth}px)`,
                     ml: `${drawerWidth}px`,
                 }}
            >
                <Toolbar/>
                <p>HAHHAHAHAH</p>
            </Box>
        )
    }
}