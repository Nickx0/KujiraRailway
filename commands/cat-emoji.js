const client = require('nekos.life');
const { SlashCommandBuilder } = require('@discordjs/builders');
const neko = new client();
module.exports={
    data: new SlashCommandBuilder()
        .setName('catmoji')
		.setDescription('Get a random emoji cat'),
    async execute(interaction) {
        let cat = await neko.catText()
        await interaction.reply({ content:`${cat.cat}`,fetchReply: true} );
    }
}