import * as Discord from "discord.js"
import * as Firebase from "firebase-admin"

module.exports = {
    name: "channels",
    aliases: ["channels"],
    description: "Manage the list of channels that commands can be used in!",
    usage: "channels [add/remove] [#channel/channelID]",
    run: function(client: Discord.Client, args: Array<string>, message: Discord.Message) {

        // @ts-ignore
        const found = message.member.roles.cache.array().some(r=> global.AllowedRoles.indexOf(r) >= 0)
        if (!message.member.hasPermission("ADMINISTRATOR") && !found) return;


        // @ts-ignore
        let allowedChannels: Array<string> = global.AllowedChannels ? global.AllowedChannels : []

        switch (args[0]) {
            case "add":
                var targetChannel: Discord.TextChannel | Discord.GuildChannel = message.mentions.channels.first() ? message.mentions.channels.first() : message.guild.channels.cache.has(args[1]) ? message.guild.channels.cache.get(args[1]) : null             

                if (!targetChannel || targetChannel.type === "voice") {
                    message.channel.send("Please provide a valid channel!")
                    return;
                }

                allowedChannels.push(targetChannel.id)

                Firebase.database().ref("/AllowedChannels").set(allowedChannels, (e) => {
                    message.channel.send(`Successfully added ${targetChannel} to the allowed channels!`)
                })
            break;
            case "remove":
                var targetChannel: Discord.TextChannel | Discord.GuildChannel = message.mentions.channels.first() ? message.mentions.channels.first() : message.guild.channels.cache.has(args[1]) ? message.guild.channels.cache.get(args[1]) : null             

                if (!targetChannel || targetChannel.type === "voice") {
                    message.channel.send("Please provide a valid channel!")
                    return;
                }

                if (!allowedChannels.includes(targetChannel.id)) {
                    message.channel.send("The provided channel isn't present in the allowed channels list!")
                    return;
                }



                allowedChannels.splice(allowedChannels.indexOf(targetChannel.id), 1)

                Firebase.database().ref("/AllowedChannels").set(allowedChannels, (e) => {
                    message.channel.send(`Successfully removed ${targetChannel} from the allowed channels!`)
                })
            break;
            default:
                const embed = new Discord.MessageEmbed().setTitle("Allowed Channels:").setDescription("")
                if (allowedChannels.length > 0)
                {
                    for (var channel of allowedChannels) {
                        embed.description += `<#${channel}>\n`
                    }
                }
                else {
                    embed.description = "There are no allowed channels!"
                }
                
                message.channel.send(embed)
            break;
        }
    }
}