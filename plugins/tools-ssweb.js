import axios from 'axios'

let handler = async (m, { conn, command, args }) => {
	if (!args[0]) throw 'Input URL'
	await m.reply('_In progress, please wait..._')
	let url = /https?:\/\//.test(args[0]) ? args[0] : 'https://' + args[0],
		// ss = /f$/i.test(command) ? API('lolhuman', '/api/sswebfull', { url }, 'apikey') : await ssweb2(url)
		ss = await ssweb(url, /f$/i.test(command), args[1])
	await conn.sendMessage(m.chat, { image: ss, caption: url }, { quoted: m })
}
handler.help = ['Ss', 'Ssf']
handler.tags = ['tools']
handler.command = /^ss(web)?f?$/i

export default handler

export async function ssweb(url = '', full = false, type = 'desktop') {
	type = type.toLowerCase()
	if (!['desktop', 'tablet', 'phone'].includes(type)) type = 'desktop'
	let form = new URLSearchParams()
	form.append('url', url)
	form.append('device', type)
	if (!!full) form.append('full', 'on')
	form.append('cacheLimit', 0)
	let res = await axios({
		url: 'https://www.screenshotmachine.com/capture.php',
		method: 'post',
		data: form
	})
	let cookies = res.headers['set-cookie']
	let buffer = await axios({
		url: 'https://www.screenshotmachine.com/' + res.data.link,
		headers: {
			'cookie': cookies.join('')
		},
		responseType: 'arraybuffer' 
	})
	return Buffer.from(buffer.data)
}

export async function ssweb2(url) {
	let data = await axios.post('https://www.urlbox.io/api/render', { url })
	return data.data.screenshotUrl
}