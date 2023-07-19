import React from 'react'
import downlogo from '/vite.svg'
import { toast } from 'react-toastify';
import { BulkInterface } from './BulkInterface';

const downloadMP3 = async (url, path = '') => {
    let newpath = path.replaceAll('\\', '/')

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
        let status = await request.json()
        return status.status
    } catch (ex) {
        return "failure"
    }
}

let timer

function App() {
    const [bulkActivated, setBulkActivated] = React.useState(false)
    const [systemPath, setSystemPath] = React.useState('')
    const [youtubeLink, setYoutubeLink] = React.useState('')
    const [embedVideo, setEmbedVideo] = React.useState({
        active: false,
        title: '',
        lengthSeconds: '',
        thumbnail: '',
        minSize: 0
    })

    const handleSystemPath = (e) => setSystemPath(e.target.value)
    const handleYoutubeLink = (e) => setYoutubeLink(e.target.value)
    
    function isValidYouTubeLink(link) {
        const regex = /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]{11}$/;
        return regex.test(link);
    }

    const prepareDownload = async () => {
        if (!(isValidYouTubeLink(youtubeLink.split('&')[0].trim()))) {
            return toast.error('Invalid link', {
                bodyClassName: "-font",
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } else {
            let response = downloadMP3(youtubeLink.split('&')[0].trim(), systemPath);
            toast.promise(
                response,
                {
                  pending: 'Downloading...',
                  success: 'Download finished',
                  error: 'Download failed'
                },
                {
                    bodyClassName: "-font",
                }
            )
            await response
            if (response === "failure") {
                toast.error('Something went wrong', {
                    bodyClassName: "-font",
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            } else {
                toast.success('Successfully downloaded song', {
                    position: "top-right",
                    bodyClassName: "-font",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
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
        try {
            if (!isValidYouTubeLink(youtubeLink.split('&')[0].trim())) {
                return toast.error('Invalid link', {
                    bodyClassName: "-font",
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
            let response = fetch("http://localhost:8080/link/", {
                method: "post",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url: youtubeLink.split('&')[0].trim()
                })
            })
            let data = await (await response).json();
            setEmbedVideo({
                active: true,
                title: data.title,
                thumbnail: data.thumbnail,
                lengthSeconds: data.lengthSeconds,
                minSize: ((Number(data.lengthSeconds) * 128) / 8).toFixed(1)
            })
            toast.success('Successfully fetched info', {
                position: "top-right",
                className: '-background',
                bodyClassName: "-font",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } catch (ex) {
            toast.error('Something went wrong', {
                position: "top-right",
                bodyClassName: "-font",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    }

    return (
        <>
            <div className='-heading'>
                <img src={downlogo} style={{height: '100%'}}></img>
                MP3 Downloader
            </div>
            <div className='-choose-mode'>
                    <div className='-choose-mode-mode' onClick={() => setBulkActivated(false)} style={{color: !bulkActivated && "#FFFFFF", backgroundColor: !bulkActivated && "var(--subtext-color)"}}>
                        <svg style={{marginRight:'5px'}} height="0.8rem" viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                <g id="icon" fill={!bulkActivated ? "#FFFFFF" : "var(--subtext-color)"} transform="translate(42.666667, 85.333333)">
                                    <path d="M426.666667,1.42108547e-14 L426.666667,341.333333 L3.55271368e-14,341.333333 L3.55271368e-14,1.42108547e-14 L426.666667,1.42108547e-14 Z M384,42.6666667 L42.6666667,42.6666667 L42.6666667,298.666667 L384,298.666667 L384,42.6666667 Z M341.333333,213.333333 L341.333333,245.333333 L234.666667,245.333333 L234.666667,213.333333 L341.333333,213.333333 Z M341.333333,149.333333 L341.333333,181.333333 L234.666667,181.333333 L234.666667,149.333333 L341.333333,149.333333 Z M192,85.3333333 L192,170.666667 L85.3333333,170.666667 L85.3333333,85.3333333 L192,85.3333333 Z M341.333333,85.3333333 L341.333333,117.333333 L234.666667,117.333333 L234.666667,85.3333333 L341.333333,85.3333333 Z" id="Combined-Shape">

                        </path>
                                </g>
                            </g>
                        </svg>
                        INDIVIDUAL
                    </div>
                    <div className='-choose-mode-mode' onClick={() => setBulkActivated(true)} style={{color: bulkActivated && "#FFFFFF", backgroundColor: bulkActivated && "var(--subtext-color)"}}>
                        <svg style={{marginRight:'5px'}} height="0.8rem" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                <g id="Dribbble-Light-Preview" transform="translate(-219.000000, -200.000000)" fill={bulkActivated ? "#FFFFFF" : "var(--subtext-color)"}>
                                    <g id="icons" transform="translate(56.000000, 160.000000)">
                                        <path d="M181.9,54 L179.8,54 C178.63975,54 177.7,54.895 177.7,56 L177.7,58 C177.7,59.105 178.63975,60 179.8,60 L181.9,60 C183.06025,60 184,59.105 184,58 L184,56 C184,54.895 183.06025,54 181.9,54 M174.55,54 L172.45,54 C171.28975,54 170.35,54.895 170.35,56 L170.35,58 C170.35,59.105 171.28975,60 172.45,60 L174.55,60 C175.71025,60 176.65,59.105 176.65,58 L176.65,56 C176.65,54.895 175.71025,54 174.55,54 M167.2,54 L165.1,54 C163.93975,54 163,54.895 163,56 L163,58 C163,59.105 163.93975,60 165.1,60 L167.2,60 C168.36025,60 169.3,59.105 169.3,58 L169.3,56 C169.3,54.895 168.36025,54 167.2,54 M181.9,47 L179.8,47 C178.63975,47 177.7,47.895 177.7,49 L177.7,51 C177.7,52.105 178.63975,53 179.8,53 L181.9,53 C183.06025,53 184,52.105 184,51 L184,49 C184,47.895 183.06025,47 181.9,47 M174.55,47 L172.45,47 C171.28975,47 170.35,47.895 170.35,49 L170.35,51 C170.35,52.105 171.28975,53 172.45,53 L174.55,53 C175.71025,53 176.65,52.105 176.65,51 L176.65,49 C176.65,47.895 175.71025,47 174.55,47 M167.2,47 L165.1,47 C163.93975,47 163,47.895 163,49 L163,51 C163,52.105 163.93975,53 165.1,53 L167.2,53 C168.36025,53 169.3,52.105 169.3,51 L169.3,49 C169.3,47.895 168.36025,47 167.2,47 M181.9,40 L179.8,40 C178.63975,40 177.7,40.895 177.7,42 L177.7,44 C177.7,45.105 178.63975,46 179.8,46 L181.9,46 C183.06025,46 184,45.105 184,44 L184,42 C184,40.895 183.06025,40 181.9,40 M174.55,40 L172.45,40 C171.28975,40 170.35,40.895 170.35,42 L170.35,44 C170.35,45.105 171.28975,46 172.45,46 L174.55,46 C175.71025,46 176.65,45.105 176.65,44 L176.65,42 C176.65,40.895 175.71025,40 174.55,40 M169.3,42 L169.3,44 C169.3,45.105 168.36025,46 167.2,46 L165.1,46 C163.93975,46 163,45.105 163,44 L163,42 C163,40.895 163.93975,40 165.1,40 L167.2,40 C168.36025,40 169.3,40.895 169.3,42" id="grid-[#1526]">

                        </path>
                                    </g>
                                </g>
                            </g>
                        </svg>
                        BULK
                    </div>
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
                {
                    bulkActivated
                    ?
                    <BulkInterface
                        systemPath={systemPath}
                    />
                    :
                    <>
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
                        {
                            embedVideo.active 
                            &&
                            <div style={{width: '100%', maxWidth: '100%'}}>
                                <div className='-main-showvideo'>
                                    <img 
                                        src={embedVideo.thumbnail}
                                        style={{height: '50px', marginRight: '10px'}}
                                    />
                                    <div style={{flex: '1'}}>
                                        <div style={{maxWidth:'100%'}}>
                                            <p className='-main-input-title -main-video-title' style={{fontSize: '0.7rem'}}>{embedVideo.title}</p>
                                        </div>
                                        <p className='-main-input-description'>Length: {new Date(embedVideo.lengthSeconds * 1000).toISOString().substr(14, 5)}</p>
                                        <p className='-main-input-description'>Size: ~{(embedVideo.minSize / 1000).toFixed(1)}MB</p>
                                    </div>
                                </div>
                            </div>
                        }
                        <button className='-main-button' style={{height: '2rem', width: '100%', marginTop: '20px'}} onClick={prepareDownload}>Download</button>
                    </>
                }
            </div>
        </>
    )
}

export default App
