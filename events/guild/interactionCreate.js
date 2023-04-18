const Timeout = new Set()
require('dotenv').config();
const { MessageEmbed} = require('discord.js');
const humanizeDuration = require("humanize-duration");

module.exports = async(client, interaction) => {



	if (interaction.isCommand() || interaction.isContextMenu()) {
		if (!client.slash.has(interaction.commandName)) return;
		if (!interaction.guild) return interaction.reply({content: "Slash commands can only be used in a server."});

		const command = client.slash.get(interaction.commandName)
		try {
			if(command.dev) {
				if(interaction.user.id !== process.env.DEV) {
					return interaction.reply({content: "You aren't allowed to run this command", ephemeral: true})
				}
			}

			if (command.timeout) {
				if (Timeout.has(`${interaction.user.id}${command.name}`)) {
					const embed = new MessageEmbed()
						.setDescription(`You need to wait **${humanizeDuration(command.timeout, {round: true})}** to use command again`)
						.setColor('#ff0000')
					return interaction.reply({embeds: [embed], ephemeral: true})
				}
			}
		
			if (command.permissions) {
				if (!interaction.member.permissions.has(command.permissions)) {
					const embed = new MessageEmbed()
						.setTitle('You\'re missing permissions!')
						.setThumbnail(interaction.member.user.avatarURL({dynamic: true}))
						.setDescription(`<:3595failed:926715200172867624> You need \`${command.permissions}\` to use this command`)
						.setColor('#ff0000')
						.setTimestamp()
					return interaction.reply({embeds: [embed], ephemeral: true})
				}
			}

			command.run(interaction, client);
			Timeout.add(`${interaction.user.id}${command.name}`)
			setTimeout(() => {
				Timeout.delete(`${interaction.user.id}${command.name}`)
			}, command.timeout);
		} catch (error) {
			console.log(`[ Error ] `.red + error)
			return await interaction.reply({content: ':x: There was an error while executing this command!', ephemeral: true});
		}

	}
} 
