"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    name: "emoji",
    aliases: ["emoji", "emote"],
    description: "Sends an emoji!",
    usage: "emoji/emote {emote name}",
    run: function (client, args, message) {
        //@ts-ignore
        if (!global.AllowedChannels.includes(message.channel.id)) {
            message.channel.send("You're not allowed to do this here!");
            return;
        }
        ;
        //@ts-ignore
        if (global.Emojis && Object.keys(global.Emojis).includes(args[0])) {
            //@ts-ignore
            message.channel.send(global.Emojis[args[0]].url);
        }
    }
};
