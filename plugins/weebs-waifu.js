let handler = async (m, { conn, command }) => {
	let res = await fetch(`https://api.waifu.pics/sfw/${command}`)
	if (!res.ok) throw await res.text()
	let json = await res.json()
	await conn.sendFile(m.chat, json.url, '', `Random Image ${command.capitalize()}`, m)
}
handler.help = handler.command = ['waifu', 'neko']
handler.tags = ['weebs']

export default handler