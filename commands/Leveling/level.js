const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const { createCanvas, loadImage } = require("@napi-rs/canvas")

module.exports = {
    data: new SlashCommandBuilder()
    .setName('level')
    .setDescription("See someone's level")
    .addUserOption(o => o.setName('user').setDescription("The user who you want to see the level of").setRequired(false)),
    async execute(interaction, client) {
        let db = client.db
        let user = interaction.options.getUser("user") || interaction.user
        let data = await db.prepare(`SELECT * FROM level WHERE guildID = ? AND userID = ?`).get(interaction.guild.id, user.id)
        if(!data){ data = await db.prepare(`INSERT INTO OR REPLACE level (guildID, userID) VALUES(?,?)`).run(interaction.guild.id, user.id); data = {level:0,xp:0,nextlvl:20,rank:0}}
            
        const canvas = createCanvas(328, 111)
        const ctx = canvas.getContext("2d")

        
        let bg = await loadImage("https://cdn.discordapp.com/attachments/1139101978413256765/1139459392048222328/rankccard.png")
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

        ctx.font = "bold 15px Courier New";
        ctx.fillStyle = '#f2f2f2';
        ctx.fillText(user.tag.replace("#0", ""), 110, 25)

        ctx.font = "bold 10px Courier New";
        ctx.fillStyle = '#f2f2f2';
        ctx.fillText("Level: "+data.level, 121, 60)
        ctx.font = "bold 10px Courier New";
        ctx.fillStyle = '#f2f2f2';
        ctx.fillText("Prestige: "+data.rank, 199, 60)
        
        //xp level system geci
        ctx.lineJoin = "round";
        ctx.lineWidth = 16;
        
        ctx.strokeStyle = "#171717";
        ctx.strokeRect(75, 92, 218, 0);
        
        ctx.strokeStyle = "#1762e8"
        ctx.strokeRect(75, 92, 218 * data.xp / data.nextlvl, 0);
        
        ctx.font = 'bold 10px Courier New';
        ctx.fillStyle = "#f2f2f2";
        ctx.textAlign = "center"
        ctx.fillText(`${data.xp} / ${data.nextlvl} XP`, canvas.width / 2, 96);

        ctx.beginPath();
        ctx.arc(58, 56, 46, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        const avatar = await loadImage(user.displayAvatarURL({ format: 'jpg' }));
        ctx.drawImage(avatar, 12, 10, 91, 91);
        let attachment = new AttachmentBuilder(await canvas.encode("png"), {
            name: "rankcard.png"
          })
        await interaction.reply({ files: [attachment] })

    }
}



