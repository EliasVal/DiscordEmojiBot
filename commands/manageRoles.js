"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const Firebase = require("firebase-admin");
module.exports = {
    name: "roles",
    aliases: ["roles"],
    description: "Manage the list of roles that can manage emojis!",
    usage: "roles [add/remove] [@role/roleID]",
    run: function (client, args, message) {
        if (!message.member.hasPermission("ADMINISTRATOR"))
            return;
        // @ts-ignore
        let allowedRoles = global.AllowedRoles ? global.AllowedRoles : [];
        switch (args[0]) {
            case "add":
                var targetRole = message.mentions.roles.first() ? message.mentions.roles.first() : message.guild.roles.cache.has(args[1]) ? message.guild.roles.cache.get(args[1]) : null;
                if (!targetRole) {
                    message.channel.send("Please provide a valid roles!");
                    return;
                }
                allowedRoles.push(targetRole.id);
                Firebase.database().ref("/AllowedRoles").set(allowedRoles, (e) => {
                    message.channel.send(`Successfully added ${targetRole} to the allowed roles!`);
                });
                break;
            case "remove":
                var targetRole = message.mentions.roles.first() ? message.mentions.roles.first() : message.guild.roles.cache.has(args[1]) ? message.guild.roles.cache.get(args[1]) : null;
                if (!targetRole) {
                    message.channel.send("Please provide a valid role!");
                    return;
                }
                if (!allowedRoles.includes(targetRole.id)) {
                    message.channel.send("The provided roles isn't present in the allowed roles list!");
                    return;
                }
                allowedRoles.splice(allowedRoles.indexOf(targetRole.id), 1);
                Firebase.database().ref("/AllowedRoles").set(allowedRoles, (e) => {
                    message.channel.send(`Successfully removed ${targetRole.name} from the allowed roles!`);
                });
                break;
            default:
                const embed = new Discord.MessageEmbed().setTitle("Allowed Roles:").setDescription("");
                if (allowedRoles.length > 0) {
                    for (var roles of allowedRoles) {
                        embed.description += `<@&${roles}>\n`;
                    }
                }
                else {
                    embed.description = "There are no allowed roles!";
                }
                message.channel.send(embed);
                break;
        }
    }
};
