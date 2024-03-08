let handler = async (m, { conn, args }) => {
	let regex = /^([0-9]{5,16}-[0-9]+|[0-9]+)@g\.us$/, group = m.chat
	if (regex.test(args[0])) group = args[0]
	if (!regex.test(group)) throw dfail('group', m, conn)
	let groupMeta = await conn.groupMetadata(group).catch(console.error)
	if (!groupMeta) throw 'groupMetadata is undefined :\\'
	if (!'participants' in groupMeta) throw 'participants is not defined :('
	let me = groupMeta.participants.find(v => v.id === conn.user.jid)
	if (!me) throw 'Aku tidak ada di grup itu :(' 
	if (!me.admin) throw 'Aku bukan admin T_T'
	let link = `https://chat.whatsapp.com/${await conn.groupInviteCode(group)}`
	await m.reply(`Link Group: ${groupMeta.subject}\n${link}`)
}
handler.command = /^link(gc|gro?up)?$/i

export default handler