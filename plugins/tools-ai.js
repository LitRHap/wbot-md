import axios from 'axios'

let handler = async (m, { conn, text }) => {
	if (!text) throw 'Use Command With Some Question'
	
	let messages = [
		{ role: 'system', content: `Namamu adalah ${conn.user.name || ''}, jawablah semua pertanyaan menggunakan bahasa gaul` },
		{ role: 'user', content: text }
	]
	let req = await axios.post('https://skizo.tech/api/openai?apikey=Litrhap', { messages }).catch(e => e.response)
	if (req.status !== 200) throw req.data || req.statusText
	
	let { result, code } = req.data
	await m.reply(result)
	if (code.trim() !== 'no code') await m.reply(code)
}
handler.command = handler.help = ['ai']
handler.tags = ['tools']

export default handler