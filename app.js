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

//asds

async function fetchVideo(url = "", path = false) {
	return new Promise(async (resolve, reject) => {
		let videoStream
		try {
			videoStream = ytdl(url, { quality: 'highestaudio' });
		} catch (err) {
			reject(err)
		}
		const title = sanitize((await ytdl.getBasicInfo(url)).videoDetails.title)
        

		const ffmpegCommand = ffmpeg(videoStream)
			.audioBitrate(128)
			.toFormat('mp3')
			.output(
				path
				?
				`${path}${title}.mp3`
				:
				`${title}.mp3`
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
	const { url } = req.body;
	const pathExists = req.body.hasOwnProperty('path');
	fetchVideo(req.body.url, pathExists && req.body.path)
		.then(() => {
			return res.status(200).json({status: 'success', message: ''})
		})
		.catch((err) => {
			console.log(err)
			return res.status(400).json({status:'failure', message: err})
		});
});

app.post('/link/', async (req, res) => {
	let details = (await ytdl.getBasicInfo(req.body.url)).videoDetails
	console.log(details)
	return res.status(200).json({message: "lmfao"})
	/*{
		title: sanitize(details.title),
		lengthSeconds: details.lengthSeconds,
		thumbnail: details.thumbnails[details.thumbnails.length - 1].url
	} */
});

const port = 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
