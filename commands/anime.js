const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const malScraper = require('mal-scraper');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('anime')
		.setDescription('Get info about specific anime')
        .addStringOption(option =>
            option.setName('anime')
                .setDescription('Name of the anime')
                .setRequired(true)),
    async execute(interaction) {
        let name=interaction.options.getString('name')
        let x = await malScraper.getInfoFromName(name)
        if(x){
            const embed = new MessageEmbed()
                .setImage(x.picture)
                .setColor("RANDOM")
                .addField(":flag_gb: Titulo Ingles", x.englishTitle)
                .addField(":flag_jp: Titulo japones", x.japaneseTitle)
                .addField(":book: Formato", x.type)
                .addField(":1234: Episodios", x.episodes)
                .addField(":star2: Categorias", x.rating)
                .addField(":calendar_spiral: Transmisiones", x.aired)
                .addField(":star: Puntaje", x.score)
                .addField(":bar_chart: Stats", x.scoreStats)
                .addField(":link: Link", x.url)
                .setTimestamp()
            await interaction.reply({ embeds: [embed],fetchReply: true} );
        }else{
            await interaction.reply({ content:`Ese anime no existe`,fetchReply: true} );
        }
    }
}