const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require("node-fetch");
const apikey = process.env.APIKEY;
const pool = require('../db-connection.js');
function convertMS(ms) {
    var duracion = new Date(ms)
    var horas = duracion.getHours()
    var minutos = duracion.getMinutes()
    var segundos = duracion.getSeconds()
    return ((horas<10)?'0'+horas:horas)+':'+((minutos<10)?'0'+minutos:minutos)+':'+((segundos<10)?'0'+segundos:segundos)
}
module.exports = {
	data: new SlashCommandBuilder()
		.setName('time')
		.setDescription('Get time from stream'),
	async execute(interaction) {
        await interaction.deferReply();
        let channel = interaction.channelId;
        let callvtuberkey = `select a.canal_alerta_key,v.id_vtuber
        from canal_alerta a 
        inner join vtuberlist v
        on a.id_canal_alerta = v.id_canal_alerta
        Where a.canal_alerta_key = '${channel}'`;
        let key = await pool.query(callvtuberkey);
        console.log(key)
        if(key.length!==1) return interaction.editReply("Opcion no disponible en este canal");
        let selId_vtuber = `SELECT * FROM kujiraBot.video WHERE id_vtuber=${key[0].id_vtuber} and estado = 1 ORDER BY id_videos DESC;`;
        let urlvideos = await pool.query(selId_vtuber);
        if(urlvideos.length==0) return interaction.editReply("No esta en vivo ahora...");  
        let apiurl = "https://www.googleapis.com/youtube/v3/videos?part=snippet,liveStreamingDetails&fields=items(snippet(liveBroadcastContent),liveStreamingDetails(actualStartTime))&id="+urlvideos[0].id_video+"&key="+apikey;
        console.log(apiurl);
        const apirl = await fetch(apiurl);
        const r = await apirl.json();
        if(r.items.length==0) return interaction.editReply("No esta en vivo ahora...");
        let starmili = r.items[0].liveStreamingDetails.actualStartTime;
        let utcmili = new Date().toISOString();
        starmili = new Date(starmili);
        starmili = starmili.getTime();  
        utcmili = new Date(utcmili);
        utcmili = utcmili.getTime(); 
        let result=utcmili-starmili;
        let timestr = "Lleva "+convertMS(result);
        interaction.editReply(timestr);
    },
};