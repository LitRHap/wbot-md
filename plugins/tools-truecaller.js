import truecallerjs from 'truecallerjs'
import PhoneNum from 'awesome-phonenumber'

export const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })

let handler = async (m, { conn, text, usedPrefix, command }) => {
	let num = (text || '').replace(/\D/g, '')
	if (!num) throw `Ex: ${usedPrefix + command} ${m.sender.split('@')[0]}`
	let phone = PhoneNum(`+${num}`)
	let countryCode = phone.getRegionCode('international')
	let sn = await truecallerjs.searchNumber({
		number: num, countryCode,
		installationId: 'a1i0C--YgalT8F_-oQRJv2Ow26hLNn3k9Ob5_ZGeA8PNlM3ojvCCc_7t6JvxX_m',
		output: 'JSON'
	})
	sn = JSON.parse(sn)
	let caption = `\t\t\t\t乂 *⺀ TRUE-CALLER ⺀* 乂\n\n`
		+ `*◦ Number :* ${phone.getNumber('international')}\n`
		+ `*◦ Name :* ${sn?.data?.[0]?.name || '-'}\n`
		+ `*◦ Number Type :* ${sn?.data?.[0]?.phones?.[0]?.numberType || '-'}\n`
		+ `*◦ Carrier :* ${sn?.data?.[0]?.phones?.[0]?.carrier || '-'}\n`
		+ `*◦ Type :* ${sn?.data?.[0]?.phones?.[0]?.type || '-'}\n`
		+ `*◦ Country Code :* ${regionNames.of(countryCode) || '-'}\n`
		+ `*◦ Address :* ${sn?.data?.[0]?.addresses?.[0]?.city || '-'}\n`
		+ `*◦ Timezone :* ${sn?.data?.[0]?.addresses?.[0]?.timeZone || '-'}\n\n`
		+ `*◦ Clarification :*\n`
		+ `*_Details about the number you are looking for are not always true._*`
	await conn.sendFile(m.chat, sn?.data?.[0]?.image || 'https://images.livemint.com/img/2021/11/22/1600x900/truecaller-logo-white-1x1_1637570636078_1637570642989.png', '', caption, m)
}


handler.tags = ['tools']
handler.help = ['TrueCaller']
handler.command = /^true(caller)?$/i

export default handler