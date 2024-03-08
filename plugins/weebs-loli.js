import Booru from 'booru'
const sites = ['sb', 'kn', 'kc']

let handler = async (m, { conn, usedPrefix, command }) => {
	let data = await Booru.search(sites.getRandom(), ['loli'], { random: true })
	let url = data[0].fileUrl
	await conn.sendFile(m.chat, url, '', 'Random Image Loli', m)
}
handler.help = handler.command = ['loli']
handler.tags = ['weebs']

export default handler