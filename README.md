# The Discord Emoji Bot
Ever been tired of reaching the emoji limit and having to delete emojis? ever wanted to let all users use GIF emojis? If so, this bot is for you!

&nbsp;
## How does it work?
You use the `add` command, and provide it with a name you want to give to the emoji, a Discord CDN link to the emoji, and a size (32, 64 or 128).

Then it dumps the result in a specific channel, to get its link and re-use it when needed.

When you call the `emote` commands (located in `commands/send.js` & `ts/send.ts`), it just sends that link.

&nbsp;
## How do I modify it?

If you know what you're doing, the TypeScript files are located in the `ts` directory.

If you don't know what you're doing, ask someone that knows what they're doing to help you.

### NOTICE: YOU MUST MODIFY THE DUMP CHANNEL ID IN `ts/add.ts:51` 


&nbsp;
## I don't know what I am doing and I don't have anyone who knows either, what do I do?
I might make the bot public at some point, but if I wont, someone else probably will.