import * as Discord from "discord.js"
import * as Firebase from "firebase-admin"

module.exports = {
    name: "remove",
    aliases: ["remove", "delete"],
    description: "Removes an emoji from the emoji list!",
    usage: "remove {emote name}",
    run: function(client: Discord.Client, args: Array<string>, message: Discord.Message) {
        // @ts-ignore
        const found = message.member.roles.cache.array().some(r=> global.AllowedRoles.indexOf(r.id) >= 0)
        if (!message.member.hasPermission("ADMINISTRATOR") && !found) return;

        if (args.length < 1) {
            // @ts-ignore
            message.channel.send("Not all arguments were provided!\nusage: `" + global.prefix + module.exports.usage + "`");
            return;
        }

        //@ts-ignore
        if (global.Emojis && !Object.keys(global.Emojis).includes(args[0])) {
            message.channel.send("This emoji doesn't exist!")
            return;
        }

        Firebase.database().ref(`/Emojis/${args[0]}`).set(null).then(() => {
            message.channel.send(`Successfully deleted the ${args[0]} emoji!`)
        })
    }
}