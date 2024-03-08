let handler = async (m, { conn, text, usedPrefix, command }) => {
	if (!text) throw `Ex: ${usedPrefix + command} a cat`
	let res = await fetch(`https://api.caliph.biz.id/api/openai/dalle?query=${text}&apikey=caliphkey`)
	if (!res.ok) throw await res.text()
	let json = await res.json()
	if (!(json.status || json.url) || json.error) throw json
	let img = await (await fetch(json.url)).arrayBuffer()
	await conn.sendFile(m.chat, Buffer.from(img), 'img.jpg', '', m)
}
handler.help = ['dalle']
handler.tags = ['tools']
handler.command = /^dalle|aiim(g|age)|im(gai|ageai)$/i

export default handler