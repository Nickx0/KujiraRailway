const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');
var list = [
    'https://c.tenor.com/CvBTA0GyrogAAAAC/anime-slap.gif',
    'https://c.tenor.com/iQ6cTO57hWMAAAAC/slap-anime.gif',
    'https://c.tenor.com/AzIExqZBjNoAAAAC/anime-slap.gif',
    'https://c.tenor.com/GBShVmDnx9kAAAAC/anime-slap.gif',
    'https://c.tenor.com/PcYzzmhxGhkAAAAC/horse-slap.gif',
    'https://c.tenor.com/5eI0koENMAAAAAAC/anime-hit.gif',
  ];
module.exports={
    data: new SlashCommandBuilder() 
    .setName('slap')
		.setDescription('slap someone')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to slap')
                .setRequired(true)),
    async execute(interaction) {
        let slap= list[Math.floor(Math.random() * list.length)];
        let user=interaction.options.getUser('user')
        if(user.id===interaction.applicationId) return interaction.reply("**EH, QUE A MI NO ￣へ￣**")
        if(interaction.member.user.id===user.id) return interaction.reply("**SI QUIERES YO TE PEGO? (⊙x⊙;)**")
        const embed = new MessageEmbed()
            .setTitle(user.username + " Just got a slap from " + interaction.member.user.username, interaction.guild.iconURL({ dynamic: true, format: 'png'}))
            .setImage(slap)
            .setURL(slap)
            .setColor("RANDOM")
            .setDescription((user.toString() + " got a slap from " + interaction.member.user.toString()))
            .setTimestamp()
        await interaction.reply({ embeds: [embed],fetchReply: true} );
    }        
}
