import * as Discord from "discord.js"
import * as Firebase from "firebase-admin"

module.exports = {
    name: "channels",
    aliases: ["channels"],
    description: "Manage the list of channels that commands can be used in!",
    usage: "channels [add/remove] [#channel/channelID]",
    run: function(client: Discord.Client, args: Array<string>, message: Discord.Message) {

        // @ts-ignore
        const found = message.member.roles.cache.array().some(r=> global.AllowedRoles.indexOf(r.id) >= 0)
        if (!message.member.hasPermission("ADMINISTRATOR") && !found) return;


        // @ts-ignore
        let disallowedChannels: Array<string> = global.DisallowedChannels ? global.DisallowedChannels : []

        switch (args[0]) {
            case "add":
                var targetChannel: Discord.TextChannel | Discord.GuildChannel = message.mentions.channels.first() ? message.mentions.channels.first() : message.guild.channels.cache.has(args[1]) ? message.guild.channels.cache.get(args[1]) : null             

                if (!targetChannel || targetChannel.type === "voice") {
                    message.channel.send("Please provide a valid channel!")
                    return;
                }

                disallowedChannels.push(targetChannel.id)

                Firebase.database().ref("/DisallowedChannels").set(disallowedChannels, (e) => {
                    message.channel.send(`Successfully added ${targetChannel} to the disallowed channels!`)
                })
            break;
            case "remove":
                var targetChannel: Discord.TextChannel | Discord.GuildChannel = message.mentions.channels.first() ? message.mentions.channels.first() : message.guild.channels.cache.has(args[1]) ? message.guild.channels.cache.get(args[1]) : null             

                if (!targetChannel || targetChannel.type === "voice") {
                    message.channel.send("Please provide a valid channel!")
                    return;
                }

                if (!disallowedChannels.includes(targetChannel.id)) {
                    message.channel.send("The provided channel isn't present in the disallowed channels list!")
                    return;
                }



                disallowedChannels.splice(disallowedChannels.indexOf(targetChannel.id), 1)

                Firebase.database().ref("/DisallowedChannels").set(disallowedChannels, (e) => {
                    message.channel.send(`Successfully removed ${targetChannel} from the disallowed channels!`)
                })
            break;
            default:
                const embed = new Discord.MessageEmbed().setTitle("Disallowed Channels:").setDescription("")
                if (disallowedChannels.length > 0)
                {
                    for (var channel of disallowedChannels) {
                        embed.description += `<#${channel}>\n`
                    }
                }
                else {
                    embed.description = "There are no disallowed channels!"
                }
                
                message.channel.send(embed)
            break;
        }
    }
}