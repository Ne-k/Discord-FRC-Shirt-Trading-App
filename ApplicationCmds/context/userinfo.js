const {MessageEmbed} = require("discord.js");
const fetch = require('node-fetch');
module.exports = {
    name: "userinfo",
    type: 3,
    run: async (interaction, client) => {
        const message = interaction.options.getMessage('message');
        const globaluser = await client.users.fetch(message.author.id)

        let us = await fetch(`https://japi.rest/discord/v1/user/${(await globaluser).id}`).then(res => res.json())

        let banner = us.data.bannerURL
        if(!banner) {
            banner = "https://media.discordapp.net/attachments/854794095066349618/934669695859191848/unknown.png"
        } else {
            banner = us.data.bannerURL + '?size=2048'
        }
        let flags = us.data.public_flags_array.join(' | ')
        if(flags.length > 100) {
            flags = "User has too many flags to display."
        }
        if(!flags) {
            flags = "User has no flags, or I can't find them."
        }

        return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setURL(`https://discord.com/users/${message.author.id}`)
                    .setTitle(`${(await globaluser).username}#${(await globaluser).discriminator} | ${(await globaluser).id}`)
                    .setDescription(`**Created at**: \`${require('moment')((await globaluser).createdAt).format('LLL')}\` (<t:${require('moment')((await globaluser).createdAt).format('X')}:R>)\n**User flags** \`${flags}\``)
                    .setThumbnail((await globaluser).displayAvatarURL({ dynamic: true }))
                    .setColor('#0099ff')
                    .setImage(banner)
            ],
            ephemeral: true
        })
    }
}