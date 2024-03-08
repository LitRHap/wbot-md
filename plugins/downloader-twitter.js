import axios from 'axios'
import cheerio from 'cheerio'
// import { apivisit } from './kanghit.js'

let handler = async (m, { conn, text }) => {
	if (!text) throw 'Input URL'
	if (!text.match(/(twitter.com)/gi)) throw `Invalid *URL*`
	try {
	let api = await (await axios.get("https://pnggilajacn.my.id/api/download/twitter?url="+ text)).data
	let k = api.result
    for (let x = 0; x < k.length; x++) {
		conn.sendFile(m.chat, k[x], '', null, m)
	}
//	await apivisit
  } catch (e) {
    console.log(e)
    throw `Error`
  }
}
handler.help = ['twitter'].map(v => v + ' <url>')
handler.tags = ['downloader']
handler.alias = ['twt', 'twtdl', 'twitter', 'twitterdl']
handler.command = /^((twt|twitter)(dl)?)$/i
export default handler