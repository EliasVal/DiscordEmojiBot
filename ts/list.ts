import * as Discord from "discord.js"

module.exports = {
    name: "list",
    aliases: ["list"],
    description: "Sends the list of emojis!",
    usage: "list",
    run: function(client: Discord.Client, args: Array<string>, message: Discord.Message) {
        
        //@ts-ignore
        if (global.Emojis.length <= 0) {
            message.channel.send("This server has no emojis!")
            return;
        }

        //@ts-ignore
        const emojis: Array<Array<any>> = Object.entries(global.Emojis)

        var page = 1
        var perPage = 5
        message.channel.send(makeDesc(page, perPage, emojis)).then(async msg => {
            if (emojis.length > page * perPage) {

                await msg.react("⬅️")
                await msg.react("➡️")

                const collectorFilter = (reaction: Discord.MessageReaction, user: Discord.User) => {
                    // @ts-ignore
                    return reaction.emoji.name === "➡️" || reaction.emoji.name === "⬅️" && user.id == message.member.id
                }

                const collector: Discord.ReactionCollector = msg.createReactionCollector(collectorFilter, { time: 25000 })

                collector.on('collect', (reaction: Discord.MessageReaction, user: Discord.User) => {
                    if (reaction.emoji.name === "➡️" && -perPage < emojis.length - (((page+1) * perPage) - 1)) {
                        page++
                    }
                    else if (reaction.emoji.name === "⬅️" && 0 < page-1) {
                        page--
                    }

                    msg.edit(makeDesc(page, perPage, emojis))
                    collector.resetTimer();
                    reaction.users.remove(message.member.id)
                })

                collector.on("end", (collected, reason) => {
                    msg.reactions.removeAll();
                })
            }
        })
    }


}

function makeDesc(page: number, perPage:number, emojis: Array<Array<any>>) {
    var embed = new Discord.MessageEmbed().setTitle("Server Emojis:").setDescription("")
    for (var i = page * perPage - perPage; i < page * perPage - 1; i++) {
        if (i >= emojis.length) break;
        embed.description += `\`${emojis[i][0]}\`\nGIF: \`${emojis[i][1]["isGif"]}\`\n[[Emoji Link](${emojis[i][1]["url"]})]\n\n`
    }

    return embed;
}