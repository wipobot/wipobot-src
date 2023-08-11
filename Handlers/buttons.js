const fs = require('fs');

module.exports = (client) => {
    client.buttons = new Map();
let allbuttons = fs.readdirSync("./Buttons").filter(file => file.endsWith(".js"));
for(const file of allbuttons) {
    let button = require(`../Buttons/${file}`);
    client.buttons.set(button.customId, button);
console.log(allbuttons)
    }
}