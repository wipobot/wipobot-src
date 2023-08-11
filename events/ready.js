const { ActivityType } = require('discord.js');
const client = require('../index');

client.on('ready', () => {
    const activityList = [
        { name: `${client.guilds.cache.size} servers | @Wipo`, type: ActivityType.Watching }
    ];

    let i = 0;
    setInterval(() => {
        if (i >= activityList.length) i = 0;
        client.user.setActivity(activityList[i]);
        i++;
    }, 10000);

    console.log(`Client - Logged in as ${client.user.tag}`);

});