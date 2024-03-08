import axios from 'axios'
import cheerio from 'cheerio'

let handler = async (m, { conn, command, args, usedPrefix }) => {
	if (!args[0]) throw `Use example ${usedPrefix + command} https://www.instagram.com/p/BmjK1KOD_UG/?utm_medium=copy_link`
	await m.reply("```Loading...```")
	let resp = await axios.get('https://indown.io/')
	let $ = cheerio.load(resp.data)
	
	let form = {}
	$('#downloadForm input').each((idx, el) => form[$(el).attr('name')] = $(el).attr('value'))
	form['link'] = args[0]
	
	let cookie = resp.headers['set-cookie']
	let response = await axios.post('https://indown.io/download', form, { headers: { cookie } })
	if (response.status !== 200) throw response.statusText
	
	$ = cheerio.load(response.data)
	
	let v = $('#result a').get().map(el => $(el).attr('href'))
	
    for (let x = 0; x < v.length; x++) {
		conn.sendFile(m.chat, v[x], '', null, m)
	}
}
handler.help = ['ig'].map(v => v + ' <url>')
handler.tags = ['downloader']
handler.command = /^(ig(dl)?)$/i

export default handler