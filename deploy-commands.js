
const { REST } = require('@discordjs/rest');
const  chalk = require('chalk');
const { Routes } = require('discord-api-types/v9');
const clientId =process.env.CLIENDID
const guildId =process.env.GUILDID
const token =process.env.TOKEN  
const fs = require('fs');

const commands = []
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		console.log(chalk.blue("Loading commands..."));
		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);
		console.log(chalk.blue("Successfully commands Loading "));
	} catch (error) {
		console.error(error);
	}
})();