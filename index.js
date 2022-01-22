const { Client, Intents, GuildAuditLogsEntry } = require('discord.js');
const { token } = require('./config.json');

const colours = require('colors');
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));

// Setup the intents
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

client.once('ready', () => {
    client.user.setPresence({
        status: 'online',
    });
    console.log('The bot is ready.'.bgBlue);

    // Load channel list
    console.log(JSON.stringify(client.guilds));

    // Get user input
    getUserCommand();
});

// Incoming messages should be saved.
client.on('messageCreate', async msg => {
    // Check we aren't just seeing our own message.
    if (msg.author.id == client.user) return;

    console.log(`Message from ${msg.author.bot ? 'bot' : "user"}: ${msg.author.username},\n${msg.content}`);
    await msg.channel.send('cheese')
});

client.login(token);

// Handle input from user.
getUserCommand = async () => {
    try {
        let cmd = await prompt('> ');

        switch (cmd.toLowerCase()) {
            case '': break;
            case 'send':
                // TODO
                break;
            case 'list':
                // TODO
                break;
            case 'goto':
                // TODO
                break;
            case 'listen':
                // TODO
                break;
            case 'togglebots':
                // TODO
                break;
            case 'exit':
                process.exit(0);
                break;

            default:
                console.log('Commands:\nhelp: Display this message\nsend: Send a message in the current channel\nlist: List all channels the bot is in\ngoto: Go to a channel by id\nlisten: Show messages in the current channel\ntogglebots: Enable/Disable bot messages\nexit: Close the program\n');
                break;
        }
        
        getUserCommand();

    } catch(e) {
        console.error('Failed to prompt user.'.red, e);
    }
}