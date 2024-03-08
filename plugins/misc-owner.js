let handler = async (m, { conn }) => {
	let arr = []
	for (let x of global.owner) {
		let num = x[0].replace(/\D/g, '') + '@s.whatsapp.net' 
		if (x[1]) arr.push([num, await conn.getName(num)])
	}
	await conn.sendContact(m.chat, arr, m)
}
handler.command = /^(owner)$/i

export default handler
