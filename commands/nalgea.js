const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
var list = [
  'https://c.tenor.com/Dcdf0if-PlsAAAAC/anime-school-girl.gif',
  'https://c.tenor.com/vDpHmAfgA6wAAAAC/cxz-spank.gif',
  'http://pa1.narvii.com/5792/c53f613f30bd0053e1eb561d336db90f2a02ec46_hq.gif',
  'https://c.tenor.com/B5oC9lACJ9kAAAAC/anime-spank.gif',
  'https://c.tenor.com/fgxHmZDTkrcAAAAC/anime-spanking.gif',
  'http://pa1.narvii.com/6344/599135b0db2238591bf035dfbdebc094b9a17732_00.gif',
];
module.exports={
    data: new SlashCommandBuilder() 
        .setName('spank')
        .setDescription('spank someone')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to spank')
                .setRequired(true)),
    async execute(interaction) {
        let spank = list[Math.floor(Math.random() * list.length)];
        let user=interaction.options.getUser('user')
        if(user.id===interaction.applicationId) return interaction.reply("**EH CUIDADO QUE MUERDO ...___*( ￣皿￣)/#____**")
        if(interaction.member.user.id===user.id) return interaction.reply("**VEO QUE MUCHOS AMIGOS NO TIENES.... (￣y▽,￣)╭ **")
        const embed = new MessageEmbed()
            .setTitle(user.username + " got spank for" + interaction.member.user.username, interaction.guild.iconURL({ dynamic: true, format: 'png'}))
            .setImage(spank)
            .setURL(spank)
            .setColor("RANDOM")
            .setDescription((user.toString() + " acaba de ser nalgeado por " + interaction.member.user.toString()))
            .setTimestamp()
        await interaction.reply({ embeds: [embed],fetchReply: true} );
    }        
}