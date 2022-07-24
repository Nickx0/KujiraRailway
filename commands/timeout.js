const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const ms = require("ms");

module.exports = {
    data: new SlashCommandBuilder()   
        .setName("timeout")
        .setDescription("Member to timeout")
        .addUserOption((option) => 
            option.setName("member")
            .setDescription('Persona a aplicar el timeout')
            .setRequired(true))
        .addStringOption((option) => 
            option.setName("time")
            .setDescription('Tiempo de timeout - usar ingles o poner milisegundos')
            .setRequired(true))
        .addStringOption((option) => 
            option.setName("reason")
            .setDescription('Razon del timeout')),
    async execute(interaction) {

    if(!interaction.member.permissions.has("MUTE_MEMBERS")) return interaction.reply("**NO TIENES EL PERMISO PARA USAR EL COMANDO**" );
    const member = interaction.options.getMember('member')
    const reason = interaction.options.getString('reason') || "Razon no dada."
    const time = ms(interaction.options.getString('time'))
    if(interaction.member.user.id===member.id) return interaction.reply("**NO PUEDES DARTE TIMEOUT A TI MISMO**")
    if(interaction.member.roles.highest.position <= member.roles.highest.position) return interaction.reply('El miembro que nombraste tiene igual o mas rango que tu, no es posible el timeout')
    if(!time) return interaction.reply({ content: "Dame un tiempo valido en milisegundos o usa ingles (3 hours, 2 days, etc)" });
    const embed = new MessageEmbed()
            .setDescription(`**${member.user.tag}** fue puesto en TIMEOUT por \`${reason}\``)
            .setColor("BLUE")
            .setTitle("Timeout Member")
            .setTimestamp()
    await member.user.send(`Fuiste puesto en TIMEOUT de **\`${interaction.guild.name}\`** por \`${reason}\``).catch(err => {console.log(err)})
    await member.timeout(time, reason)
    return interaction.reply({ embeds: [ embed ]})
 }
}