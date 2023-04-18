const { Client, Intents, Collection, MessageEmbed, MessageButton, MessageActionRow} = require('discord.js'),
    client = new Client({
        disableMentions: "everyone",
        intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS],
    })
require('dotenv').config()
const { google } = require('googleapis');
const sheets = google.sheets('v4');
const formResponsesChannelId = process.env.DISCORD_CHANNEL_ID;
let lastTimestamp = new Date().getTime();
let savedRows = [];
let currentIndex = 0;

const spreadsheetID = process.env.GOOGLE_SPREADSHEET_ID

client.commands = new Collection();
client.invites = new Map()
client.snipe = new Map();
client.slash = new Collection();
client.aliases = new Collection();
[ "events", "slash"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});


async function checkFormResponses() {
    const auth = new google.auth.GoogleAuth({
        keyFile: '../Path/to/Keyfile.json',
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const request = {
        spreadsheetId: spreadsheetID,
        range: 'Form Responses 1!A2:E',
        auth,
    };
    try {
        const response = (await sheets.spreadsheets.values.get(request)).data;
        const rows = response.values;
        if(!rows) return;
        if (rows.length) {
                const row = rows[rows.length - 1];
                const timestamp = new Date(row[0]).getTime();
                if ((!lastTimestamp || timestamp > lastTimestamp) && !isNaN(timestamp)) {

                    const acceptButton = new MessageButton()
                        .setCustomId(`acceptTrade-${currentIndex}`)
                        .setLabel("Accept Trade")
                        .setStyle("SUCCESS");

                    const interactionRow = new MessageActionRow().addComponents(acceptButton);

                    const thread = client.channels.cache.get(formResponsesChannelId).threads.create({
                        name: "Shirt trading with " + row[1].substring(0, 81),
                        reason: "New shirt trading request",
                    });
                    thread.then((thread) => {
                        thread.join();
                        thread.send({
                            content: "New shirt trading request from " + row[1].substring(0, 70) + "!",
                            embeds: [
                                new MessageEmbed()
                                    .setTitle("Shirt trading request")
                                    .setColor("GREEN")
                                    .setDescription(`\`${row[1].substring(0, 100)}\` wants to trade \`${row[2].substring(0, 100)}\` for a \`${row[3].substring(0, 100)}\`!`)
                                    .setFooter({
                                        text: "Click the button below only when you're sure you want to trade with this person.",
                                    }),
                            ],
                            components: [interactionRow],
                        });
                    });
                    savedRows.push(row);
                    currentIndex++;
                    lastTimestamp = timestamp;
                }
        }
    } catch (err) {
        console.error("The API returned an error: " + err);
    }
}

setInterval(checkFormResponses, 5000);


client.on("interactionCreate", async (interaction) => {
    const [customId, index] = interaction.customId.split('-');
    if (interaction.isButton()) {
        switch (customId) {
            case 'acceptTrade':
                const tradedButton = new MessageButton()
                    .setLabel('Someone has already traded with this person')
                    .setCustomId('Balls in my mouth')
                    .setDisabled(true)
                    .setStyle('DANGER');
                interaction.update({
                    components: [new MessageActionRow().addComponents(tradedButton)],
                });
                const finishTradeButton = new MessageButton()
                    .setLabel("Finish Trade [not working]")
                    .setCustomId(`finishTrade-${currentIndex}`)
                    .setStyle("SUCCESS")
                await interaction.user.send({
                    embeds: [
                        new MessageEmbed()
                            .setTitle('Contact Information')
                            .setDescription(
                                `Here is ${savedRows[currentIndex - 1][1]}'s contact information: \n \`${savedRows[currentIndex - 1][4]}\``
                            )
                            .setFooter({
                                text: "When you're done, press the red button below to close the trading thread.",
                            }),
                    ],
                    components: [new MessageActionRow().addComponents(finishTradeButton)],
                });
                break;
        }
    }
})
client.login(process.env.TOKEN)













