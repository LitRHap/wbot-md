import mime from 'mime'

let handler = async (m, { args }) => {
	if (!args[0]) throw 'Input URL'
	let json = await (await fetch(`https://xzn.wtf/api/krakendl?apikey=Litrhap&url=${args[0]}`)).json()
	if (json.message) throw json.message
	delete json.status
	let txt = Object.keys(json).map(v => `*• ${v.replace(/_/g, ' ').capitalize()}:* ${json[v]}`).join('\n')
	let mimetype = mime.types[json.type]
	await m.reply('_Sending file..._')
	await m.conn.sendMessage(m.chat, { document: { url: json.url }, fileName: json.file_name, caption: txt, mimetype }, { quoted: m })
}
handler.help = ['kraken']
handler.tags = ['downloader']
handler.command = /^(kraken(dl)?)$/i

export default handler