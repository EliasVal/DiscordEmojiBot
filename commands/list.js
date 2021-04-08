"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
module.exports = {
    name: "list",
    aliases: ["list"],
    description: "Sends the list of emojis!",
    usage: "list",
    run: function (client, args, message) {
        //@ts-ignore
        const emojis = Object.entries(global.Emojis);
        if (emojis.length <= 0) {
            message.channel.send("This server has no emojis!");
            return;
        }
        var page = 1;
        var perPage = 5;
        message.channel.send(makeDesc(page, perPage, emojis)).then(async (msg) => {
            if (emojis.length > page * perPage) {
                await msg.react("⬅️");
                await msg.react("➡️");
                const collectorFilter = (reaction, user) => {
                    // @ts-ignore
                    return reaction.emoji.name === "➡️" || reaction.emoji.name === "⬅️" && user.id == message.member.id;
                };
                const collector = msg.createReactionCollector(collectorFilter, { time: 25000 });
                collector.on('collect', (reaction, user) => {
                    if (reaction.emoji.name === "➡️" && -perPage < emojis.length - (((page + 1) * perPage) - 1)) {
                        page++;
                    }
                    else if (reaction.emoji.name === "⬅️" && 0 < page - 1) {
                        page--;
                    }
                    msg.edit(makeDesc(page, perPage, emojis));
                    collector.resetTimer();
                    reaction.users.remove(message.member.id);
                });
                collector.on("end", (collected, reason) => {
                    msg.reactions.removeAll();
                });
            }
        });
    }
};
function makeDesc(page, perPage, emojis) {
    var embed = new Discord.MessageEmbed().setTitle("Server Emojis:").setDescription("");
    for (var i = page * perPage - perPage; i < page * perPage - 1; i++) {
        if (i >= emojis.length)
            break;
        embed.description += `\`${emojis[i][0]}\`\nGIF: \`${emojis[i][1]["isGif"]}\`\n[[Emoji Link](${emojis[i][1]["url"]})]\n\n`;
    }
    return embed;
}
