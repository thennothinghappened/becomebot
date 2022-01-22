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
    console.log('The bot is ready.'.bgBlue+'\nType \'help\' for help.');

    // Get user input
    getUserCommand();
});

// Setup listening
let channel = false;
let hear_bots = true;

// Incoming messages should be saved.
client.on('messageCreate', async msg => {
    
    // Exclude bot messages if we have those disabled.
    if (!hear_bots && msg.author.bot && msg.author != client.user) return;
    // Check that the channel is where we are.
    if (msg.channel != channel) return;

    // Return the message to the console.
    console.log(`${msg.author.tag}`.blue+`${msg.author.bot ? '[BOT]' : ''}: ${msg.content}`);
});

client.login(token);

// Handle input from user.
getUserCommand = async () => {
    try {
        let str = await prompt('');

        // Get command without args.
        let seperator = str.indexOf(' ');
        let cmd = str.substr(0, seperator == -1 ? str.length : seperator);
        
        // Vice versa.
        let args = '';
        if (seperator != -1) {
            args = str.substr(seperator+1, str.length-seperator);
        }

        // Find the command given
        switch (cmd) {
            case '': break;
            case 'send':
                // Send a message to the current channel.
                if (channel == false) {
                    console.log('Not in a channel.'.red);
                    break;
                }

                if (args == '') {
                    console.log('Usage: send <message>'.red);
                    break;
                }

                console.log(`Trying to send message '${args}'`);
                await channel.send(args);
                

                break;
            case 'list':
                // List all servers and their channels.
                let clientguilds = client.guilds.cache;
                
                // Return list of servers
                console.log(clientguilds.map(g => {
                    return `\nServers:\n${g.name}: ${g.id}\n⮩${
                        // Get the channels
                        g.channels.cache.filter(c => {
                            // Make sure we are listing a text channel.
                            return (c.type == 'GUILD_TEXT')
                        }).map(c => {
                            return `${c.name}: ${c.id}`;
                        }).join('\n⮩')
                    }`;
                }).join('\n\n'));

                break;
            case 'goto':
                // Go to a channel by the ID.
                if (args == '') {
                    console.log('Usage: goto <channel-id>'.red);
                    break;
                }

                let new_channel = client.channels.cache.get(args);
                if (new_channel == undefined) {
                    console.log('Failed to find channel!'.red);
                    break;
                }
                
                channel = new_channel;
                console.log(`Now in channel ${channel.name} (server '${channel.guild}')`.green);

                break;
            case 'channel':
                // Get the name of the channel and server.
                if (channel == false) {
                    console.log('Not in a channel.'.red);
                    break;
                }

                console.log(`In channel ${channel.name} (server ${channel.guild})`.green);

                break;
            case 'togglebots':
                // Toggle whether messages from bots should be read.
                hear_bots = !hear_bots;
                console.log(`Messages from bots now ${hear_bots ? 'Enabled' : 'Disabled'}`.green);

                break;
            case 'exit':
                process.exit(0);

            default:
                console.log('\nCommands:\nhelp: Display this message\nsend: Send a message in the current channel\nlist: List all channels the bot is in\ngoto: Go to a channel by id\nchannel: Name the current channel and server\ntogglebots: Enable/Disable bot messages being listened to\nexit: Close the program\n');
                break;
        }

    } catch(e) {
        console.error('Failed to prompt user.'.red, e);
    }

    getUserCommand();
}