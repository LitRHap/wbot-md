import yts from 'yt-search'
import ytdl from 'ytdl-core'

let handler = async (m, { conn, text }) => {
  if (!text) throw 'Input Query'
  let vid = await yts(ytdl.validateURL(text) ? { videoId: await ytdl.getURLVideoID(text) } : { query: text })
 vid = vid.videos ? vid.videos[0] : vid
  if (!vid) throw 'Video/Audio Tidak Ditemukan'
  let { title, description, url, seconds, timestamp, views, ago, image } = vid
  let capt = `*Title:* ${title}\n*Published:* ${ago}\n*Views:* ${views}\n*Description:* ${description}\n*Url:* ${url}`
  conn.sendMessage(m.chat, { react: { text: '⌚', key: m.key }})
  let ytny = await ytmp3(url)
  try {
  let aud = await conn.sendMessage(m.chat, { [seconds > 1900 ? 'document' : 'audio']: ytny.buffer, mimetype: 'audio/mpeg', fileName: `${title}.mp3` }, { quoted: m })
  conn.sendMessage(m.chat, { text: capt }, { quoted: aud })
  } catch (e) {
  console.log(e)
  let aud = await conn.sendMessage(m.chat, { [seconds > 1900 ? 'document' : 'audio']: ytny.buffer, mimetype: 'audio/mpeg', fileName: `${title}.mp3` }, { quoted: m })
  conn.sendMessage(m.chat, { text: capt }, { quoted: aud })
  // m.reply(Terjadi kesalahan.)
 }
}
handler.help = handler.alias = ['play'].map(v => v + ' <query>')
handler.tags = ['downloader']
handler.command = /^(play)$/i
export default handler

export async function ytmp3(url) {
    try {
        const {
            videoDetails
        } = await ytdl.getInfo(url, {
            lang: "id"
        });

        const stream = ytdl(url, {
            filter: "audioonly",
            quality: 140
        });
        const chunks = [];

        stream.on("data", (chunk) => {
            chunks.push(chunk);
        });

        await new Promise((resolve, reject) => {
            stream.on("end", resolve);
            stream.on("error", reject);
        });

        const buffer = Buffer.concat(chunks);

        return {
            meta: {
                title: videoDetails.title,
                channel: videoDetails.author.name,
                seconds: videoDetails.lengthSeconds,
                description: videoDetails.description,
                image: videoDetails.thumbnails.slice(-1)[0].url,
            },
            buffer: buffer,
            size: buffer.length,
        };
    } catch (error) {
        throw error;
    }
};
