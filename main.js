const Discord = require('discord.js');
const { RichEmbed } = require('discord.js');
const config = require('./config.json');
const moment = require('moment');
const tz = require('moment-timezone');

const prefix = config.prefix;

const client = new Discord.Client()

client.on("ready", () => {
    console.log(`Client: ${client.user.username}.`)
    console.log("ready!");

    client.user.setActivity("commands 🛠", { type: "STREAMING", url: "https://www.twitch.tv/InklingSplasher" });
    client.user.setStatus("idle");
})

client.on('message', message => {
    if(message.content.includes(["https://"])) {
        message.delete();
    }
})

client.on("message", async message => {
    if (message.author.bot) return; 
    if (message.channel.type === "dm") return; 
    if (message.content.indexOf(config.prefix) !== 0) return;

    const timestamp = new moment(message.createdAt).tz("Europe/Berlin").format('MMMM Do YYYY, H:mm');
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if(command === "promotebot" || command === "botpromoting") {
        if(!message.guild.channels.find("name", `botpromoting-${message.author.id}`)) {
            const cchannel = await message.guild.createChannel(`botpromoting-${message.author.id}`);
            const evyrole = message.guild.roles.find('name', "@everyone");
            await cchannel.setParent('580463908448501788')
            const embed = new RichEmbed()
            .setTitle('BOT PROMOTING')
            .setDescription('Please write the application channel the Bot ID, Bot Invite [[Create Invite API](https://discordapi.com/permissions.html)] and an info about your bot. When you are done, run the command `?done`.')
            .setFooter(client.user.username, client.user.avatarURL)
            .setColor('GREEN')
            .setTimestamp();
            cchannel.send(embed)
            cchannel.overwritePermissions(message.author, {
                SEND_MESSAGES: true,
                VIEW_CHANNEL: true
            });
            client.channels.find("name", `botpromoting-${message.author.id}`).overwritePermissions(evyrole, {
                SEND_MESSAGES: false,
                VIEW_CHANNEL: false
            });
        } else {
            client.channels.find("name", `botpromoting-${message.author.id}`).overwritePermissions(message.author, {SEND_MESSAGES: true});
            const ee = new RichEmbed()
            .setTitle('Okay.')
            .setDescription("You can now edit your application.")
            .setColor('GREEN')
            .setFooter(message.author.username, message.author.avatarURL)
            .setTimestamp();
            message.channel.send(ee);
        }
    }
    if(command === "done") {
            const ps = client.channels.find("name", `botpromoting-${message.author.id}`).permissionOverwrites.get(message.author.id);
            const embed = new RichEmbed() 
            .setTitle('ERROR')
            .setDescription('You don\'t have a Bot Promoting Channel')
            .setColor('RED')
            .setFooter(message.author.username, message.author.avatarURL)
            .setTimestamp();
            if(ps && ps.SEND_MESSAGES === false) message.channel.send(embed)
            else {
                await client.channels.find("name", `botpromoting-${message.author.id}`).overwritePermissions(message.author, {SEND_MESSAGES: false});
                return message.author.send("Thank you for your application. We will have a look at your bot!");
            }
    }
})


client.login(config.token);