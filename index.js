const { Client, GatewayIntentBits, PermissionsBitField, ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require('discord.js')
const config = require('./config.json')


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions
    ]
})
const db = require('better-sqlite3')('wipo.db', {
busyTimeout: 100000,
})
client.db = db
db.prepare(`CREATE TABLE IF NOT EXISTS premium (guildID TEXT, authID TEXT)`).run()
db.prepare(`CREATE TABLE IF NOT EXISTS lockedCommands (Command TEXT, guildID TEXT)`).run()
db.prepare('CREATE TABLE IF NOT EXISTS logChannels (guildID TEXT PRIMARY KEY, channelID TEXT)').run()
db.prepare('CREATE TABLE IF NOT EXISTS warnings (guildID TEXT, userID TEXT, reason TEXT, issuerID TEXT, id TEXT)').run()
db.prepare(`CREATE TABLE IF NOT EXISTS welcomeing (guildID TEXT, channelID TEXT, embedTitle TEXT, embedDesc TEXT, canvas TEXT)`).run()
db.prepare(`CREATE TABLE IF NOT EXISTS level (guildID TEXT, userID TEXT, level INT(2) DEFAULT '0', xp INT DEFAULT '0', nextlvl INT DEFAULT '20', rank INT DEFAULT '0')`).run()

client.eno = "<:wipo_no:1138343939519287316>"
client.eyes = "<:wipo_yes:1138346209120112690>"
client.cache = new Map()
client.login(config.TOKEN)
module.exports = client
const { readdirSync } = require('fs')
client.commands = new Map()
const commandsFiles = readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandsFiles) {
    const command = require(`./commands/${file}`)
    let data = command.data.toJSON()
    client.commands.set(data.name, command)
}

const handlersFiles = readdirSync('./Handlers').filter(file => file.endsWith('.js'))
for (const file of handlersFiles) {
     require(`./Handlers/${file}`)(client)
}




