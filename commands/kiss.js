const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
var list = [
    'https://https://i.pinimg.com/originals/6e/4f/fe/6e4ffe54a38656cda96ba3eec67c84b4.gif.imgur.com/S8yQ9As.gif',
    'https://pa1.narvii.com/6173/d3da59e3ac5fd46d87b5f818cf171f48edc7560a_hq.gif',
    'https://k33.kn3.net/taringa/2/1/6/5/7/4/06/em0xx/39F.gif',
    'https://i.pinimg.com/originals/49/7a/55/497a5523d9b1ca23db84ecc3f5d8b1b3.gif',
    'https://66.media.tumblr.com/2c0afb2bce3dea809f5e9dd283dc459b/tumblr_oh2v64hpfy1tlmyzco1_500.gif',
    'http://pa1.narvii.com/6115/d956e6cdfcb94780993afc12a7be993cf6160ea5_00.gif',
    'https://i.pinimg.com/originals/ed/32/69/ed32698a1bb485b468cc99ddee945262.gif',
    'https://i.pinimg.com/originals/fd/72/35/fd7235ee48694b601d7bca43fbf73709.gif',
];
module.exports={
    data: new SlashCommandBuilder() 
        .setName('kiss')
        .setDescription('kiss someone')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to kiss')
                .setRequired(true)),
    async execute(interaction) {
        let kiss = list[Math.floor(Math.random() * list.length)];
        let user=interaction.options.getUser('user')
        if(user.id===interaction.applicationId) return interaction.reply("**NO ME BESES ...(*￣０￣)ノ**")
        if(interaction.member.user.id===user.id) return interaction.reply("**ERES GAY? (っ °Д °;)っ**")
        const embed = new MessageEmbed()
            .setTitle(user.username + " fue besado por " + interaction.member.user.username, interaction.guild.iconURL({ dynamic: true, format: 'png'}))
            .setImage(kiss)
            .setURL(kiss)
            .setColor("RANDOM")
            .setDescription((user.toString() + " acaba de ser besado por " + interaction.member.user.toString()))
            .setTimestamp()
        await interaction.reply({ embeds: [embed],fetchReply: true} );
    }        
}