import * as Discord from "discord.js"
module.exports = {
    name: "emoji",
    aliases: ["emoji", "emote"],
    description: "Sends an emoji!",
    usage: "emoji/emote {emote name}",
    run: function(client: Discord.Client, args: Array<string>, message: Discord.Message) {

        //@ts-ignore
        if (global.Emojis && Object.keys(global.Emojis).includes(args[0])) {
            //@ts-ignore
            message.channel.send(global.Emojis[args[0]].url)
        }
    }
}