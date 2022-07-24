const fetch = require("node-fetch");
const pool = require('../db-connection.js');
const config = require("../config.json");
const {MongoClient} = require('mongodb');
var mongoclient = new MongoClient(config.uri);
var offset;
module.exports = {
	name: 'messageCreate',
	async execute(message) {
		if (!message.content.startsWith(config.prefix) || message.author.bot) return; 
		const args = message.content.slice(config.prefix.length).trim().split(/ +/);
		if(args[0]!='t') return;
		const database = mongoclient.db('kujirabot');
        const Url = database.collection('Url');
        let callvtuberkey = `select a.canal_alerta_key,v.id_vtuber
        from kujiraBot.canal_alerta a 
        inner join kujiraBot.vtuberlist v
        on a.id_canal_alerta = v.id_canal_alerta
        Where a.canal_alerta_key = '${message.channel.id}'`;
		let key = await pool.query(callvtuberkey);
        if(key.length!==1) return message.channel.send("Opcion no disponible en este canal");
        console.log(key);
        let selId_vtuber = `SELECT * FROM kujiraBot.video WHERE id_vtuber='${key[0].id_vtuber}' and estado=1 ORDER BY id_videos DESC`
        let urlvideos = await pool.query(selId_vtuber);
        if(urlvideos.length===0) return message.channel.send("No esta en vivo ahora...");
		let apiurl = "https://www.googleapis.com/youtube/v3/videos?part=snippet,liveStreamingDetails&fields=items(snippet(title,liveBroadcastContent),liveStreamingDetails(actualStartTime))&id="+urlvideos[0].id_video+"&key="+config.apikey;
		const apirl = await fetch(apiurl);
        const r = await apirl.json();
        const query = { _id: `${urlvideos[0].id_video}`,titulo:`${r.items[0].snippet.title}`};
        offset = 5;
        let tag = "";
		if(args.length<=1) return message.channel.send("Coloca un tag...");
        if(!isNaN(args[1]))
        {
            offset = args[1];
            tag = args.slice(2,args.length).join(" ");
        }else{
            tag = args.slice(1,args.length).join(" ");
        }
		console.log("tag: "+tag,"offset: "+offset);
		let starmili = r.items[0].liveStreamingDetails.actualStartTime;
        let utcmili = new Date().toISOString();
        starmili = new Date(starmili);
        starmili = starmili.getTime();  
        utcmili = new Date(utcmili);
        utcmili = utcmili.getTime(); 
        let result=utcmili-starmili;
        console.log(offset);
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
		message.react('👌').catch(() => message.reply("👌"));
	}
	
};
/*
module.exports = {
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
        try {
            message.react('👌').catch(() => message.reply("👌"));
        } catch (error) {
            
        }
    } catch (err) {
        console.log(err);
    }
})();}}*/