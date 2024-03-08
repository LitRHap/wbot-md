import cheerio from 'cheerio'
import { toPDF } from './weebs-dd.js'
import { extractImageThumb } from 'baileys'

let handler = async (m, { conn, args, usedPrefix, command }) => {
	if (!args[0]) throw `Ex: ${usedPrefix + command} https://komiku.id/ch/dr-stone-chapter-150-bahasa-indonesia/`
	let data = await komikuDl(args[0])
	await m.reply(`Downloading ${data.total} images...`)
	let bufferPDF = await toPDF(data.images)
	let cover = await (await fetch(data.images[0])).arrayBuffer()
	let { buffer } = await extractImageThumb(Buffer.from(cover))
	await conn.sendFile(m.chat, bufferPDF, `${data.title}.pdf`, '', m, '', { jpegThumbnail: buffer })
}
// handler.help = ['komiku']
// handler.tags = ['weebs']
handler.command = /^komiku(dl)?$/i

export default handler

export async function komikuDl(url) {
	let html = await (await fetch(url)).text()
	let $ = cheerio.load(html)
	let images = $('#Baca_Komik img').get().map(el => $(el).attr('src').replace('cdn.', 'img.').replace('.co', ''))
	if (!images.length) throw 'No image found'
	return {
		title: html.match(/title>(.*?) \- Komiku/)[1],
		total: images.length,
		images
	}
}