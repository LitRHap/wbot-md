import yts from 'yt-search'
import { validateURL, getVideoID } from '../lib/ytUrlUtils.js'

const readMore = (String.fromCharCode(8206)).repeat(4001)
let handler = async (m, { conn, args }) => {
	if (!validateURL(args[0])) throw 'Invalid URL'
	await conn.sendMessage(m.chat, { react: { text: '🕑', key: m.key }})
	
	let id = getVideoID(args[0]),
		vid = await yts({ videoId: id }),
		opt = args[1] && args[1].isNumber() ? args[1].replace(/\D/g, '') : ''
	
	let {
		thumbnail,
		title,
		description: desc,
		timestamp,
		views,
		uploadDate,
		ago,
		url,
		author: { name }
	} = vid
	
	let json = await (await fetch(`https://api.revanced.net/get-video?url=${url}`)).json()
	let videoData = json.files.filter(x => x.type === 'muxed').pop()
	
	let _thumb = {}
	try { _thumb = { jpegThumbnail: (await conn.getFile(thumbnail)).data } }
	catch (e) { }
	
	let caption = `*Title:* ${title}\n`
		+ `*Quality:* ${videoData.quality}\n`
		+ `*Channel:* ${name}\n`
		+ `*Duration:* ${timestamp}\n`
		+ `*Upload Date:* ${uploadDate}\n`
		+ `*Views:* ${views}\n`
		+ `*Description:*${readMore}\n${desc}`
	
	await conn.sendMessage(m.chat, {
		[/^(?:-|--)doc$/i.test(args[1]) ? 'document' : 'video']: { url: videoData.url },
		fileName: `${title}.mp4`,
		mimetype: 'video/mp4',
		..._thumb
	}, { quoted: m }).then(async (msg) => {
		await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption }, { quoted: msg })
	})
}
handler.help = ['mp4'].map(v => 'yt' + v + ` <url>`)
handler.tags = ['downloader']
handler.command = /^yt(v|mp4)?$/i

export default handler
