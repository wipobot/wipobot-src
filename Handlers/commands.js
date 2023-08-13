const fs = require('fs')


module.exports = (Client) => {
    const load = dirs => {
        const commands = fs.readdirSync(`./commands/${dirs}/`).filter(d => d.endsWith('.js'))
        for (let file of commands) {
            let pull = require(`../commands/${dirs}/${file}`)
            Client.commands.set(pull.data.name, pull)}

    }
    ["Community", "Moderation", "Other", "Leveling"].forEach(x => load(x))
    console.log(`Loaded ${Client.commands.size} commands!`)
}