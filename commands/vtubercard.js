const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const pool = require('../db-connection.js');
const ytch = require('yt-channel-info');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('vtuber')
		.setDescription('Responde con la info de vtuber')
        .addStringOption(option =>
            option.setName('vtuber')
                .setDescription('ingresa un nombre de vtuber')
                .setRequired(false)),
	async execute(interaction) {
        await interaction.deferReply();
        let vtuber = interaction.options.getString('vtuber');
        if(vtuber==null){
            let callvtuberlist='SELECT e.id_empresa,v.nombre,e.logo_dc,e.nombre as empresa FROM kujiraBot.empresa e inner join kujiraBot.vtuberlist v on v.id_empresa=e.id_empresa ORDER BY e.id_empresa;'
            var vtLst='';
            let key = await pool.query(callvtuberlist);
            var empresa = 0; 
            key.forEach(element => {
                if(empresa!==element.id_empresa){
                    vtLst+=`\n**${element.empresa}** ${element.logo_dc}\n`;
                    empresa = element.id_empresa;
                }
                vtLst+=` > ${element.nombre}\n`
            });
            const list = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Vtuber En Lista')
            .setDescription(vtLst)
            .setTimestamp()
            interaction.editReply({ embeds: [list] });
        }else{
            let uniqevt = `SELECT v.nombre,v.channelid,v.twitter,c.value_color,e.nombre as empresa,e.logo FROM kujiraBot.vtuberlist v inner join kujiraBot.colores c on c.id_color=v.id_color inner join kujiraBot.empresa e on e.id_empresa=v.id_empresa where v.nombre like '%${vtuber}%'`;
            let keyvt = await pool.query(uniqevt);
            if(keyvt.length==0) return interaction.editReply("Esa vtuber no existe o lo escribiste mal, usa solo una parte de su nombre...");
            console.log(keyvt[0])
            ytch.getChannelInfo(keyvt[0].channelid).then((response) => {
                let vtuberEmb = new MessageEmbed()
                .setTitle(`${response.author}`)
                .setImage(response.authorBanners[0].url)
                .setThumbnail(keyvt[0].logo)
                .setDescription(`${(response.subscriberCount)/1000}K Suscriptores`)
                .setColor(keyvt[0].value_color)
                .addFields(
                    { name: '<:gatoem:952335362624208956>Empresa', value: `${keyvt[0].empresa}`, inline: true },
                    { name: '<:twitter:952335362028613632>Twitter', value: `[Cuenta](${keyvt[0].twitter} 'optional hovertext')` , inline: true },
                    { name: '<:yt:952335362192187452>Youtube', value: `[Canal](https://www.youtube.com/channel/${keyvt[0].channelid} 'optional hovertext')` , inline: true },
                )
                .setTimestamp()
                .setURL(response.authorUrl);
                interaction.editReply({ embeds: [vtuberEmb] });
            }).catch((err) => {
                console.error(err);
                interaction.editReply({embeds: [{
                    color: 16734039,
                    description: "Algo salio mal... :cry:"}]})
            })
        }
	},
};