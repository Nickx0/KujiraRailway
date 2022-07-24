const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
var list = [
    'https://c.tenor.com/jyv9sexi1fYAAAAC/anime-lick.gif',
    'https://c.tenor.com/Xb1u2Z6nLRQAAAAC/lick-anime.gif',
    'https://64.media.tumblr.com/12f9c633304e9f349fdb272126d5aa61/tumblr_nogm6mQ68z1uo77uno2_r1_540.gif',
    'https://c.tenor.com/v74xZG0A384AAAAC/anime-lick.gif',
    'https://c.tenor.com/aVvEuNDaZuYAAAAd/lick-anime.gif',
    'https://c.tenor.com/rWtIltahEoAAAAAC/kawaii-lick.gif',
    'https://c.tenor.com/-jl-FNtEIS8AAAAC/anime-lick.gif'
];
module.exports={
    data: new SlashCommandBuilder() 
        .setName('lick')
        .setDescription('lick someone')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to lick')
                .setRequired(true)),
    async execute(interaction) {
        let lick = list[Math.floor(Math.random() * list.length)];
        let user=interaction.options.getUser('user')
        if(user.id===interaction.applicationId) return interaction.reply("**NO ME LAMAS ...(*￣０￣)ノ**")
        if(interaction.member.user.id===user.id) return interaction.reply("**QUE RAROS GUSTOS TIENES (っ °Д °;)っ**")
        const embed = new MessageEmbed()
            .setTitle(user.username + " fue lamido por " + interaction.member.user.username, interaction.guild.iconURL({ dynamic: true, format: 'png'}))
            .setImage(lick)
            .setURL(lick)
            .setColor("RANDOM")
            .setDescription((user.toString() + " acaba de ser lamido por " + interaction.member.user.toString()))
            .setTimestamp()
        await interaction.reply({ embeds: [embed],fetchReply: true} );
    }        
}