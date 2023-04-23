// The Upload Page:
// Shown when the user arrives at the website
// This page allows the user to upload an image for color scheme generation
// Allows the user to access their folders before sending to results page

import React from 'react';
import {useState} from 'react'
import {useHistory} from "react-router-dom"

import { getDirectory, readDirectory, resetFile } from '../requests/requests';

function StartPage () {

    const history = useHistory()

    const [path, setPath] = useState("/")
    const [curdir, setDir] = useState([])
    const [images, setImgs] = useState([])


    const read = async () => {
        const string = await readDirectory()
        const pd = string.split("*,* ")
        resetFile("../textfiles/directory.txt")

        setPath(pd[0])
        const folders = pd[1]
        const imges = pd[2]

        const directory = folders.split(",* ")
        
        const imgs = imges.split(",* ")

        setDir(directory.slice(0, directory.length - 1))
        setImgs(imgs.slice(0, imgs.length - 1))
    }

    getDirectory("/")
    setTimeout(read, 100)

    const send = async (path) => {
        history.push({pathname: "/select1", state: {path: path}})
        window.location.reload()
    }

    const imgSelect = (path) => {
        history.push({pathname: "/upload", state: {path: path}})
        window.location.reload()
    }

    return(
        <>
            <h2>Upload an image to generate a color scheme</h2>
            <table>
                <tbody>
                    <tr>
                        {path.split("/").map((folder, i) => 
                        <td className='folder' onClick={() => send(path.slice(0, path.indexOf(folder)) + folder)} key={i}>{folder}</td>
                        )}
                        <td className='folder'>
                            Folders: <br/>
                            {curdir.map((item, i) => 
                            <div className='folder' onClick={() => send(path + "/" + item)} key={i}>{item}</div>
                            )}
                            <br />
                            Images: <br/>
                            {images.map((item, i) => 
                            <div className='folder' onClick={() => imgSelect(path + "/" + item)} key={i}>{item}</div>
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}

export default StartPage