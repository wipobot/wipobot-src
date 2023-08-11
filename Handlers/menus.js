const fs = require('fs')


module.exports = (Client) => {

    
Client.Menus = new Map()
    
        const Menus = fs.readdirSync(`./Menus/`).filter(d => d.endsWith('.js'))
        for (let file of Menus) {
            let pull = require(`../Menus/${file}`)
            Client.Menus.set(pull.name, pull)}

}