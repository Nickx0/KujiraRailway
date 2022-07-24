const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
module.exports={
    data: new SlashCommandBuilder() 
        .setName('kick')
		.setDescription('kick someone from the server')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to kick')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the kick')
                .setRequired(false)),
    async execute(interaction) {
        if (!interaction.member.permissions.has("KICK_MEMBERS")) return interaction.reply("**NO TIENES EL PERMISO PARA USAR EL COMANDO**");
        const user=interaction.options.getUser('user')
        const member = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch(user.id).catch(err => {console.log(err)})
        if(member==undefined) return interaction.reply("😅 | No hay detalles de este miembro.");
        if(interaction.member.user.id===user.id) return interaction.reply("**NO PUEDES KICK A TI MISMO**")
        const reason = interaction.options.getString('reason') || "Razon no dada."
        if(interaction.member.roles.highest.position <= member.roles.highest.position) return interaction.reply('El miembro que nombraste tiene igual o mas rango que tu, no es posible el kick')
        const embed = new MessageEmbed()
            .setDescription(`**${member.user.tag}** fue kickeado por \`${reason}\``)
            .setColor("GREEN")
            .setTitle("Kick Member")
            .setTimestamp()
        await member.user.send(`Fuiste kickeado de **\`${interaction.guild.name}\`** por \`${reason}\``).catch(err => {console.log(err)})
        member.kick({ reason })
        return interaction.reply({ embeds: [ embed ]})
    }   
}