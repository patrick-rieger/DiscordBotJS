// Import the discord.js module
const Discord = require("discord.js");
// Import the config of config.json
const config = require("./config.json");

// Create an instance of a Discord client
const client = new Discord.Client();

// Functions
function setBotStatus() {
    client.user.setActivity(`Estou em ${client.guilds.size} seridores.`);
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

    /*
    if (command == "") {
        message.channel.send("");
    }
    */

});

client.login(config.token);