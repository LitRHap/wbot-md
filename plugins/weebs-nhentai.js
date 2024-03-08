import axios from "axios"
import fetch from "node-fetch"
let handler = async(m, { conn, args }) => {

let code = (args[0] || '').replace(/\D/g, '')
if (!code) throw 'Input code' 
	await conn.sendMessage(m.chat, { react: { text: `🕑`, key: m.key }})
let data = await nhentaiScraper(code)
console.log(data)
let pages = []
let thumb = `https://t.nhentai.net/galleries/${data.media_id}/cover.jpg`	
data.images.pages.map((v, i) => {
			let ext = new URL(v.t).pathname.split('.')[1]
			pages.push(`https://i.nhentai.net/galleries/${data.media_id}/${i + 1}.${ext}`)
		})

let imagepdf = await axios.post("https://akkun3704-helper.hf.space/imagetopdf", { images: pages }, { responseType: 'arraybuffer' })

await conn.sendMessage(m.chat, { document: imagepdf.data, fileName: data.title.english + '.pdf', mimetype: 'application/pdf' }, { quoted: m })
} 
handler.command = /^(nhentai|nhpdf)$/i
handler.tags = ['tools']
handler.help = ['nhentai'].map(v => v + ' <code>')
export default handler 

async function nhentaiScraper(id) {
	let uri = id ? `https://cin.guru/v/${+id}/` : 'https://cin.guru/'
	let html = (await axios.get(uri)).data
	return JSON.parse(html.split('<script id="__NEXT_DATA__" type="application/json">')[1].split('</script>')[0]).props.pageProps.data
}