let handler = async (m, { conn, isOwner, isAdmin, isBotAdmin }) => {
	if (m.quoted && m.quoted.fromMe) await m.quoted.delete()
	else if (m.quoted && isBotAdmin && (isAdmin || isOwner)) conn.sendMessage(m.chat, { delete: (await m.getQuotedObj()).key })
}
handler.command = /^del(ete)?$/i

export default handler