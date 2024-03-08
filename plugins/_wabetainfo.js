/*import cheerio from 'cheerio'

export async function before(m) {
	let jid = '6283801499848-1606101746@g.us'
	let chat = db.data.chats[jid] || {}
	if (!chat.postWaID) chat.postWaID = []
	if (chat.postWaID) setInterval(async () => {
		let { postWaID } = chat
		let data = (await fetchWBINews())?.[0]
		if (postWaID.includes(data.id)) return
		let length = postWaID[postWaID.length - 1]
		postWaID.push(data.id)
		if (postWaID.indexOf(length) !== -1) postWaID.splice(postWaID.indexOf(length), 1)
		let txt = `*${data.title}*\n\n${data.content}\n\n${data.url}`
		let image = await getImage(data).catch(console.error)
		if (image.url) return this.sendMessage(jid, { image: { url: image.url }, caption: txt })
		await this.sendMessage(jid, { text: txt })
	}, 30 * 60 * 1000) // 30 minutes
}

export async function fetchWBINews() {
	let html = await (await fetch('https://wabetainfo.com/')).text()
	let $ = cheerio.load(html)
	let result = $('#main article').get().map(el => ({
		id: $(el).attr('id'),
		title: $(el).find('.entry-title').text(),
		type: $(el).find('.entry-meta a').get().map(e => $(e).text()).slice(1),
		content: $(el).find('.entry-content p').eq(0).text(),
		url: $(el).find('.entry-title a').attr('href')
	}))
	return result
}

async function getImage(post) {
	let html = await (await fetch(post.url)).text()
	let $ = cheerio.load(html)
	let json = JSON.parse($('script').eq(1).html())
	return json['@graph'].find(x => x['@type'] == 'ImageObject')
}*/