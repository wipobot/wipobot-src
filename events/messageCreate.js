const client = require('../index');
const { Client, GatewayIntentBits, PermissionsBitField, ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require('discord.js')
let timeoutv = []
const db = client.db
client.on('messageCreate', async message => {
    if(message.author.bot) return;
    if(!message.guild) return;
    let user = message.author
    let data = await db.prepare(`SELECT * FROM level WHERE guildID = ? AND userID = ?`).get(message.guild.id, user.id)
    if(!data){ await db.prepare(`INSERT INTO level (guildID, userID) VALUES (?, ?)`).run(message.guild.id, user.id); data = {level: 0, xp: 0, nextlvl: 20, rank: 0 }}
    let level = 1
    if(data.level != 0) level = data.level
    let newxp = Math.floor(((data.rank * 100) + (level+1)) * 20)
    let xpB = data.xp + Math.floor(Math.random() * 10)
    if(data.xp + xpB >= data.nextlvl) {
        let newData = {
            level: data.level + 1,
            xp: 0,
            nextlvl: newxp,
            rank: 0
        }
        await db.prepare(`UPDATE level SET level = ?, xp = ?, nextlvl = ? WHERE guildID = ? AND userID = ?`).run(newData.level, newData.xp, newData.nextlvl, message.guild.id, user.id)
       // newLevel(user.id, guild.id)
     return message.reply("Levelup.\n"+newData.level)
    }
    if(data.level >= 100) {
        let newData = {
            level: 0,
            xp: 0,
            nextlvl: Math.floor(((data.rank + 1 * 100) + data.level) * 20),
            rank: data.rank + 1
        }
        await db.prepare(`UPDATE level SET level = ?, xp = ?, nextlvl = ?, rank = ? WHERE guildID = ? AND userID = ?`).run(newData.level, newData.xp, newData.nextlvl, newData.rank, message.guild.id, user.id)
        //newPrestige(user.id, message.guild.id)
        message.reply("Prestige up.\n"+newData.rank)
    }
    if(timeoutv.includes(user.id)) {
        return;
    }
    const timeouttime = 2
        await db.prepare(`UPDATE level SET xp = ? WHERE guildID = ? AND userID = ?`).run(xpB, message.guild.id, user.id)
    timeoutv.push(user.id);
            setTimeout(() => {
                timeoutv.shift();
            }, timeouttime * 1000)
})