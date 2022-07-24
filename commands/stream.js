const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fetch = require("node-fetch");
const apikey = process.env.APIKEY;
const pool = require('../db-connection.js');
function parseDurationString(durationString){
    var stringPattern = /^PT(?:(\d+)D)?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d{1,3})?)S)?$/;
    var stringParts = stringPattern.exec( durationString );
    return (((( stringParts[1] === undefined ? 0 : stringParts[1]*1 )  /* Days */
                 * 24 + ( stringParts[2] === undefined ? 0 : stringParts[2]*1 ) /* Hours */
               )* 60 + ( stringParts[3] === undefined ? 0 : stringParts[3]*1 ) /* Minutes */
             )* 60 + ( stringParts[4] === undefined ? 0 : stringParts[4]*1 ) /* Seconds */
        );
}
function verifyURL(url) {
    var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    if(url.match(p)){
        return url.match(p)[1];
    }
    return false;
}
function convertMS(ms) {
    var d, h, m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;
    h += d * 24;
    return ((h!==0)?(h<10)?'0'+h+':':h+':':'')+((m<10)?'0'+m:m)+':'+((s<10)?'0'+s:s);
}
module.exports={
    data: new SlashCommandBuilder() 
        .setName('stream')
		.setDescription('get the live or the stream most recent')
        .addStringOption(option =>
            option.setName('stream')
                .setDescription('stream you want information about')
                .setRequired(false)),  
    async execute(interaction) {
        await interaction.deferReply();
        var verify,idVideo
        let streamlink=interaction.options.getString('stream')
        if(streamlink==null){
            verify = false;
        }else{
            verify = verifyURL(streamlink)
        }
        if(verify===false){
            let callvtuberkey = `select a.canal_alerta_key,v.id_vtuber
            from canal_alerta a 
            inner join vtuberlist v
            on a.id_canal_alerta = v.id_canal_alerta
            Where a.canal_alerta_key = '${interaction.channelId}'`;
            let key = await pool.query(callvtuberkey);
            if(key.length!==1) return interaction.editReply("Opcion no disponible en este canal");
            let selId_vtuber = `SELECT * FROM kujiraBot.video WHERE id_vtuber='${key[0].id_vtuber}' and estado=1 ORDER BY id_videos DESC`
            let urlvideos = await pool.query(selId_vtuber);
            if(urlvideos.length==0) return interaction.editReply("No hay stream disponible");
            idVideo = urlvideos[0].id_video
        }
        else{
            idVideo = verify
        }
        console.log(`Stream: ${idVideo}`);
        let apiurl = "https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet,liveStreamingDetails,contentDetails&fields=items(snippet(title,channelTitle,liveBroadcastContent),liveStreamingDetails(scheduledStartTime,concurrentViewers),statistics(viewCount),contentDetails(duration))&id="+idVideo+"&key="+apikey;
        const apirl = await fetch(apiurl);
        const r = await apirl.json();
        let stat=(r.items[0].snippet.liveBroadcastContent==="live")? "En Vivo":(r.items[0].snippet.liveBroadcastContent==="none")?"Finalizado":"En Espera";
        let img = "https://img.youtube.com/vi/"+idVideo+"/maxresdefault.jpg";
        let ltimg = "https://img.youtube.com/vi/"+idVideo+"/mqdefault.jpg";
        var view = "???",timestr;
        if(stat==="Finalizado"){
            let time = r.items[0].contentDetails.duration;
            let val = 1000 * parseDurationString(time);
            timestr = convertMS(val);
        }else{
            let startime = r.items[0].liveStreamingDetails.scheduledStartTime;
            let date = new Date(startime);
            let starmili = date.getTime();
            timestr = (stat==="En Espera")? `Inicia <t:${starmili/1000}:R>` :`Empezo <t:${starmili/1000}:R>`;
        }
        //Message Emmbed
        const embed = new MessageEmbed()
            .setTitle(`${r.items[0].snippet.title}`)
            .setImage(img)
            .setDescription(r.items[0].snippet.channelTitle)
            .setThumbnail(ltimg)
            .setColor("PURPLE")
            .addFields(
                { name: 'Status', value: `${stat}`, inline: true },
                { name: 'Time', value: `${timestr}`, inline: true },
                { name: 'Viewers', value: `${view}`, inline: true },
            )
            .setTimestamp()
            .setURL("https://www.youtube.com/watch?v="+idVideo)
        interaction.editReply({ embeds: [embed] });
    } 
}