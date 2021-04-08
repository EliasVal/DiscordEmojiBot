import * as Discord from "discord.js"

module.exports = {
    name: "help",
    aliases: ["help"],
    description: "Sends this command list!",
    usage: "help",
    run: function(client: Discord.Client, args: Array<string>, message: Discord.Message) {
        const embed = new Discord.MessageEmbed().setTitle("Command List:").setDescription("")
        

        // @ts-ignore
        const list: Discord.Collection<any, any> = client.commands;

        list.forEach(e => {
            //@ts-ignore
            embed.description += `Name: \`${e.name}\`\nDescription: ${e.description}\nUsage: \`${global.prefix}${e.usage}\`\nAliases: \`${e.aliases}\`\n\n`
        })

        message.channel.send(embed)

    }
}