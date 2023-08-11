const client = require('../index');
const db = client.db
const { Client, GatewayIntentBits, PermissionsBitField, ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle, AttachmentBuilder } = require('discord.js')
const { createCanvas, loadImage, GlobalFonts  } = require("@napi-rs/canvas")
client.on('guildMemberAdd', async member => {
    const data = db.prepare('SELECT * FROM welcomeing WHERE guildID = ?').get(member.guild.id)
    if (!data) return
    const channel = member.guild.channels.cache.get(data.channelID)
    if (!channel) return
    let embed = new EmbedBuilder()
        .setTitle(data.embedTitle.replace("%member%", member.user.username).replace("%server%", member.guild.name))
        .setColor(0x1438F2)
        .setTimestamp(new Date())
        .setDescription(data.embedDesc.replace("%member%", member.user).replace("%server%", member.guild.name).replace("%memberCount%", member.guild.memberCount))
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setFooter({
            text: member.guild.name,
            icon_url: member.guild.iconURL({ dynamic: true })
        })
    const canvas = createCanvas(1772, 633)
    let ctx = canvas.getContext("2d")
    
    const background = await loadImage(`https://cdn.discordapp.com/attachments/1139101978413256765/1139146381710344282/welcome.png`);
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#f2f2f2';
      ctx.strokeRect(0, 0, canvas.width, canvas.height);

      //memberName
      if (member.user.username.length >= 14) {
        ctx.font = 'bold 100px Courier New';
        ctx.fillStyle = '#f2f2f2';
        ctx.fillText(member.user.username, 720, canvas.height / 2);
      } else { //check if its bigger than 14 letters, make it smaller
        ctx.font = 'bold 150px Courier New';
        ctx.fillStyle = '#f2f2f2';
        ctx.fillText(member.user.username, 720, canvas.height / 2);
      }
      
      //Discriminator
      ctx.font = 'bold 45px Courier New';
      ctx.fillStyle = '#f2f2f2';
      ctx.fillText(member.user.discriminator, 730, canvas.height / 2 + 55);
      
      //MemberCount
      var members = `Member #${member.guild.memberCount}`;
      ctx.font = 'bold 60px Courier New';
      ctx.fillStyle = '#f2f2f2';
      ctx.fillText(members, 750, canvas.height / 2 + 125);

      //Guild Name
      var guild = `${member.guild.name}`;
      ctx.font = 'bold 60px Courier New';
      ctx.fillStyle = '#f2f2f2';
      ctx.fillText(guild, 700, canvas.height / 2 - 150);
      //create a circular "mask"
      ctx.beginPath();
      ctx.arc(315, canvas.height / 2, 250, 0, Math.PI * 2, true);//position of img
      ctx.closePath();
      ctx.clip();
      const avatar = await loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
      ctx.drawImage(avatar, 65, canvas.height / 2 - 250, 500, 500);

      //finally we define the attachement
      let attachment = new AttachmentBuilder(await canvas.encode("png"), {
          name: "welcome.png"
        })



      if(data.canvas == "yes") {
        console.log("Canvas: enabled");
        embed.setImage('attachment://welcome.png')
      }



    await channel.send({ embeds: [embed], files: [attachment] })
})