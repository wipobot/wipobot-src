const {
    EmbedBuilder
} = require('discord.js');

module.exports = {
    customId: 'no',
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setTitle(`${client.eno} Purge Cancelled`)
            .setDescription('Purge cancelled!')
            .setColor('Red')
            .setTimestamp()

        try {
            await interaction.deferUpdate()
            await interaction.editReply({ embeds: [embed], components: [] })
        } catch (error) {
            console.error(error)
            await interaction.reply({ content: 'There was an error while executing this button!', ephemeral: true })
        }
    }
}