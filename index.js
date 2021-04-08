require('dotenv').config()

const Discord = require('discord.js')
const fs = require('fs')

const firebase = require('firebase-admin')

const client = new Discord.Client()
client.commands = new Discord.Collection()

const prefix = "e."
global.prefix = prefix

firebase.initializeApp({
    credential: firebase.credential.cert(JSON.parse(process.env.FB_TOKEN)),
    databaseURL: "https://emojibot-4b19f-default-rtdb.firebaseio.com"
});

const db = firebase.database()

db.ref("/").on('value', async (snapshot) => {
    global.Emojis = await snapshot.val()
    client.login(process.env.TOKEN)
})

client.on('ready', () => {
    
    var files = fs.readdirSync("./commands")

    for (var file of files) {
        if (file.endsWith(".js")) {
            const item = require(`./commands/${file}`)
            client.commands.set(item.name, item)
        }
    }

    client.user.setActivity("the Emoji Movie", {
        type: "WATCHING"
    })


    console.log("I am ready!")
})

client.on('message', (message) => {
    if (!message.content.startsWith(prefix)) return;

    const args = message.content
        .slice(prefix.length)
        .trim()
        .split(/ +/)
    
    const commandName = args.shift().toLowerCase()

    const command = client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName))
    if (!command) return

    command.run(client, args, message)
})