// const { REST } = require('@discordjs/rest');
// const { Routes } = require('discord-api-types/v9');
// require('dotenv').config();
// const { readdirSync } = require('fs');
// const path = require('path');
// require('@colors/colors');
//
//
// module.exports = async () => {
//     const commands = []
//     readdirSync("./ApplicationCmds/"
//     ).map(async dir => {
//         readdirSync(`./ApplicationCmds/${dir}/`).map(async (cmd) => {
//             commands.push(require(path.join(__dirname, `./ApplicationCmds/${dir}/${cmd}`)))
//         })
//     })
//
//     const rest = new REST({version: "9"}).setToken(process.env.TOKEN);
//     rest.put(Routes.applicationCommands("BOT ID"), { body: [] })
//         .then(() => console.log("[ Discord ]".cyan + " Successfully deleted application commands.".green))
//         .catch(console.error);
//
//     try {
//         console.log(`[ Discord ]`.cyan + ' Refreshing application commands.'.yellow);
//         await rest.put(Routes.applicationCommands("BOT ID"), {body: commands},);
//         console.log(`[ Discord ]`.cyan + ' Reloaded application commands.'.green);
//     } catch (error) {
//         console.error(error);
//     }
// }

// Whenever I have time I'll reimplement this