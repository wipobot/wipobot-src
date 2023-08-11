// Required libraries and variables
const { readdirSync } = require('node:fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require("./config.json");

console.log('Started refreshing application (/) commands.');

// Filter all js files in ./commands
const commands = [];
const commandFolders = readdirSync(`./commands`, { withFileTypes: true }).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);
for (const folder of commandFolders) {
    const commandsFiles = readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandsFiles) {
        const commandName = file.split(".")[0];
        console.log(`\x1b[36mReading ${commandName}.js ... \x1b[0m`);
        try {
            const command = require(`./commands/${folder}/${file}`);
            commands.push(command.data.toJSON());
            console.log(`\x1b[32mSuccessfully read ${commandName}.js\x1b[0m`);
        } catch (error) {
            console.error(`\x1b[31m[${commandName}] ${error}\x1b[0m`);
            console.error(`\x1b[31m${error.stack}\x1b[0m`);
        }
    }
}
// Specify the API version
const rest = new REST({ version: '10' }).setToken(config.TOKEN);

( () => {
  try {
    
    // Log the commands with api.discord.com
    rest.put(
        Routes.applicationCommands(config.APP_ID),
        { body: commands },
    );
    
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(`\x1b[31m${error}`);
  }
})();