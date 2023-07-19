import React from "react";
import { toast } from 'react-toastify';

const downloadMP3s = async (array, path = '') => {
    let newpath = path.replaceAll('\\', '/')
    if (newpath.slice(-1) !== '/') {newpath = newpath + '/';}

    
    try {
        let request = await fetch("http://localhost:8080/bulk/", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                path: newpath,
                links: array
            })
        })
        let status = await request.json()
        return status
    } catch (ex) {
        return {status: "failure", message: ex}
    }
}

export function BulkInterface(props) {
    const [videos, setVideos] = React.useState(localStorage.hasOwnProperty('videosInput') ? localStorage.getItem('videosInput') : "")

    function isValidYouTubeLink(link) {
        const regex = /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]{11}$/;
        return regex.test(link);
    }

    const handleVideos = (e) => {
        localStorage.setItem('videosInput', e.target.value)
        setVideos(e.target.value)
    }

    const prepareVideos = async () => {
        const raw = videos.split(','), processed = []
        let incorrectCount = 0
        for (let vid of raw) {
            if (isValidYouTubeLink(vid.split('&')[0].trim())) {
                processed.push(vid.split('&')[0].trim())
            } else {
                incorrectCount++
            }
        }
        if (processed.length === 0) {
            return toast.error('Invalid links', {
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
        if (incorrectCount > 0) {
            toast.warn(`${incorrectCount} out of ${raw.length} links are invalid. Download will proceed.`, {
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
        } else {
            toast.success('All links are valid', {
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
        let response = downloadMP3s(processed, props.systemPath)
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
        if (response.status === "failure") {
            toast.error(response.hasOwnProperty('message') ? response.message : "Something went wrong", {
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
        } else {
            toast.success('Successfully downloaded songs', {
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
            <p className='-main-input-title' style={{marginTop:'20px'}}>Youtube URLs</p>
            <p className='-main-input-description'>Enter all youtube videos you want to download separated by a comma (,)</p>
            <textarea spellCheck="false" className="-main-textarea" rows={3} value={videos} onChange={handleVideos}></textarea>
            <button className='-main-button' style={{height: '2rem', width: '100%', marginTop: '20px'}} onClick={prepareVideos}>Download</button>
        </>
    )
}