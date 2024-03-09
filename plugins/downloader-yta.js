import yts from 'yt-search'
import ytdl from 'ytdl-core'

let handler = async (m, { conn, args }) => {
	if (!ytdl.validateURL(args[0])) throw 'Invalid URL'
	let id = ytdl.getVideoID(args[0])
	let vid = await yts({ videoId: id })
	
	await m.reply('Sedang diproses...')
	
	let {
		thumbnail,
		title,
		description,
		timestamp,
		views,
		uploadDate,
		ago,
		author: { name }
	} = vid
	
	let caption = `*Title:* ${title}\n`
		+ `*Channel:* ${name}\n`
		+ `*Duration:* ${timestamp}\n`
		+ `*Upload Date:* ${uploadDate}\n`
		+ `*Views:* ${views}\n`
		+ `*Description:*\n${description}`
	
	let isDoc = /^(?:-|--)doc$/i.test(args[1])
	let type = isDoc ? 'document' : 'audio'
	let image = (await conn.getFile(thumbnail)).data
	let jpegThumbnail = isDoc ? image : Buffer.alloc(0)
	let audio = await ytmp3(args[0])
	
	let msg = await conn.sendMessage(m.chat, {
		[type]: audio,
		jpegThumbnail,
		fileName: `${title}.mp3`,
		mimetype: 'audio/mpeg',
	}, { quoted: m })
	await conn.sendMessage(m.chat, { image, caption }, { quoted: msg })
}

handler.help = ['ytmp3 <url>']
handler.tags = ['downloader']
handler.command = /^yt(a|mp3)$/i

export default handler

export const ytmp3 = (url) => new Promise(async (resolve, reject) => {
	const stream = ytdl(url, { filter: 'audioonly', quality: 140 })
	const chunks = []
	stream.on('data', (chunk) =>
		chunks.push(chunk)
	)
	stream.on('end', () =>
		resolve(Buffer.concat(chunks))
	)
	stream.on('error', reject)
})
