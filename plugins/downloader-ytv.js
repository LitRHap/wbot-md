import yts from 'yt-search'
import axios from 'axios'
import { validateURL, getVideoID } from '../lib/ytUrlUtils.js'

let handler = async (m, { conn, args }) => {
	if (validateURL(args[0])) {
		let id = await getVideoID(args[0]), vid = await yts({ videoId: id }), opt = args[1] && args[1].isNumber() ? args[1].replace(/\D/g, '') : ''
		let { thumbnail, title, description: desc, timestamp, views, uploadDate, ago, url, author: { name }} = vid
		await conn.sendMessage(m.chat, { react: { text: `🕑`, key: m.key }})
		let tmp = (await axios.get("https://vihangayt.me/download/ytmp4?url="+url)).data
		let _thumb = {}
		try { _thumb = { jpegThumbnail: (await conn.getFile(thumbnail)).data } }
		catch (e) { }
		await conn.sendMessage(m.chat, { [/^(?:-|--)doc$/i.test(args[1]) ? 'document' : 'video']: { url: tmp.data.vid_720p || tmp.data.vid_360p }, fileName: `${title}.mp4`, mimetype: 'video/mp4', ..._thumb }, { quoted: m }).then(async (msg) => {
			let caption = `*Title:* ${title}\n*Channel:* ${name}\n*Duration:* ${timestamp}\n*Upload Date:* ${uploadDate}\n*Views:* ${views}\n*Description:*\n${desc}`
			await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption }, { quoted: msg })
		})
	} else throw 'Invalid URL'
}
handler.help = ['mp4'].map(v => 'yt' + v + ` <url>`)
handler.tags = ['downloader']
handler.command = /^yt(v|mp4)?$/i
export default handler