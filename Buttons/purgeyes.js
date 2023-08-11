const{
    EmbedBuilder
} = require('discord.js');

module.exports = {
    customId: 'yes',
    async execute(interaction, client) {
        const amount = client.cache.get(interaction.user.id).amount;
        const mVar = client.cache.get(interaction.user.id).messages;

        const embed = new EmbedBuilder()
            .setTitle(`${client.eyes} Purged Messages`)
            .setDescription(`Successfully purged ${amount} ${mVar}!`)
            .setColor('Green')
            .setTimestamp()

            try {
                await interaction.deferUpdate()
        await interaction.channel.bulkDelete(amount)
        await interaction.editReply({ embeds: [embed], components: [] })
            } catch (error) {
                console.error(error)
                await interaction.reply({ content: 'There was an error while executing this button!', ephemeral: true })
            }
    }
}