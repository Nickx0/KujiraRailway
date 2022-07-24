const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require("node-fetch");
const uri = process.env.URI
const apikey = process.env.APIKEY
const {MongoClient} = require('mongodb');
const mongoclient = new MongoClient(uri);
const pool = require('../db-connection.js');
module.exports={
    data: new SlashCommandBuilder() 
        .setName('tag')
		.setDescription('tag of streams')
        .addStringOption(option =>
            option.setName('tag')
                .setDescription('tag of stream')
                .setRequired(true))
        .addNumberOption(option =>
            option.setName('offset')
                .setDescription('Mas offset del tag')
                .setRequired(false)),
    async execute(interaction) {
        await interaction.deferReply()
        let tag=interaction.options.getString('tag')
        let offset=interaction.options.getNumber('offset')
        console.log(offset)
        if(offset===null) offset=5;
        await mongoclient.connect();
        const database = mongoclient.db('kujirabot');
        const Url = database.collection('Url');
        console.log(interaction.channelId)
        let callvtuberkey = `select a.canal_alerta_key,v.id_vtuber
        from canal_alerta a 
        inner join vtuberlist v
        on a.id_canal_alerta = v.id_canal_alerta
        Where a.canal_alerta_key = '${interaction.channelId}'`;
        let key = await pool.query(callvtuberkey);
        if(key.length!==1) return interaction.editReply("Opcion no disponible en este canal");
        let selId_vtuber = `SELECT * FROM kujiraBot.video WHERE id_vtuber='${key[0].id_vtuber}' and estado=1 ORDER BY id_videos DESC`
        let urlvideos = await pool.query(selId_vtuber);
        if(urlvideos.length===0) return interaction.editReply("No esta en vivo ahora...");
        let apiurl = "https://www.googleapis.com/youtube/v3/videos?part=snippet,liveStreamingDetails&fields=items(snippet(title,liveBroadcastContent),liveStreamingDetails(actualStartTime))&id="+urlvideos[0].id_video+"&key="+apikey;
        apiurl = await fetch(apiurl);
        apiurl = await apiurl.json();
        let query = { _id: `${urlvideos[0].id_video}`,titulo:`${apiurl.items[0].snippet.title}`};
        let starmili = apiurl.items[0].liveStreamingDetails.actualStartTime;
        let utcmili = new Date().toISOString();
        utcmili = new Date(utcmili);
        utcmili = utcmili.getTime();
        starmili = new Date(starmili);
        starmili = starmili.getTime();  
        let result=utcmili-starmili;
        let tagTime = ((result/1000).toFixed())-offset;
        try {
            await Url.insertOne(query);
            Url.updateOne(
                { _id: `${urlvideos[0].id_video}` },
                { $push: { tag: `${tag}`,segundo:`${tagTime}` } }
            ) 
        } catch (error) {
            Url.updateOne(
                { _id: `${urlvideos[0].id_video}` },
                { $push: { tag: `${tag}`,segundo:`${tagTime}` } }
            )
        }
        interaction.editReply('👌').catch(() => {});
    }
}