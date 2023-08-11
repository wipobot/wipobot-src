const {
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionsBitField,
    ActionRowBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Purge messages from a channel')

        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Amount of messages to purge')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)
                ),

    async execute(interaction, client) {
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)){
             return interaction.reply({ content: 'You do not have permission to use this command!', ephemeral: true })
        }
        const amount = interaction.options.getInteger('amount')
        let mVar = amount > 1 ? 'messages' : 'message';

        const embed = new EmbedBuilder()
            .setTitle('Purge')
            .setDescription(`Are you sure you want to purge ${amount} ${mVar}?`)
            .setColor('Random')
            .setTimestamp()

                const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('yes')
                    .setLabel('Yes')
                    .setEmoji('1138346209120112690')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('no')
                    .setLabel('No')
                    .setEmoji('1138343939519287316')
                    .setStyle(ButtonStyle.Danger)
            )
            client.cache.set(interaction.user.id,{
                amount: amount,
                messages: mVar
            }
            )

        await interaction.reply({ embeds: [embed], components: [row], ephemeral: true })
    }
}
