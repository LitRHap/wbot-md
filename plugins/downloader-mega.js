import { File } from 'megajs'
import { fileTypeFromBuffer } from 'file-type'

let handler = async (m, { conn, args }) => {
	if (!args[0]) throw 'Input URL'
	let file = File.fromURL(args[0])
	await m.reply('_In progress, please wait..._')
	file = await file.loadAttributes()
	let data = await file.downloadBuffer()
	let mimetype = await fileTypeFromBuffer(data)
	await conn.sendMessage(m.chat, { document: data, fileName: file.name, mimetype }, { quoted: m })
}
handler.help = ['mega']
handler.tags = ['downloader']
handler.command = /^mega(dl)?$/i

export default handler