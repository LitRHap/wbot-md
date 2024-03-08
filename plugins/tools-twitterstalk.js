import cheerio from 'cheerio'

let handler = async (m, { text }) => {
	if (!text) throw 'Username?'
	let data = await twitterStalk(text), img = data.avatarUrl;
	['avatarUrl', 'bannerUrl'].map(x => delete data[x])
	let str = Object.keys(data).map(x =>
		`${x.capitalize()}: ${data[x]}`).join('\n')
	await conn.sendFile(m.chat, img, '', str, m)
}
handler.help = ['twitterstalk']
handler.tags = ['tools']
handler.command = /^(tw(t|itter)stalk)$/i

export default handler

async function twitterStalk(user) {
	let html = await (await fetch(`https://twstalker.com/${user}`)).text()
	let $ = cheerio.load(html)
	let $dash = $('.my-dash-dt')
	if (!$dash.find('span').eq(1).text()) throw 'User Not Found'
	$dash.find('h3 span').remove()
	
	let obj = {}
	obj.name = $dash.find('h3').text()
	obj.username = '@' + user.replace(/^@/, '')
	
	$('.all-dis-evnt').each((idx, el) => {
		let txt = $(el).find('.dscun-txt').text().toLowerCase()
		obj[txt] = $(el).find('.dscun-numbr').text()
	})
	
	obj.avatarUrl = $('.my-dp-dash a').attr('href')
	obj.bannerUrl = ($('.todo-thumb1').attr('style').match(/\((.*?)\)/) || '')[1].trim()
	obj.biography = $dash.find('span').html()
	
	return obj
}