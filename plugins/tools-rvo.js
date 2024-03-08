let handler = async (m, { conn }) => {
	if (!/viewOnce/.test(m.quoted?.mtype)) throw 'Reply a viewOnceMessage' 
	let q = await m.getQuotedObj()
	let vtype = Object.keys(q.message)[0]
	let mtype = Object.keys(q.message[vtype].message)[0]
	delete q.message[vtype].message[mtype].viewOnce
	conn.sendMessage(m.chat, { forward: q }, { quoted: m })
}
handler.help = ['readviewonce']
handler.tags = ['tools']
handler.command = /^(retrieve|rvo|readviewonce)$/i

export default handler