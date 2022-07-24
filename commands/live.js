const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const pool = require('../db-connection.js');
const {YTLive} = require("../YTlive/YTlive");
let filtro,callvtuberlist,vtLst,empresa;
module.exports={
    data: new SlashCommandBuilder() 
        .setName('live')
        .setDescription('Get lives from a company')
        .addStringOption(option =>
            option.setName('agency')
                .setDescription('Agency vtubers')
                .setRequired(false)
                .addChoices(
                    { name: 'Wactor', value: 'Wactor' },
                    { name: 'Hololive', value: 'Hololive' },
                    { name: 'Nijisanji', value: 'Nijisanji' },
                    { name: 'Independiente', value: 'Independiente' },
                    { name: 'Vshojo', value: 'Vshojo' },
                    { name: 'NT Proyect', value: 'Natamo Proyect' },
                    { name: 'Amai Direct', value: 'Amai Direct' },
                    { name: 'CyberLive', value: 'Cyberlive' },
                    { name: 'Vee', value: 'VEE' },
                )),       
    async execute(interaction) {
        await interaction.deferReply()
        let ag=interaction.options.getString('agency')
        vtLst=''
        empresa=0
        filtro=(ag!==null)? `and e.nombre = '${ag}' `:'';
        callvtuberlist='SELECT DISTINCT e.id_empresa,v.nombre,e.logo_dc,v.channelid,v.id_vtuber,e.nombre as empresa FROM kujiraBot.empresa e inner join kujiraBot.vtuberlist v on v.id_empresa=e.id_empresa inner join kujiraBot.video f on f.id_vtuber=v.id_vtuber where f.estado=1 '+filtro+'ORDER BY e.id_empresa';
        let key = await pool.query(callvtuberlist);
        for(let i=0;i<key.length;i++){
            try{
                let live = new YTLive({channelId: key[i].channelid});
                await live.getLiveData();
                if(live.isLiveNow()){
                    console.log(`GLIVE: ${key[i].nombre}`)
                    if(empresa!==key[i].id_empresa){
                        vtLst+=`\n**${key[i].empresa}** ${key[i].logo_dc}\n`;
                        empresa=key[i].id_empresa;
                    }
                    vtLst+=` > ${key[i].nombre} LIVE\n`;
                }
            }catch(e){
                console.log()
            }
        }
        vtLst=(vtLst=='')? 'No hay lives':vtLst;
        const embed = new MessageEmbed()
            .setTitle(`Vtubers ${(ag!==null)?` De ${key[0].empresa}`:''} En Directo`)
            .setDescription(vtLst)
            .setTimestamp()
        await interaction.editReply({ embeds: [embed]})
    }
}