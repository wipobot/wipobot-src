const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('premadd')
        .setDescription('Add a user to the premium list')
        .addStringOption(option => option.setName('guild').setDescription('The guild to add the premium to').setRequired(true))
        .addUserOption(option => option.setName('user').setDescription('The user to add').setRequired(true)),
    async execute(interaction, client) {
        if (!interaction.user.id === '1108918668261343393') {
            return interaction.reply({ content: `${client.eno} You are not the bot owner!`, ephemeral: true })
        }
        const guild = interaction.options.getString('guild')
        const user = interaction.options.getUser('user')
        const data = client.db.prepare('SELECT * FROM premium WHERE guildID = ?').get(guild)
        if (data) {
            return interaction.reply({ content: `${client.eno} This guild is already premium!`, ephemeral: true })
        }
        client.db.prepare('INSERT INTO premium (guildID, authID) VALUES (?, ?)').run(guild, user.id)
        let embed = {
            title: `${client.eyes} Premium Added!`,
            description: `Added premium to ${guild} authed user is ${user.username}!`,
            color: Math.floor(Math.random() * 0xffffff),
            timestamp: new Date()


        }
        await interaction.reply({ embeds: [embed]})
    }
}