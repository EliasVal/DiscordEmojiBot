"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
module.exports = {
    name: "help",
    aliases: ["help"],
    description: "Sends this command list!",
    usage: "help",
    run: function (client, args, message) {
        const embed = new Discord.MessageEmbed().setTitle("Command List:").setDescription("");
        // @ts-ignore
        const list = client.commands;
        list.forEach(e => {
            //@ts-ignore
            embed.description += `Name: \`${e.name}\`\nDescription: ${e.description}\nUsage: \`${global.prefix}${e.usage}\`\nAliases: \`${e.aliases}\`\n\n`;
        });
        message.channel.send(embed);
    }
};
