const { SlashCommandBuilder, PermissionsBitField, ChannelType, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Setup the bot!')
        .addSubcommandGroup(group => group
            .setName('moderation')
            .setDescription('Setup moderation!')
            .addSubcommand(subcommand => subcommand
                .setName('logchannel')
                .setDescription('Setup the log channel!')
                .addChannelOption(option => option
                    .setName('channel')
                    .setDescription('The channel to setup!')
                    .setRequired(true)
                )
            )
        ).setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addSubcommandGroup(group => group
            .setName('welcome')
            .setDescription('Setup welcomeing!')
            .addSubcommand(subcommand => subcommand
                .setName('setup')
                .setDescription('Enable the welcome system!')
                
                .addChannelOption(option => option
                    .setName('channel')
                    .setDescription('The channel to setup!')
                    .setRequired(true)
                )
                .addStringOption(option => option
                    .setName('title')
                    .setDescription('The title of the embed, you can use %member% and %server%')
                    .setRequired(true)
                )
                .addStringOption(option => option
                    .setName('description')
                    .setDescription('The description of the embed, you can use %member%, %server% and %memberCount%')
                    .setRequired(true)
                )
                .addStringOption(option => option
                    .setName('image')
                    .setDescription('Do you want an image to be sent with the message?')
                    .setRequired(true)
                    .addChoices(
                        { name: 'Yes', value: 'yes' },
				        { name: 'No', value: 'no' },
                    )
                 )
            )
            .addSubcommand(subcommand => subcommand
                .setName('remove')
                .setDescription('Disable the welcome system!')
            )
        ).setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    async execute(interaction, client) {
        let group = interaction.options.getSubcommandGroup()
        let subcommand = interaction.options.getSubcommand()
        switch (group) {
            case 'moderation':
                switch (subcommand) {
                    case 'logchannel':
                        let data = client.db.prepare('SELECT * FROM logChannels WHERE guildID = ?').get(interaction.guild.id)
                        if (!data){
                        let channel = interaction.options.getChannel('channel')
                        if (channel.type !== ChannelType.GuildText) return interaction.reply({ content: 'The channel must be a text channel!', ephemeral: true })
                        client.db.prepare(`INSERT INTO logChannels (guildID, channelID) VALUES (?,?)`).run(interaction.guild.id, channel.id)
                        interaction.reply({ content: `Successfully setup the log channel to ${channel}!`, ephemeral: true })
                        channel.send({ content: `Successfully setup the log channel to ${channel}!` })
                        break;
                        } else {
                            let channel = interaction.options.getChannel('channel')
                            if (channel.type !== ChannelType.GuildText) return interaction.reply({ content: 'The channel must be a text channel!', ephemeral: true })
                            client.db.prepare(`UPDATE logChannels SET channelID = ? WHERE guildID = ?`).run(channel.id, interaction.guild.id)
                            interaction.reply({ content: `Successfully updated the log channel to ${channel}!`, ephemeral: true })
                            channel.send({ content: `Successfully updated the log channel to ${channel}!` })
                            break;
                        }
                }
                break;
            case 'welcome':
                switch(subcommand) {
                    case 'setup':
                        let channel = interaction.options.getChannel("channel")
                        let embedTitle = interaction.options.getString("title")
                        let embedDesc = interaction.options.getString("description")
                        let canvas = interaction.options.getString("image")
                        let data = client.db.prepare('SELECT * FROM welcomeing WHERE guildID = ?').get(interaction.guild.id)
                        if(!data) {
                            if(channel.type !== ChannelType.GuildText) return interaction.reply({ content: 'The channel must be a text channel!', ephemeral: true })
                            client.db.prepare(`INSERT INTO welcomeing (guildID, channelID, embedTitle, embedDesc, canvas) VALUES (?, ?, ?, ?, ?)`).run(interaction.guild.id, channel.id, embedTitle, embedDesc, canvas)
                            interaction.reply({embeds: [
                                new EmbedBuilder()
                                    .setTitle(`${client.eyes} Succesfully set Welcoming up!`)
                                    .setDescription(`Your welcome system has been configured and now on will welcome players in **<#${channel.id}>**.\nYour settings are listed below:`)
                                    .addFields(
                                        {name: "Embed Title", value: embedTitle, inline: true},
                                        {name: "Embed Description", value: embedDesc, inline: true},
                                        {name: "Send Image?", value: canvas.replace("y", "Y").replace("n", "N"), inline: true}
                                    )
                                    .setImage("https://media.discordapp.net/attachments/1136746091027640550/1137117235488493639/standard.gif")
                                ]
                            })

                        } else {
                            if(channel.type !== ChannelType.GuildText) return interaction.reply({ content: 'The channel must be a text channel!', ephemeral: true })
                            client.db.prepare(`UPDATE welcomeing SET channelID = ?, embedTitle = ?, embedDesc = ?, canvas = ? WHERE guildID = ?`).run(channel.id, embedTitle, embedDesc, canvas, interaction.guild.id)
                            interaction.reply({embeds: [
                                new EmbedBuilder()
                                    .setTitle(`${client.eyes} Succesfully set Welcoming up!`)
                                    .setDescription(`Your welcome system has been configured and now on will welcome new users in **<#${channel.id}>**.\nYour settings are listed below:`)
                                    .addFields(
                                        {name: "Embed Title", value: embedTitle.replace("%member%", "John Doe").replace("%server%", interaction.guild.name), inline: true},
                                        {name: "Embed Description", value: embedDesc.replace("%member%", "John Doe").replace("%server%", interaction.guild.name).replace("%memberCount%", interaction.guild.memberCount), inline: true},
                                        {name: "Send Image?", value: canvas.replace("y", "Y").replace("n", "N"), inline: true}
                                    )
                                    .setImage("https://media.discordapp.net/attachments/1136746091027640550/1137117235488493639/standard.gif")
                                    .setTimestamp(new Date)
                                ]
                            })
                        }
                
                    break;

                    case "remove":
                        client.db.prepare(`DELETE * welcomeing WHERE guildID = ?`).run(interaction.guild.id)
                        interaction.reply({ embeds:[
                            new EmbedBuilder()
                                    .setTitle(`${client.eyes} Succesfully disabled Welcoming!`)
                                    .setDescription("New users will not recive a welcoming message.")
                                    .setTimestamp(new Date)
                        ]
                        })

                    break;
                
                }
                
            break;

        }
    }
};
