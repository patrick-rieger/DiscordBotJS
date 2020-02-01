// Import the discord.js module
const Discord = require("discord.js");
// Import the config of config.json
const config = require("./config.json");

// Extract the required classes from the discord.js module
const { Client, RichEmbed } = require('discord.js');

// Create an instance of a Discord client
const client = new Client();

// Functions
function setBotStatus() {
    client.user.setActivity(`Estou em ${client.guilds.size} servidores.`);
}

function createSheet() {
    const embed = new RichEmbed()
        .setColor('#0099ff')
        .setTitle('Teste')
        .setURL('https://discord.js.org/')
        .setAuthor('Nome')
        .setDescription('Some description here')
        .addField('Regular field title', 'Some value here')
        .addBlankField()
        .addField('Inline field title', 'Some value here', true)
        .addField('Inline field title', 'Some value here', true)
        .setFooter('© Copyright')
        .setTimestamp();
        return embed;
}

/* 
    The ready event is vital, it means that only 
    _after_ this will your bot start reacting to information
*/
client.on("ready", () => {
    console.log(
        `Bot "${client.user.tag}" foi iniciado, com ${client.users.size} usuários, ` +
        `em ${client.channels.size} canais, ` +
        `em ${client.guilds.size} servidores.`);
    setBotStatus();
});

// Event for when the bot enter in a server
client.on("guildCreat", guild => {
    console.log(`O bot entrou no servidor: ${guild.name}` +
        `(id: ${guild.id}). População: ${guild.memberCount} membros!`);
    setBotStatus();
});

// Event for when remove the bot from a server
client.on("gulidDelete", guild => {
    console.log(`O bot foi removido do servidor: ${guild.name} (id: ${guild.id})`);
    setBotStatus();
});

// Create an event listener for messages
client.on("message", async message => {

    if (message.author.bot) return; // Doens't respond another bot
    if (message.channel.type === "dm") return; // Doesn't respond Direct Messages
    if (!message.content.startsWith(config.prefix)) return; // Doesn't respond messages that aren't COMMANDS

    const command = message.content.slice(config.prefix.length).toLowerCase();

    // PING COMMAND
    if (command === "ping") {
        const m = await message.channel.send("Ping?");
        return m.edit(`Pong! A Latência é ${m.createdTimestamp - message.createdTimestamp}ms. A Latencia da API é ${Math.round(client.ping)}ms`);
    }

    if (command == "start") {
        var server = message.guild;

        // Doesn't let you start if you already have one in progress
        let started = server.channels.find(c => c.name == `${message.author.username.toLowerCase()}`);
        if (started) return message.channel.send(`Criação de ficha em andamento!! ${started}`);

        // Create a text channel where the character sheet will be built
        var createdChannel = await server.createChannel(`${message.author.username}`, {
            type: 'text',
            permissionOverwrites: [{
                id: server.id,
                deny: ['MANAGE_MESSAGES', 'SEND_MESSAGES']
            }]
        });

        // Search for a category "FICHAS"
        let category = server.channels.find(c => c.name == "FICHAS" && c.type == "category");
        // Create if doesn't find
        if (!category) server.createChannel("FICHAS", "category");

        // So put the created channel in the "FICHAS" category
        createdChannel.setParent(category.id);

        // Create a embed (that will be the sheet)
        sheet = createSheet();
        // And send it in the channel
        createdChannel.send(sheet);

        return message.channel.send(`${message.author}, sua ficha foi iniciada em ${createdChannel}`);
    }

    /*
    if (command == "") {
        message.channel.send("");
    }
    */

});

client.login(config.token);