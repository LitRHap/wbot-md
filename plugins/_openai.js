import axios from 'axios'

export async function before(m, ctx) {
	let isCmd = (ctx.match[0] || '')[0]
	if (!isCmd && m.text && !/^> /.test(m.text) && m.quoted?.fromMe && m.quoted?.isBaileys) {
	let ai = await send(`${m.text}`)
await m.reply(ai)
	}
}

async function send(msg) {
	let resp = await axios.post('https://api.openai.com/v1/completions', {
		model: 'text-davinci-001',
		prompt: msg,
		temperature: 0.5,
		max_tokens: 1024,
		n: 1
	}, { headers: {
		'Content-Type': 'application/json',
		Authorization: 'Bearer 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'
	}})
	return resp.data.choices[0].text
}