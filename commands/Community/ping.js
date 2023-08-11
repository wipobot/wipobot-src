const { SlashCommandBuilder, EmbedBuilder, WelcomeChannel, hideLinkEmbed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction, client) {
        let lockData = client.db.prepare(`SELECT * FROM lockedCommands 
        WHERE Command = ? AND guildID = ?`).get(interaction.commandName, interaction.guild.id)
        if (lockData) return interaction.reply({ content: 'This command is locked!', ephemeral: true })
        const embed = new EmbedBuilder()
            .setTitle('Pong!')
            .setDescription(`
🏓 Latency is ${Date.now() - interaction.createdTimestamp}ms. 
API Latency is ${Math.round(interaction.client.ws.ping)}ms`)
            .setColor("Random")
        await interaction.reply({ embeds: [embed], ephemeral: true })
    
        
    }
}



