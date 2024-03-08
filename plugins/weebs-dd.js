import axios from 'axios'
import PDFDocument from 'pdfkit'
import { extractImageThumb } from 'baileys'
import { webp2png } from '../lib/webp2mp4.js'

let handler = async (m, { conn, args, usedPrefix, command }) => {
	if (!args[0]) throw `Ex: ${usedPrefix + command} https://212.32.226.234/cool-na-kyonyuu-iinchou-netorare-kairaku-ochi/`
	let data = await doujindesuDl(args[0])
	await m.reply(`Downloading ${data.total} images...`)
	let headers = { referer: 'https://doujindesu.xxx/' }
	let pdf = await toPDF(data.images, { headers })
	let cover = await (await fetch(data.images[0], { headers })).arrayBuffer()
	let { buffer } = await extractImageThumb(Buffer.from(cover))
	await conn.sendFile(m.chat, pdf, `${data.title}.pdf`, '', m, '', { jpegThumbnail: buffer })
}
// handler.help = ['doujindesu']
// handler.tags = ['weebs']
handler.command = /^d(d|oujindesu)$/i

export default handler

export function toPDF(images, opt = {}) {
	return new Promise(async (resolve, reject) => {
		try {
			if (!Array.isArray(images)) images = [images]
			let doc = new PDFDocument({ margin: 0, size: 'A4' })
			let buffs = []
			for (let x = 0; x < images.length; x++) {
				if (/.gif/.test(images[x])) continue 
				else if (/.webp/.test(images[x])) images[x] = await webp2png(images[x]) 
				let data = (await axios.get(images[x], { responseType: 'arraybuffer', ...opt })).data
				doc.image(data, 0, 0, { fit: [595.28, 841.89], align: 'center', valign: 'center' })
				if (images.length != x + 1) doc.addPage()
			}
			doc.on('data', (chunk) => buffs.push(chunk))
			doc.on('end', () => resolve(Buffer.concat(buffs)))
			doc.on('error', (err) => reject(err))
			doc.end()
		} catch (e) {
			console.error(e)
			reject(e)
		}
	})
}

export async function doujindesuDl(url) {
	let html = await (await fetch(url)).text()
	let id = html.match(/data-id="(\d+)"/)?.[1]
	if (!id) throw 'ID Not Found'
	let ajax = await (await fetch('https://212.32.226.234/themes/ajax/ch.php', {
		method: 'post',
		body: new URLSearchParams({ id })
	})).text()
	let images = ajax.match(/https?:\/\/(.*?)\.(webp|jpg|png)/g)
	return {
		title: html.match(/title>(.*?) \- Doujindesu\.XXX/)[1],
		total: images.length,
		images
	}
}