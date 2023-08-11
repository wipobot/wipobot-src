const { SlashCommandBuilder, PermissionsBitField } = require('discord.js')
 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Create a poll!')
        .addStringOption(option => option.setName('question')
            .setDescription('The question for the poll.')
            .setRequired(true))
        .addStringOption(option => option.setName('option1')
            .setDescription('The first option for the poll.')
            .setRequired(true))
        .addStringOption(option => option.setName('option2')
            .setDescription('The second option for the poll.')
            .setRequired(true))
        .addStringOption(option => option.setName('option3')
            .setDescription('The third option for the poll.')
            .setRequired(false))
        .addStringOption(option => option.setName('option4')
            .setDescription('The fourth option for the poll.')
            .setRequired(false))
        .addStringOption(option => option.setName('option5')
            .setDescription('The fifth option for the poll.')
            .setRequired(false))
        .addStringOption(option => option.setName('option6')
            .setDescription('The sixth option for the poll.')
            .setRequired(false))
        .addStringOption(option => option.setName('option7')
            .setDescription('The seventh option for the poll.')
            .setRequired(false))
        .addStringOption(option => option.setName('option8')
            .setDescription('The eighth option for the poll.')
            .setRequired(false))
        .addStringOption(option => option.setName('option9')
            .setDescription('The ninth option for the poll.')
            .setRequired(false))
        .addStringOption(option => option.setName('option10')
            .setDescription('The tenth option for the poll.')
            .setRequired(false))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Adminitrator),
    async execute(interaction, client) {
        let question = interaction.options.getString('question')
        let option1 = interaction.options.getString('option1')
        let option2 = interaction.options.getString('option2')
        let option3 = interaction.options.getString('option3')
        let option4 = interaction.options.getString('option4')
        let option5 = interaction.options.getString('option5')
        let option6 = interaction.options.getString('option6')
        let option7 = interaction.options.getString('option7')
        let option8 = interaction.options.getString('option8')
        let option9 = interaction.options.getString('option9')
        let option10 = interaction.options.getString('option10')
        let emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟']
        let options = [option1, option2, option3, option4, option5, option6, option7, option8, option9, option10]
        let description = "";
        for (let i = 0; i < options.length; i++) {
            if (options[i]) {
                description += `${emojis[i]} ${options[i]}\n`
            }
        }
        let embed = {
            color: 0x1438F2,
            title: question,
            description: description,
            timestamp: new Date(),
            footer: {
                text: `Wipo | Poll created by ${interaction.user.tag}`,
                icon_url: interaction.user.displayAvatarURL({ dynamic: true })
            }
        }
        await interaction.reply({ embeds: [embed], fetchReply: true })
        let message = await interaction.fetchReply()
        for (let i = 0; i < options.length; i++) {
            if (options[i]) {
                await message.react(emojis[i])
            }
        }
    }
}