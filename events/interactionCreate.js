const client = require('../index');
const { Client, GatewayIntentBits, PermissionsBitField, ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require('discord.js')
const errorrow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setLabel('Support Server')
                .setURL('https://discord.gg/WmZVXka5U7')
                .setStyle(ButtonStyle.Link)
                )

        const errorcmd = new EmbedBuilder()
            .setTitle('<:wipo_no:1138343939519287316> An error occured!')
            .setDescription('An error occured when trying to run your command. Please, contact us with the button below.')
            .setColor('Red')
            .setTimestamp()


client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName)
        if (command) {
            try {
                await command.execute(interaction, client)
            } catch (error) {
                console.error(error)
                await interaction.reply({embeds: [errorcmd], components: [errorrow], ephemeral: true })
            }
        }
    } else if (interaction.isButton()) {
        const button = client.buttons.get(interaction.customId)
        if (button) {
            try {
                await button.execute(interaction,client)
            } catch (error) {
                console.error(error)
                await interaction.reply({ embeds: [errorcmd], components: [errorrow], ephemeral: true })
            }
        }
    } else if (interaction.isStringSelectMenu()) {
        const select = client.Selects.get(interaction.customId)
        if (select) {
            try {
                await select.execute(interaction,client)
            } catch (error) {
                console.error(error)
                await interaction.reply({ embeds: [errorcmd], components: [errorrow], ephemeral: true })
            }
        }
    }
})