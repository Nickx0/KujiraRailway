const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports={
    data: new SlashCommandBuilder()
        .setName('catmoji')
		.setDescription('Get a random emoji cat'),
    async execute(interaction) {
        let cat = await fetch("https://nekos.life/api/v2/cat").then(r=>r.json())
        await interaction.reply({ content:`${cat.cat}`,fetchReply: true} );
    }
}