let handler = async (m, { conn, text, usedPrefix, command }) => {
	if (!text) throw 'Lah?'
	if (!text.match(/x/g)) throw `Lah?`
	if (text.match(/x/g).length > 2) throw `Lah?`
	let detect = text.replace(/[^0-9]/g, '')
	if (!detect.length) throw `Lah?`
	let data = await nowa(conn, text)
	let txt = '\t*• 2009 •*\n' + data.filter(v => v.exists && !/Date/.test(v.setAt) && /09$/.test(v.setAt))
		.map(v => `No : @${splitM(v.jid)}\nBio : ${v.status || ''}\nDate : ${v.setAt}`).join('\n\n')
	+ '\n\n\t*• 2010 •*\n' + data.filter(v => v.exists && !/Date/.test(v.setAt) && /10$/.test(v.setAt))
		.map(v => `No : @${splitM(v.jid)}\nBio : ${v.status || ''}\nDate : ${v.setAt}`).join('\n\n')
	+ '\n\n\t*• 2011 •*\n' + data.filter(v => v.exists && !/Date/.test(v.setAt) && /11$/.test(v.setAt))
		.map(v => `No : @${splitM(v.jid)}\nBio : ${v.status || ''}\nDate : ${v.setAt}`).join('\n\n')
	+ '\n\n\t*• 2012 •*\n' + data.filter(v => v.exists && !/Date/.test(v.setAt) && /12$/.test(v.setAt))
		.map(v => `No : @${splitM(v.jid)}\nBio : ${v.status || ''}\nDate : ${v.setAt}`).join('\n\n')
	m.reply(txt, '', { mentions: data.map(x => x.jid) })
}
handler.command = /^bio$/i

export default handler

function splitM(num) {
	return num.split('@')[0]
}

function formatDate(n, locale = 'id') {
	n = +n
	if (n == 0) n = NaN
	let d = new Date(n)
	return d.toLocaleDateString(locale, { timeZone: 'Asia/Jakarta' })
}

export async function nowa(client, num) {
	let random = num.match(/x/g).length, total = Math.pow(10, random), arr = []
	for (let i = 0; i < total; i++) {
		let list = [...i.toString().padStart(random, '0')], result = num.replace(/x/g, () => list.shift()) + '@s.whatsapp.net'
		if (await client.onWhatsApp(result).then(v => (v[0] || {}).exists)) {
			let info = await client.fetchStatus(result).catch(() => {}) || {}
			info.setAt = formatDate(info?.setAt)
			arr.push({ exists: true, jid: result, ...info })
		} else {
			arr.push({ exists: false, jid: result })
		}
	}
	return arr
}