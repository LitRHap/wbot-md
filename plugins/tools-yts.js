import yts from 'yt-search'

let handler = async (m, { conn, text, usedPrefix: _p }) => {
	if (!text) throw 'Input Query'
	let res = (await yts(text)).videos 
	if (!res.length) throw `Query "${text}" Not Found`
	let str = ''
	for (let x of res) str += `*${x.title}*\n(${x.url})\nUploaded ${x.ago || '-'}\n${parseInt(x.views).toLocaleString()} views\n`
	await conn.sendMessage(m.chat, { text: str.trim() }, { quoted: m })
}
handler.help = ['ytsearch']
handler.tags = ['tools']
handler.command = /^yts(earch)?$/i

export default handler