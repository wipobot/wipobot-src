const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a user')
        .addUserOption(option => option.setName('user').setDescription('The user you want to kick').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason you want to kick this user').setRequired(false)),

    async execute(interaction, client) {
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            interaction.reply({content: 'You do not have permission to use this command!', ephemeral: true})
        }
        let user = interaction.options.getUser('user')
        let reason = interaction.options.getString('reason')
        let member = interaction.guild.members.cache.get(user.id)
        let userEmbed = {
            color: Math.floor(Math.random() * 0xffffff),
            title: `You have been kicked from ${interaction.guild.name}!`,
            description: `Reason: ${reason}`,
            timestamp: new Date(),
            footer: {
                text: `Please read the rules next time!`
            }
        }
        if (member) {
            try {
                await member.send({ embeds: [userEmbed] })
            }
            catch (err) {
                console.log(`Failed to send kick message to ${member.user.username}!`)
            }
            member
                .kick(reason)
                .then(() => {
                    let embed = {
                        color: Math.floor(Math.random() * 0xffffff),
                        title: `Successfully kicked ${user.username}!`,
                        description: `Reason: ${reason}`,
                        timestamp: new Date(),
                        footer: {
                            text: `Kicked by ${interaction.user.username}`
                        }
                    }
                    interaction.reply({ embeds: [embed] })
                })
                .catch(err => {
                    console.log(`Failed to kick ${user.username}!`)
                    interaction.reply({ content: `Failed to kick ${user.username}!`, ephemeral: true })
                });
        }
        else {
            interaction.reply({ content: 'This user is not in the server!', ephemeral: true })
        }
    }
}
