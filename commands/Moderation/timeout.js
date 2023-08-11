const { SlashCommandBuilder, PermissionsBitField } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout a member')
        .addSubcommand(subcommand => subcommand
            .setName('add')
            .setDescription('Add a timeout to a member')
            .addUserOption(option => option.setName('member')
                .setDescription('The member you want to timeout')
                .setRequired(true))
            .addIntegerOption(option => option.setName('time')
                .setDescription('The time you want to timeout the member for')
                .setRequired(true)
                .addChoices(
                    { name: '1 minute', value: 60000 },
                    { name: '5 minutes', value: 300000 },
                    { name: '10 minutes', value: 600000 },
                    { name: '30 minutes', value: 1800000 },
                    { name: '1 hour', value: 3600000 },
                    { name: '2 hours', value: 7200000 },
                    { name: '6 hours', value: 21600000 },
                    { name: '12 hours', value: 43200000 },
                    { name: '1 day', value: 86400000 },
                    { name: '2 days', value: 172800000 },
                    { name: '1 week', value: 604800000 },
                    { name: '2 weeks', value: 1209600000 },
                    { name: '1 month', value: 2592000000 },
                    { name: '2 months', value: 5184000000 }
                ))
            .addStringOption(option => option.setName('reason')
                .setDescription('The reason for the timeout')
                .setRequired(true)))
        .addSubcommand(subcommand => subcommand
            .setName('remove')
            .setDescription('Remove a timeout from a member')
            .addUserOption(option => option.setName('member')
                .setDescription('The member you want to remove the timeout from')
                .setRequired(true))
        )
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    async execute(interaction, client) {
        let user = interaction.options.getUser('member')
        let time = interaction.options.getInteger('time')
        let reason = interaction.options.getString('reason')
        let member = interaction.options.getMember('member')
        let guildInfo = client.db.prepare('SELECT * FROM logChannels WHERE guildID = ?').get(interaction.guild.id)
        let channel = interaction.guild.channels.cache.get(guildInfo.channelID)
        let logEmbed = {
            title: 'Timeout',
            color: Math.floor(Math.random() * 0xffffff),
            fields: [],
            footer: {
                text: `Member: ${user.username} Issuer: ${interaction.user.username}`
            },
            timestamp: new Date()
        }
        let userEmbed = {
            title: 'Timeout',
            color: Math.floor(Math.random() * 0xffffff),
            fields: [],
            footer: {
                text: `You were timed out by ${interaction.user.username}`
            },
            timestamp: new Date()
        }

        if (interaction.options.getSubcommand() === "add") {
            userEmbed.fields.push({
                name: '**Time**',
                value: `${time / 60000} minutes`
            })
            userEmbed.fields.push({
                name: '**Reason**',
                value: reason
            })
            logEmbed.fields.push({
                name: '**Member**',
                value: user.username
            })
            logEmbed.fields.push({
                name: '**Time**',
                value: `${time / 60000} minutes`
            })
            logEmbed.fields.push({
                name: '**Reason**',
                value: reason
            })
            if (member) {
                try {
                    await member.timeout(time, reason)
                } catch (error) {
                    return interaction.reply({ content: 'WHERES MAH PERMISSIONS? ARE THEY UNTOUCHABLE???!', ephemeral: true })
                }
                try {
                    await member.send({ embeds: [logEmbed] })
                } catch (error) {
                    console.log(error)
                }

                try {
                    await channel.send({ embeds: [logEmbed] })
                } catch (error) {
                    return interaction.reply({ content: 'I SUGGEST YOU DO /SETUP! I CANNOT LOG THIS!!!!', ephemeral: true })
                }
                interaction.reply({ embeds: [logEmbed], ephemeral: true })
            }
        } else {
            userEmbed.fields.push({
                name: '**Time was removed!**',
                value: `\u200b`
            })
            logEmbed.fields.push({
                name: '**Time was removed!**',
                value: `\u200b`
            })
            if (member) {
                try {
                    await member.timeout(null, 'Timeout Removed')
                } catch (err) {
                    return interaction.reply({ content: 'WHERES MAH PERMISSIONS? ARE THEY UNTOUCHABLE???!', ephemeral: true })
                }
                try {
                    await member.send({ embeds: [userEmbed] })
                } catch (err) {
                    console.log(err)
                }
                try {
                    await channel.send({ embeds: [logEmbed] })
                } catch (err) {
                    return interaction.reply({ content: 'I SUGGEST YOU DO /SETUP! I CANNOT LOG THIS!!!!', ephemeral: true })
                }
                interaction.reply({ embeds: [logEmbed], ephemeral: true })
            }
        }

    }
}
