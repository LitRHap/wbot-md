let handler = async (m, { conn, args }) => {
     if (!args[0]) return m.reply('Pilihan:\n1. add\n2. del\n3. cek')
     if (args[0] == 'add') {
     if (!args[1]) return m.reply('Masukkan plugin yg error!')
     if (!(args[1] in global.plugins)) return m.reply('plugin tersebut tidak terdaftar/tidak ada dalam bot!')
     global.db.data.error.push(args[1])
     m.reply(`Sukses Menambahkan fitur ${args[1]} ke dalam daftar error!`)
     } else if (args[0] == 'cek') {
     m.reply('[ LIST ERROR ]\n\n' + global.db.data.error.join('\n'))
     } else if (args[0] == 'del') {
     if (!args[1]) return m.reply('Masukkan plugin yg error!')
     if (!(args[1] in global.plugins)) return m.reply('plugin tersebut tidak terdaftar/tidak ada dalam bot!')
     let dul = global.db.data.error.indexOf(args[1])
     if (dul == -1) return m.reply('Fitur tersebut tidak ada dalam daftar error!')
     delete global.db.data.error[dul]
     global.db.data.error = global.db.data.error.filter(function (el) { return el != null })
     m.reply(`Sukses Menghapus fitur ${args[1]} dari daftar error!`)
    } else return m.reply('Opsi salah!')
   }
   handler.command =/^(err)$/i
   handler.owner = 1
   
   export default handler