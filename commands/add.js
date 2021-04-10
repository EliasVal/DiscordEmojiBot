"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const Firebase = require("firebase-admin");
const jimp = require("jimp");
const fs = require("fs");
const request = require("request");
const gifResize = require("@gumlet/gif-resize");
const LinkCheck = new RegExp("((https:\/\/)?(cdn)|(media)\.discordapp\.(com)|(net)\/)");
const sizes = [16, 32, 64, 128];
module.exports = {
    name: "add",
    aliases: ["add", "append"],
    description: "Sends an emoji!",
    usage: "add/append {emoji name} {link to image or GIF} {size: 32, 64, 128}",
    run: function (client, args, message) {
        // @ts-ignore
        const found = message.member.roles.cache.array().some(r => global.AllowedRoles.indexOf(r) >= 0);
        if (!message.member.hasPermission("ADMINISTRATOR") && !found)
            return;
        if (args.length < 3) {
            // @ts-ignore
            message.channel.send("Not all arguments were provided!\nusage: `" + global.prefix + module.exports.usage + "`");
            return;
        }
        // @ts-ignore
        if (global.Emojis && Object.keys(global.Emojis).includes(args[0])) {
            message.channel.send("This emoji already exists!");
            return;
        }
        if (!LinkCheck.test(args[1])) {
            message.channel.send("The link must be from Discord's CDN! `(cdn.discordapp.com or media.discordapp.net)`");
            return;
        }
        if (!Number.isInteger(parseInt(args[2])) || !sizes.includes(parseInt(args[2]))) {
            message.channel.send("The size must be a valid integer that is either 16, 32, 64 or 128!");
            return;
        }
        const cleanLink = args[1].replace(/\?.+$/, "");
        const imageType = cleanLink.split(".").pop();
        if (imageType != "gif") {
            jimp.read(cleanLink, (err, img) => {
                const diff = img.bitmap.width / parseInt(args[2]);
                img.resize(parseInt(args[2]), img.bitmap.height / diff)
                    .write(`./temp/${message.id}.${imageType}`);
                //@ts-ignore
                client.guilds.cache.get("687228588822757387").channels.cache.get("828913714647662623").send(new Discord.MessageAttachment(`./temp/${message.id}.${imageType}`)).then((msg) => {
                    //msg.attachments.first().url
                    Firebase.database().ref(`/Emojis/${args[0]}`).set({
                        url: msg.attachments.first().url,
                        size: args[2],
                        isGif: imageType == "gif"
                    }).then(() => {
                        message.channel.send(new Discord.MessageEmbed()
                            .setTitle("Successfully added emoji!")
                            .setColor("random")
                            .setDescription(`Successfully added \`${args[0]}\` with the size of ${args[2]}!\n\n` +
                            `\`\`\`URL: ${msg.attachments.first().url}\nisGIF: ${imageType == "gif"}\`\`\``));
                        fs.unlinkSync(`./temp/${message.id}.${imageType}`);
                    });
                });
            });
        }
        else {
            download(cleanLink, `./temp/${message.id}1.${imageType}`, () => {
                jimp.read(`./temp/${message.id}1.${imageType}`, (err, img) => {
                    const diff = img.bitmap.width / parseInt(args[2]);
                    const buff = fs.readFileSync(`./temp/${message.id}1.${imageType}`);
                    gifResize({
                        width: args[2],
                        height: img.bitmap.height / diff
                    })(buff).then(data => {
                        fs.writeFile(`./temp/${message.id}.${imageType}`, data, (e) => {
                            if (e)
                                throw err;
                            //@ts-ignore
                            client.guilds.cache.get("687228588822757387").channels.cache.get("828913714647662623").send(new Discord.MessageAttachment(`./temp/${message.id}.${imageType}`)).then((msg) => {
                                //msg.attachments.first().url
                                Firebase.database().ref(`/Emojis/${args[0]}`).set({
                                    url: msg.attachments.first().url,
                                    size: args[2],
                                    isGif: imageType == "gif"
                                }).then(() => {
                                    message.channel.send(new Discord.MessageEmbed()
                                        .setTitle("Successfully added emoji!")
                                        .setColor("random")
                                        .setDescription(`Successfully added \`${args[0]}\` with the size of ${args[2]}!\n\n` +
                                        `\`\`\`URL: ${msg.attachments.first().url}\nisGIF: ${imageType == "gif"}\`\`\``));
                                    fs.unlinkSync(`./temp/${message.id}.${imageType}`);
                                    fs.unlinkSync(`./temp/${message.id}1.${imageType}`);
                                });
                            });
                        });
                    });
                });
            });
        }
    }
};
var download = function (uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};
