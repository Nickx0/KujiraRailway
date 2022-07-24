const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const client = require('nekos.life');
const neko = new client();
module.exports={
    data: new SlashCommandBuilder() 
    .setName('pat')
		.setDescription('pat someone')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to pat')
                .setRequired(true)),
    async execute(interaction) {
        let pat = await neko.pat()
        let user=interaction.options.getUser('user')
        if(user.id===interaction.applicationId) return interaction.reply("**NO NECESITO TUS CARIÑOS ￣へ￣**")
        if(interaction.member.user.id===user.id) return interaction.reply("**Creo que nececitas a alguien.. (⊙x⊙;)**")
        const embed = new MessageEmbed()
            .setTitle(user.username + " Just got a pat from " + interaction.member.user.username, interaction.guild.iconURL({ dynamic: true, format: 'png'}))
            .setImage(pat.url)
            .setURL(pat.url)
            .setColor("RANDOM")
            .setDescription((user.toString() + " got a pat from " + interaction.member.user.toString()))
            .setTimestamp()
        await interaction.reply({ embeds: [embed],fetchReply: true} );
    }        
}