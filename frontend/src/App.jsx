import React from 'react'
import downlogo from '/vite.svg'

const downloadMP3 = async (url, path = '') => {
    let newpath = path.replaceAll('\\', '/')
    console.log("URL IS: " + url)

    if (newpath.slice(-1) !== '/') {newpath = newpath + '/';}

    try {
        let request = await fetch("http://localhost:8080/download/", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                path: newpath,
                url
            })
        })
        return request.status === 200 ? {status: "success", message: ""} : {status: "failure", message: ""}
    } catch (ex) {
        return {status: "failure", message: ex}
    }
}

let timer

function App() {
    const [systemPath, setSystemPath] = React.useState('')
    const [youtubeLink, setYoutubeLink] = React.useState('')

    const handleSystemPath = (e) => setSystemPath(e.target.value)
    const handleYoutubeLink = (e) => setYoutubeLink(e.target.value)
    
    function isValidYouTubeLink(link) {
        const regex = /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]{11}$/;
        return regex.test(link);
    }

    const prepareDownload = async () => {
        if (!(isValidYouTubeLink(youtubeLink))) {
            return timedError()
        } else {
            let response = await downloadMP3(youtubeLink, systemPath);
        }
    }

    const timedError = () => {
        clearTimeout(timer)
        document.querySelector('#ytlink').outline = '3px solid #FF000070'
        timer = setTimeout(() => {
            document.querySelector('#ytlink').outline = '3px solid #FF000000'
        }, 2000)
    }

    const getVideoInfo = async () => {
        let response = await fetch("http://localhost:8080/link/", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: youtubeLink
            })
        })
        console.log(await JSON.parse(response))
    }

    return (
        <>
            <div className='-heading'>
                <img src={downlogo} style={{height: '100%'}}></img>
                MP3 Downloader
            </div>
            <div className='-main'>
                <p className='-main-input-title'>Output path</p>
                <p className='-main-input-description'>System path to where the song should be downloaded</p>
                <input 
                    className='-main-input' 
                    spellCheck="false" 
                    placeholder='C:/Users/myPC/Desktop/'
                    value={systemPath}
                    onChange={handleSystemPath}></input>
                <p className='-main-input-title' style={{marginTop: '25px'}}>Youtube video URL</p>
                <p className='-main-input-description'>URL to the youtube media you want to download</p>
                <div className='-main-youtube-div'>
                    <input 
                        className='-main-input' 
                        spellCheck="false" 
                        placeholder='https://www.youtube.com/watch?v=xxxxxxxxxxx'
                        id='ytlink'
                        style={{width: '87%'}}
                        value={youtubeLink}
                        onChange={handleYoutubeLink}></input>
                    <button
                        className='-main-button'
                        style={{width: '10%'}}
                        onClick={getVideoInfo}>
                            <svg height="1.2rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 4.45962C9.91153 4.16968 10.9104 4 12 4C16.1819 4 19.028 6.49956 20.7251 8.70433C21.575 9.80853 22 10.3606 22 12C22 13.6394 21.575 14.1915 20.7251 15.2957C19.028 17.5004 16.1819 20 12 20C7.81811 20 4.97196 17.5004 3.27489 15.2957C2.42496 14.1915 2 13.6394 2 12C2 10.3606 2.42496 9.80853 3.27489 8.70433C3.75612 8.07914 4.32973 7.43025 5 6.82137" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round"/>
                                <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="#FFFFFF" stroke-width="1.5"/>
                            </svg>
                    </button>
                </div>
                <button className='-main-button' style={{height: '2rem', width: '100%', marginTop: '20px'}} onClick={prepareDownload}>Download</button>
            </div>
        </>
    )
}

export default App
