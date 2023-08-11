const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a member')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Warn a member')
                .addUserOption(option => option.setName('member').setDescription('The member you want to warn').setRequired(true))
                .addStringOption(option => option.setName('reason').setDescription('The reason of the warn').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove a warn from a member')
                .addUserOption(option => option.setName('member').setDescription('The member you want to remove a warn from').setRequired(true))
                .addStringOption(option => option.setName('customid').setDescription('ID of issued warning').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('Clear all warns from a member')
                .addUserOption(option => option.setName('member').setDescription('List all of the warnings for the user').setRequired(true))
        )
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages),
    async execute(interaction, client) {
        const logChannel = client.db.prepare('SELECT channelID FROM logChannels WHERE guildID = ?').get(interaction.guild.id)
        if (!logChannel) return interaction.reply({ content: 'You need to set a log channel first!', ephemeral: true })
        const logSend = client.channels.cache.get(logChannel.channelID)
        const member = interaction.options.getMember('member')
        const reason = interaction.options.getString('reason')
        const cid = interaction.options.getString('customid')
        if (interaction.options.getSubcommand() === "add") {
            const cID = GenID(8)
            let embed = {
                color: Math.floor(Math.random() * 0xffffff),
                title: '**You have been warned**',
                description: `You were **WARNED** in ${interaction.guild.name}`,
                timestamp: new Date(),
                fields: [
                    {
                        name: 'Reason',
                        value: reason
                    },
                    {
                        name: 'Warn ID',
                        value: cID
                    }
                ]
                
            }
                let logEmbed = {
                    color: Math.floor(Math.random() * 0xffffff),
                    title: '**Member Warned**',
                    description: `${member} was warned by ${interaction.user}`,
                    timestamp: new Date(),
                    fields: [
                        {
                            name: 'Reason',
                            value: reason
                        },
                        {
                            name: 'Warn ID',
                            value: cID
                        }
                    ]
                }
                client.db.prepare(`INSERT INTO warnings
                (guildID, userID, reason, issuerID, id)
                VALUES (?, ?, ?, ?, ?)`).run(interaction.guild.id, member.id, reason, interaction.user.id, cID)

                try {
                    await member.send({ embeds: [embed] })

                } catch (err) {
                    console.log(err)
                }
                try {
                    await logSend.send({ embeds: [logEmbed] })
                } catch (err) {
                    console.log(err)
                }
                interaction.reply({ embeds: [logEmbed] })
            }else if(interaction.options.getSubcommand() === "remove"){
                const data = client.db.prepare('SELECT * FROM warnings WHERE guildID = ? AND userID = ? AND id = ?').get(interaction.guild.id, member.id, cid)
                if(!data) return interaction.reply({ content: 'That warning does not exist!', ephemeral: true })
                const embed = {
                    color: Math.floor(Math.random() * 0xffffff),
                    title: '**Warning Removed**',
                    description: `Removed warning from ${member}`,
                    timestamp: new Date(),
                    fields: [
                        {
                            name: 'Warn ID',
                            value: data.id
                        }
                    ]
                }
                const logEmbed = {
                    color: Math.floor(Math.random() * 0xffffff),
                    title: '**Warning Removed**',
                    description: `${member} had a warning removed by ${interaction.user}`,
                    timestamp: new Date(),
                    fields: [
                        {
                            name: 'Warn ID',
                            value: data.id
                        }
                    ]
                }
                client.db.prepare('DELETE FROM warnings WHERE guildID = ? AND userID = ? AND id = ?').run(interaction.guild.id, member.id, cid)
                try {
                    await member.send({ embeds: [embed] })
                } catch (err) {
                    console.log(err)
                }
                try {
                    await logSend.send({ embeds: [logEmbed] })
                } catch (err) {
                    console.log(err)
                }
                interaction.reply({ embeds: [logEmbed] })
            }else if(interaction.options.getSubcommand() === 'list'){
                const data = client.db.prepare('SELECT * FROM warnings WHERE guildID = ? AND userID = ?').all(interaction.guild.id, member.id)
                const embed = {
                    color: Math.floor(Math.random() * 0xffffff),
                    title: '**Warnings**',
                    description: `Warnings for ${member}`,
                    timestamp: new Date(),
                    fields: []
                }
                if(!data[0]){
                    embed.fields.push({
                        name: 'No Warnings',
                        value: 'This user has no warnings'
                    })
                  return  interaction.reply({ embeds: [embed] })
                }
                data.forEach((d) => {
                    embed.fields.push({
                        name: `Warn ID: ${d.id}`,
                        value: `Reason: ${d.reason}\nIssuer: <@${d.issuerID}>`
                    })
                    embed.fields.push({
                        name: '----------------',
                        value: "\u200b"
                })
            })
            interaction.reply({ embeds: [embed] })
        }
    }
}
function GenID(Length){
    const char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let custid = ""

    for (let i = 0; i < Length; i++) {
        custid += char.charAt(Math.floor(Math.random() * char.length))
    }
    return custid
}