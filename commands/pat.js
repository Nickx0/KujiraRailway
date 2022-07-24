const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
var list = [
    'https://c.tenor.com/N41zKEDABuUAAAAC/anime-head-pat-anime-pat.gif',
    'https://c.tenor.com/-hkJYNs7tUkAAAAC/anime-pat.gif',
    'https://i.pinimg.com/originals/d7/c3/26/d7c326bd43776f1e0df6f63956230eb4.gif',
    'https://c.tenor.com/Fxku5ndWrN8AAAAC/head-pat-anime.gif',
    'https://i.pinimg.com/originals/e3/e2/58/e3e2588fbae9422f2bd4813c324b1298.gif',
    'https://c.tenor.com/lVsnDFq21W8AAAAC/pat-head-anime.gif',
  ];
module.exports={
    data: new SlashCommandBuilder() 
    .setName('pat')
		.setDescription('pat someone')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to pat')
                .setRequired(true)),
    async execute(interaction) {
        let pat= list[Math.floor(Math.random() * list.length)];
        let user=interaction.options.getUser('user')
        if(user.id===interaction.applicationId) return interaction.reply("**NO NECESITO TUS CARIÑOS ￣へ￣**")
        if(interaction.member.user.id===user.id) return interaction.reply("**Creo que nececitas a alguien.. (⊙x⊙;)**")
        const embed = new MessageEmbed()
            .setTitle(user.username + " Just got a pat from " + interaction.member.user.username, interaction.guild.iconURL({ dynamic: true, format: 'png'}))
            .setImage(pat)
            .setURL(pat)
            .setColor("RANDOM")
            .setDescription((user.toString() + " got a pat from " + interaction.member.user.toString()))
            .setTimestamp()
        await interaction.reply({ embeds: [embed],fetchReply: true} );
    }        
}