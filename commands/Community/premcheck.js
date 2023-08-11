const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('premrcheck')
        .setDescription('Check if a guild is premium'),

    async execute(interaction, client) {

        let data = client.db.prepare('SELECT * FROM premium WHERE guildID = ?').get(interaction.guild.id)

        if(!data) {
        let embed = {
            title: 'Premium Check',
            description: `This guild is not premium!`,
            color: Math.floor(Math.random() * 0xffffff),
            timestamp: new Date()
        }
    
        await interaction.reply({embeds: [embed]})
        }
        else {
            let getUserName = client.users.cache.get(data.authID)
        let embed = {
            title: 'Premium Check',
            description: `This guild is premium! Authed user is ${getUserName}!}`,
            color: Math.floor(Math.random() * 0xffffff),
            timestamp: new Date()
        }
        await interaction.reply({embeds: [embed]})
        }
    }
}



        
