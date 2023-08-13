const { SlashCommandBuilder, PermissionsBitField, ChannelType, EmbedBuilder, Embed } = require("discord.js");

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
                .setName('disable')
                .setDescription('Disable the welcome system!')
            )
        ).setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addSubcommandGroup(group => group
            .setName('leveling')
            .setDescription('Leveling system options!')
            .addSubcommand(subcommand => subcommand
                .setName('setup')
                .setDescription('Setup the Leveling system!')
                .addChannelOption(option => option
                    .setName("levelup")
                    .setDescription("*Channel to send levelup messages")
                    .setRequired(false)
                    )
                .addStringOption(option => option
                    .setName("levelup-message")
                    .setDescription("*Message to send when someone levels up.")
                    .setRequired(false)
                    )
                .addStringOption(option => option
                    .setName("prestigeup-message")
                    .setDescription("*Message to send when someones prestige increases.")
                    .setRequired(false)
                    )
                .addStringOption(option => option
                    .setName("xp-multiplier")
                    .setDescription("The XP Multiplier users get when chatting.")
                    .setRequired(false)
                    .addChoices(
                        { name: '1.5x', value: '1.5' },
				        { name: '2x', value: '2' },
                        { name: '2.5x', value: '2.5'},
                        { name: '3x', value: '3'},
                    )
                )
                
            )
            .addSubcommand(subcommand => subcommand
                .setName('add')
                .setDescription('add channels or roles to the leveling system!')
                .addChannelOption(option => option
                    .setName('exclude')
                    .setDescription('*Exclude one or more channels from the leveling system!')
                    .setRequired(false)
                )
                .addChannelOption(option => option
                    .setName("restrict")
                    .setDescription("*Restrict the leveling to only the channels here")
                    .setRequired(false)
                    )
                .addRoleOption(option => option
                    .setName("role")
                    .setDescription("*A role which should recive a the multiplier below")
                    .setRequired(false)
                    )
                .addStringOption(option => option
                    .setName("role-multiplier")
                    .setDescription("*Roles multiplier")
                    .setRequired(false)
                    .addChoices(
                        { name: '1.5x', value: '1.5' },
				        { name: '2x', value: '2' },
                        { name: '2.5x', value: '2.5'},
                        { name: '3x', value: '3'},
                    )
                    )
                
            )
            .addSubcommand(subcommand => subcommand
                .setName('remove')
                .setDescription('remove channels or roles from the leveling system!')
                .addChannelOption(option => option
                    .setName('exclude')
                    .setDescription('*Exclude one or more channels from the leveling system!')
                    .setRequired(false)
                )
                .addChannelOption(option => option
                    .setName("restrict")
                    .setDescription("*Restrict the leveling to only the channels here")
                    .setRequired(false)
                    )
                .addRoleOption(option => option
                    .setName("role")
                    .setDescription("*A role which is in the system")
                    .setRequired(false)
                    )
                
            )
            .addSubcommand(subcommand => subcommand
                .setName('disable')
                .setDescription('Disable the leveling system!')
            )
        ).setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    async execute(interaction, client) {
        let db = client.db
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

                    case "disable":
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
            case "leveling":
                switch(subcommand){
                    //exclude restrict levelup levelup-message prestigeup-message xp-multiplier rank-multipliers
                    case "setup":
                    
                    let levelup = interaction.options.getChannel("levelup")
                    let levelup_message = interaction.options.getString("levelup-message")
                    let prestigeup_message = interaction.options.getString("prestigeup-message")
                    let xp_multiplier = interaction.options.getString("xp-multiplier")
                    /*let rank_multiplier = interaction.options.getRole("rank-multipliers")*/

                    //if(!exclude) exclude = "disabled"
                    //if(!restrict) restrict = "disabled"
                    if(!levelup) levelup = "message"
                    if(!levelup_message) levelup_message = "GG! {user} You leveled up! Your level is now {level}"
                    if(!prestigeup_message) prestigeup_message = "GG! {user} you have reached 100 levels and you are now prestige {prestige}!"
                    if(!xp_multiplier) xp_multiplier = 1
                    //if(!rank_multiplier) rank_multiplier = "disabled"

                    let embed = new EmbedBuilder()
                            .setTitle(client.eyes + " Successfully set Leveling system up!")
                            .addFields(
                                {name: "Levelup Channel:", value: levelup.replace("message", "Where the message was sent"), inline: true},
                                {name: "Xp Multiplier:", value: `${xp_multiplier}`, inline: true},
                                {name: "Levelup Message:", value: levelup_message, inline: true},
                                {name: "Prestigeup Message:", value: prestigeup_message, inline: true},
                                {name: "Information:", value: "You can exclude, restrict and set rank multipliers with `/setup leveling add`"}
                                )
                            .setTimestamp(new Date())
                            .setColor(0x1438F2)
                    let ldata = await db.prepare(`SELECT * FROM leveling WHERE guildID = ?`).get(interaction.guild.id)
                    if(!ldata) {
                        client.db.prepare(`INSERT INTO leveling (guildID, upChannel, xpMulti, upMessage, pupMessage) VALUES (?, ?, ?, ?, ?)`).run(interaction.guild.id, levelup.id, xp_multiplier, levelup_message, prestigeup_message)
                        interaction.reply({embeds: [embed]})
                    } else {
                        client.db.prepare(`UPDATE leveling SET upChannel = ?, xpMulti = ?, upMessage = ?, pupMessage = ? WHERE guildID = ?`).run(levelup.id, xp_multiplier, levelup_message, prestigeup_message, interaction.guild.id)                   
                        interaction.reply({embeds: [embed]})
                    }
                    break;
                    case "add":
                        let data = await client.db.prepare("SELECT * FROM leveling WHERE guildID = ?").get(interaction.guild.id)
                        if(!data) {
                            return interaction.reply({embeds: [new EmbedBuilder().setTitle(`${client.eno} | Error!`).setDescription("Your server doesn't have leveling configured! Use `/setup leveling setup` to set it up and after that you can use this command")]})
                        } else {
                            
                            let exclude = interaction.options.getChannel("exclude")
                            let restrict = interaction.options.getChannel("restrict")
                            let rank_multiplier = interaction.options.getRole("role")
                            let rank_multiplier2 = interaction.options.getString("role-multiplier")
                            
                            if(rank_multiplier && !rank_multiplier2) return interaction.reply({embeds: [new EmbedBuilder().setTitle(`${client.eno} | Error!`).setDescription("You specified a role which sould receive a multiplier, but didnt specify a multiplier.")]})
                            if(!rank_multiplier && rank_multiplier2) return interaction.reply({embeds: [new EmbedBuilder().setTitle(`${client.eno} | Error!`).setDescription("You specified a multiplier which a role should receive, but didnt specify a role.")]})

                            if(exclude && restrict) return interaction.reply({embeds: [new EmbedBuilder().setTitle(`${client.eno} | Error!`).setDescription("You cant exclude a channel while you have restricted it to a channel")]})
                            if(exclude && !restrict) {
                                const existingRow = await db.prepare('SELECT excludedChannels FROM leveling WHERE guildID = ?').get(interaction.guild.id);
                                let updatedSerializedArray = ""
                                     if (existingRow) {
                                        let newarray = []
                                    const existingArray = JSON.parse(existingRow.excludedChannels);
                                    for(let i = 0; i < existingArray.length; i++) {
                                        if(existingArray[i] == exclude.id) return interaction.reply({embeds: [new EmbedBuilder().setTitle(`${client.eno} | Error!`).setDescription("The channel you specified to exclude is already in the excluded channels list. If you want to remove it use `/setup leveling remove`")]})
                                        newarray.push(existingArray[i])
                                    }
                                    
                                    newarray.push(exclude.id);
                                        
                                        updatedSerializedArray = JSON.stringify(newarray);
                                     } else {
                                        let newarray = []
                                        newarray.push(exclude.id)
                                        updatedSerializedArray = JSON.stringify(newarray)
                                     }
                                client.db.prepare(`UPDATE leveling SET excludedChannels = ? WHERE guildID = ?`).run(updatedSerializedArray, interaction.guild.id)
                                console.log("Excluded channel: "+exclude.id);
                            }
                            if(restrict && !exclude) {
                                const restrictedChannels = await db.prepare('SELECT restrictedChannels FROM leveling WHERE guildID = ?').get(interaction.guild.id);
                                console.log(restrictedChannels);
                                let updatedSerializedArray = ""
                                     if (restrictedChannels.restrictedChannels) {
                                        let newarray = []
                                    const existingArray = JSON.parse(restrictedChannels.restrictedChannels);
                                    for(let i = 0; i < existingArray.length; i++) {
                                        if(existingArray[i] == restrict.id) return interaction.reply({embeds: [new EmbedBuilder().setTitle(`${client.eno} | Error!`).setDescription("The channel you specified to exclude is already in the restricted channels list. If you want to remove it use `/setup leveling remove`")]})
                                        newarray.push(existingArray[i])
                                    }
                                    
                                    newarray.push(restrict.id); //so the if's works but doesnt seem like it properly sees stuff. Example theres no restrictedChannels in the db but it thinks there is. wtf?
                                        
                                        updatedSerializedArray = JSON.stringify(newarray);
                                     } else {
                                        let newarray = []
                                        newarray.push(restrict.id)
                                        updatedSerializedArray = JSON.stringify(newarray)
                                     }
                                client.db.prepare(`UPDATE leveling SET restrictedChannels = ? WHERE guildID = ?`).run(updatedSerializedArray, interaction.guild.id)
                                console.log("Restricted channel: "+restrict.id);
                            }
                            if(rank_multiplier && rank_multiplier2) {
                                const rankMulti = await db.prepare('SELECT rankMulti FROM leveling WHERE guildID = ?').get(interaction.guild.id);
                                let updatedSerializedArray = ""    
                                     if (rankMulti.rankMulti) {
                                        let newarray = []
                                    const existingArray = JSON.parse(rankMulti.rankMulti);
                                    for(let i = 0; i < existingArray.length; i++) {
                                        if(existingArray[i] == rank_multiplier.id) return interaction.reply({embeds: [new EmbedBuilder().setTitle(`${client.eno} | Error!`).setDescription("The role you specified is already in the role xp multiplier list. If you want to remove it use `/setup leveling remove`")]})
                                        newarray.push(existingArray[i])
                                    }
                                    
                                    newarray.push(rank_multiplier.id);
                                        
                                        updatedSerializedArray = JSON.stringify(newarray);
                                     } else {
                                        let newarray = []
                                        newarray.push(rank_multiplier.id)
                                        updatedSerializedArray = JSON.stringify(newarray)
                                     }
                                     const rankMulti2 = await db.prepare('SELECT rankMulti2 FROM leveling WHERE guildID = ?').get(interaction.guild.id);
                                     let updatedSerializedArray2 = ""    
                                          if (rankMulti2.rankMulti2) {
                                             let newarray = []
                                         const existingArray = JSON.parse(rankMulti2.rankMulti2);
                                         for(let i = 0; i < existingArray.length; i++) {
                                             newarray.push(existingArray[i])
                                         }
                                         
                                         newarray.push(rank_multiplier2+"+"+rank_multiplier.id);
                                             
                                             updatedSerializedArray2 = JSON.stringify(newarray);
                                          } else {
                                            let newarray = []
                                            newarray.push(rank_multiplier2+"+"+rank_multiplier.id)
                                            updatedSerializedArray = JSON.stringify(newarray)
                                          }
                                client.db.prepare(`UPDATE leveling SET rankMulti = ?, rankMulti2 = ? WHERE guildID = ?`).run(updatedSerializedArray, updatedSerializedArray2, interaction.guild.id)
                                console.log("Role multiplied: "+rank_multiplier.id, "Role Multiplier: "+rank_multiplier2);
                            }
                            interaction.reply("YESSSS")
                        }
                    break;
                }

        }
    }
};
