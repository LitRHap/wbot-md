import axios from 'axios'
import cheerio from 'cheerio'

let handler = async (m, { conn, text }) => {
	if (!text) throw 'Input username!'
	let res = await tiktokProfile(text)
	let txt = `*Name :* ${res.Fullname}\n*Username :* ${res.Username}\n*Followers :* ${res.Followers}\n*Likes :* ${res.Likes}\n*Description :* ${res.Biography}`
	await conn.sendHydrated(m.chat, txt, "Tiktok Stalker", res.Profile_Image,`https://www.tiktok.com/${res.Username}`, 'Tiktok', '', '', [['','']], m )
}
handler.help = ['TiktokStalk']
handler.tags = ['tools']
handler.command = /^t(tstalk|iktokstalk)$/i

export default handler

const URL_URLEBIRD = (username) => `https://urlebird.com/user/${username.replace('@', '')}/` 

export async function tiktokProfile(username) {
	let res = await axios.get(URL_URLEBIRD(username)).catch(_ => 'Not Found')
	if (!res.data) throw res
	let $ = cheerio.load(res.data)
	return {
		Username: $("h1.user").text(),
		Fullname: $("div.content").find("h5").text(),
		Biography: $("div.content").find("p").text(),
		Likes: $("div.col-auto").text().split(" ")[1].split("🏹")[0],
		Followers: $("div.col-auto").text().split(" ")[2],
		Profile_Image: $("div > img").attr("src")
	}
}