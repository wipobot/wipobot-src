const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { ImageMaker } = require("@canvacord/beta")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("trigger")
    .setDescription("Trigger someone's profile")
    .addUserOption(o => o.setName("user").setDescription("Whoever you want to trigger").setRequired(false)),

    async execute (interaction) {
        const user = interaction.options.getUser('user') || interaction.user ;
        const profile = user.displayAvatarURL({ dynamic: true, forceStatic: true });

        const triggered = await ImageMaker.trigger(profile);
        const attch = new AttachmentBuilder(triggered, { name: "triggered.gif" });

        const embed = new EmbedBuilder()
        .setColor('#1438F2')
        .setImage('attachment://triggered.gif')

        await interaction.reply({ embeds: [embed], files: [attch] })
    }
}