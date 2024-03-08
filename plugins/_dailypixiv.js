import axios from 'axios'
import { Pixiv } from '@ibaraki-douji/pixivts'
const pixiv = new Pixiv()

export async function before(m) {
	let chat = db.data.chats[m.chat] || {}
	if (!chat.dailyPixivID) chat.dailyPixivID = []
	if (chat && chat.dailyPixiv) {
		let latest = chat.dailyPixivID
		setInterval(async () => {
			this.logger.info(`Checking pixiv image for "${m.chat}"`)
			let res = await getDailyRankPivix().catch(console.error)
			let { illustID, tags, artist, artistID, caption: capt, media } = res
			if (latest.includes(illustID)) return this.logger.info(`ID ${illustID} already sent to "${m.chat}"`)
			let length = latest[latest.length - 1]
			latest.push(illustID)
			if (latest.indexOf(length) !== -1) latest.splice(latest.indexOf(length), 1)
			this.logger.info(`Sending pixiv image to "${m.chat}"`)
			let templateButtons = [
				{ urlButton: { displayText: 'Source', url: `https://pixiv.net/en/artworks/${illustID}` }},
				{ urlButton: { displayText: 'Artist', url: `https://pixiv.net/en/users/${artistID}` }}
			]
			for (let x = 0; x < media.length; x++) {
				let caption = `*Daily Picture*\n\n> Artist: ${artist}\n> Tags: ${tags.join(', ')}\n> Caption:\n${capt}`
				await this.sendMessage(m.chat, { image: media[x], caption, footer: null, templateButtons })
			}
		}, 1800) // 30 minutes
	}
}

export async function getDailyRankPivix() {
	let res = await axios.get('https://www.pixiv.net/touch/ajax/pages/top?type=illust&lang=en')
	let data = await pixiv.getIllustByID(res.data.body.rankings.works[0].id), media = []
	for (let x = 0; x < data.urls.length; x++) media.push(await pixiv.download(data.urls[x].original))
	return {
		illustID: data.illustID, tags: data.tags.tags.map(v => v.tag),
		artist: data.user.name, artistID: data.user.id,
		caption: data.title, media
	}
}
