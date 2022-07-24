const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
module.exports={
    data: new SlashCommandBuilder() 
        .setName('ban')
		.setDescription('ban someone from the server')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to ban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the ban')
                .setRequired(false)),
    async execute(interaction) {
        if (!interaction.member.permissions.has("BAN_MEMBERS")) return interaction.reply("**NO TIENES EL PERMISO PARA USAR EL COMANDO**");
        const user=interaction.options.getUser('user')
        const reason = interaction.options.getString('reason') || "Razon no dada."
        const member = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch(user.id).catch(err => {console.log(err)})
        if(member==undefined) return interaction.reply("😅 | No hay detalles de este miembro.");
        if(interaction.member.user.id===user.id) return interaction.reply("**NO PUEDES BANEARTE A TI MISMO**")
        if(interaction.member.roles.highest.position <= member.roles.highest.position) return interaction.reply('El miembro que nombraste tiene igual o mas rango que tu, no es posible el ban')
        const embed = new MessageEmbed()
            .setDescription(`**${member.user.tag}** fue BANEADO por \`${reason}\``)
            .setColor("RED")
            .setTitle("Ban Member")
            .setTimestamp()
        await member.user.send(`Fuiste BANEADO de **\`${interaction.guild.name}\`** por \`${reason}\``).catch(err => {console.log(err)})
        member.ban({ reason })
        return interaction.reply({ embeds: [ embed ]})
    }   
}