const ytdl = require('ytdl-core');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const express = require('express');
const app = express();
const logger = require('morgan');
let cors = require('cors');
app.use(express.json());
app.use(logger('dev'));
app.use(cors());
ffmpeg.setFfmpegPath(ffmpegPath);
const sanitize = require('sanitize-filename');

//asdsssf

async function fetchVideo(url = "", path = false) {
	return new Promise(async (resolve, reject) => {
		let videoStream
		try {
			videoStream = ytdl(url, { quality: 'highestaudio' });
		} catch (err) {
			return err
		}
		const title = sanitize((await ytdl.getBasicInfo(url)).videoDetails.title)
        const outputFilePath = process.platform === 'win32' ? `${process.env.USERPROFILE}/Downloads/` : `${process.env.HOME}/Downloads/`;
		const mark = `${~~(Math.random() * 50000)}`

		const ffmpegCommand = ffmpeg(videoStream)
			.audioBitrate(128)
			.toFormat('mp3')
			.output(
				path
				?
				`${path}${title} (${mark}).mp3`
				:
				`${outputFilePath}${title} (${mark}).mp3`
			)
			.on('end', () => {
				resolve();
			})
			.on('error', (err) => {
				reject(err);
			});

		ffmpegCommand.run();
	});
}


app.post('/download/', async (req, res) => {
	const pathExists = req.body.hasOwnProperty('path');
	try {
		fetchVideo(req.body.url, pathExists && req.body.path)
			.then(() => {
				return res.status(200).json({status: 'success', message: ''})
			})
			.catch((err) => {
				console.log(err)
				return res.status(400).json({status:'failure', message: err})
			});
	} catch (err) {
		return res.status(500).json({status: 'failure', message: err})
	}
});

app.post('/bulk/', async (req, res) => {
	const pathExists = req.body.hasOwnProperty('path');
	console.log(req.body.path)
	let videos = req.body.links
	for (let video in videos) {
		try {
			await fetchVideo(videos[video], pathExists && req.body.path)
			console.log(`SUCCESS (${video}/${videos.length}) - ` + videos[video])
		} catch (err) {
			console.log(err)
		}
	}
	return res.status(200).json({status: 'success', message: ''})
});

app.post('/link/', async (req, res) => {
	let details = (await ytdl.getBasicInfo(req.body.url)).videoDetails
	res.status(200).json({
		title: sanitize(details.title),
		lengthSeconds: details.lengthSeconds,
		thumbnail: details.thumbnails[details.thumbnails.length - 2].url
	});
});

const port = 8080;
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
