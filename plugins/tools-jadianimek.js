import axios from 'axios'
import { webp2png } from '../lib/webp2mp4.js'

let handler = async (m, { conn, usedPrefix, command }) => {
	let q = m.quoted || m
	let mime = (q.msg || q).mimetype || q.mediaType || ''
	if (/image/.test(mime)) {
		let img = await webp2png(await q.download())
		let res = await axios.post('https://api.team-mxmxk.repl.co/h5tuqq/', { image: img, buffer: true }, { responseType: 'arraybuffer' })
		if (res.status != 200 || !/image/.test(res.headers['content-type'])) throw res.data || res.statusText
		await conn.sendMessage(m.chat, { image: res.data }, { quoted: m }).catch(e => m.reply(e+''))
	} else throw `Send/reply an image with command ${usedPrefix + command}`
}
handler.help = ['jadianime']
handler.tags = ['tools']
handler.command = /^(to|jadi)anime$/i

export default handler