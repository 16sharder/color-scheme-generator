// The Loading Page:
// Shown after the user has uploaded an image
// This page displays until the program has analyzed the image colors
// Sends the user to the results page once colors are retrieved

import React from 'react';
import { useEffect } from 'react';
import { useHistory, useLocation } from "react-router-dom"
import retrieve from '../helpers/requests';
import { convertHex } from '../helpers/converters';


function Loading2Page () {
    const history = useHistory()
    const location = useLocation()

    const getColors = async () => {
        // sends retreive colors request to Python Server
        let colors = await retrieve(JSON.stringify(["colors"]), 1952)

        // if no error, retrieves the hsb and hex vals and sends the user on to colors page when ready
        const hsbs = [], hexvals = []
        for (let color of colors) {
            // retrieves the hsb vals from microservice
            const rgb = color.slice()
            rgb.push("r")
            const hsb = await retrieve(JSON.stringify(rgb), 7170)
            hsbs.push(hsb)

            let hex = convertHex(color)
            hexvals.push(hex)
        }

        const current = {hexs: hexvals, rgbs: colors, hsbs: hsbs, idxs: [0, 1, 2, 3, 4, 5]}
        history.push({pathname: "/results", state: {current: current}})
    }

    useEffect(() => {
        getColors()
    }, [])


    return(
        <>
            <h1>Calculating color frequency...</h1>
            <h4>This part should take another {location.state.seconds} seconds</h4>
        </>
    )
}

export default Loading2Page