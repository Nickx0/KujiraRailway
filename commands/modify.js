const { SlashCommandBuilder } = require('@discordjs/builders');
const {MongoClient} = require('mongodb');
const pool = require('../db-connection.js');
const uri = process.env.URI
var mongoclient = new MongoClient(uri);
module.exports={
    data: new SlashCommandBuilder() 
        .setName('modify')
		.setDescription('tag of streams')
        .addNumberOption(option =>
            option.setName('spetag')
                .setDescription('Specific the number of the tag')
                .setRequired(true))
        .addNumberOption(option =>
            option.setName('offset')
                .setDescription('Add or subtract time from the tag, use + or -')
                .setRequired(false))        
        .addStringOption(option =>
            option.setName('tag')
                .setDescription('replace tag')
                .setRequired(false)),  
    async execute(interaction) {
        await interaction.deferReply()
        let ntag=interaction.options.getNumber('spetag')
        let offset=interaction.options.getNumber('offset')
        let tag=interaction.options.getString('tag')
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
        await mongoclient.connect();
        const database = mongoclient.db('kujirabot');
        const Url = database.collection('Url');
        let dataVideo = await Url.findOne( { _id: `${urlvideos[0].id_video}` } )
        console.log(dataVideo)
        let Tag =(tag==null)?dataVideo.tag[ntag-1]:tag;
        offset =(offset==null)?dataVideo.segundo[ntag-1]:offset;
        if(tag==null) tag=dataVideo.tag[ntag-1];
        if(offset==null) offset=dataVideo.segundo[ntag-1];
        let Tags=dataVideo.tag[ntag-1]; 
        let secondsOfTag=dataVideo.segundo[ntag-1];
        let secondsOfNewTag = parseInt(secondsOfTag)+parseInt(offset);
        secondsOfNewTag = secondsOfNewTag.toString()
        Url.updateOne(
            { _id: `${urlvideos[0].id_video}`, segundo: secondsOfTag , tag : Tags},
            { $set: { "segundo.$" : secondsOfNewTag ,
                    "tag.$":Tag } }        
        )
    }  
}