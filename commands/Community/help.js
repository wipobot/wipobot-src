const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { slashPaginate } = require('embed-pagination.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cmdlist')
        .setDescription('Help command'),

    async execute(interaction, client) {
        let commands = [];

        client.commands.forEach((command) => {
            commands.push({
                name: command.data.name || "Error",
                description: command.data.description || "Error",
            });
        });

        const commandChunks = [];
        while (commands.length > 0) {
            commandChunks.push(commands.splice(0, 5));
        }

        const embedPages = commandChunks.map((chunk) => {
            const commandList = chunk.map((command) => {
                return {
                    value: `**/${command.name}** - ${command.description}`,
                    name: `\u200b`,
                };
            });

            return new EmbedBuilder()
                .setColor('Orange')
                .setTitle("Commands")
                .setFields(commandList);
        });

        slashPaginate({
            interaction: interaction,
            pages: embedPages, 
            buttonstyles: {
                beginning: "Primary",
                left: "Primary",
                none: "Secondary",
                right: "Primary",
                end: "Primary",
            },
            emojis: {
                beginning: "⏪",
                start: "◀️",
                none: "⏹️",
                right: "▶️",
                end: "⏩",
            },
        });
    },
};
