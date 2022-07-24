const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const client = require('nekos.life');
const neko = new client();
module.exports={
    data: new SlashCommandBuilder() 
    .setName('slap')
		.setDescription('slap someone')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to slap')
                .setRequired(true)),
    async execute(interaction) {
        let slap = await neko.slap()
        let user=interaction.options.getUser('user')
        if(user.id===interaction.applicationId) return interaction.reply("**EH, QUE A MI NO ￣へ￣**")
        if(interaction.member.user.id===user.id) return interaction.reply("**SI QUIERES YO TE PEGO? (⊙x⊙;)**")
        const embed = new MessageEmbed()
            .setTitle(user.username + " Just got a slap from " + interaction.member.user.username, interaction.guild.iconURL({ dynamic: true, format: 'png'}))
            .setImage(slap.url)
            .setURL(slap.url)
            .setColor("RANDOM")
            .setDescription((user.toString() + " got a slap from " + interaction.member.user.toString()))
            .setTimestamp()
        await interaction.reply({ embeds: [embed],fetchReply: true} );
    }        
}