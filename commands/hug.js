const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
module.exports={
    data: new SlashCommandBuilder() 
        .setName('hug')
		.setDescription('Hug someone')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to hug')
                .setRequired(true)),
    async execute(interaction) {
        let hug = await fetch("https://nekos.life/api/hug").then(r=>r.json())
        let user=interaction.options.getUser('user')
        if(user.id===interaction.applicationId) return interaction.reply("**NO NECESITO TUS ABRASOS ＼（〇_ｏ）／**")
        if(interaction.member.user.id===user.id) return interaction.reply("**Te falta afecto como para abrazarte solo? (ノへ￣、)**")
        const embed = new MessageEmbed()
            .setTitle(user.username + " Just got a hug from " + interaction.member.user.username, interaction.guild.iconURL({ dynamic: true, format: 'png'}))
            .setImage(hug.url)
            .setURL(hug.url)
            .setColor("RANDOM")
            .setDescription((user.toString() + " got a hug from " + interaction.member.user.toString()))
            .setTimestamp()
        await interaction.reply({ embeds: [embed],fetchReply: true} );
    }        
}