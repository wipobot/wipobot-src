const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('premremove')
        .setDescription('Remove a user from the premium list')
        .addStringOption(option => option.setName('guild').setDescription('The guild to remove the premium from').setRequired(false))
        .addStringOption(option => option.setName('user').setDescription('The user to remove').setRequired(false)),
    async execute(interaction, client) {
        if (!interaction.user.id === '1108918668261343393') {
            return interaction.reply({content: 'You are not the bot owner!', ephemeral: true})
        }
        
        const guild = interaction.options.getString('guild')
        const user = interaction.options.getString('user')
        const data = client.db.prepare('SELECT * FROM premium WHERE guildID = ?').get(guild)
        if (!data) {
            return interaction.reply({content: 'This guild is not premium!', ephemeral: true})
        }
        client.db.prepare('DELETE FROM premium WHERE guildID = ?').run(guild)
        let embed = {
            title: 'Premium Removed!',
            description: `Removed premium from ${guild} authed user is ${user}!`,
            color: Math.floor(Math.random() * 0xffffff),
            timestamp: new Date()

        }
        await interaction.reply({embeds: [embed]})
    }
}