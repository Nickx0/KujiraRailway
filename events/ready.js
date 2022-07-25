const Discord = require("discord.js");
var {vtuberlist,yTlives} = require('../lives.js');
const apikey = process.env.APIKEY
const fetch = require("node-fetch");
const pool = require('../db-connection.js');
const {YTLive} = require("../YTlive/YTlive");
//const getTwitchUserInfo = require("twitch-user-streaming-info");
var clientMessage
module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		vtuberlist = await listVtubers();
		clientMessage = client; 
        //checkTwitchLives();
        checkLives();
		checkVtubers();
		//checklastVideoRSS();
        console.log("Init!!");
}, 
};

async function listVtubers(){
	return pool.query(`select v.id_vtuber,v.nombre,v.channelid,v.twitch,v.activo,a.canal_alerta_key,
		c.value_color,e.logo
		from vtuberlist v 
		inner join canal_alerta a
		on v.id_canal_alerta = a.id_canal_alerta
		inner join empresa e
		on v.id_empresa = e.id_empresa
		inner join colores c
		on v.id_color=c.id_color order by id_vtuber`);
}
async function checkLives(){
	loadVTObjects(vtuberlist)
	//console.log(yTlives)
	try{
		setInterval(async function(){
		for (let ytlive of yTlives) {
			try {
			await ytlive.getLiveData();
			console.log(`LIVE: ${ytlive.liveId}`)
			updateStates(ytlive);
		} catch (error) {
			console.error(`LIVE: ${error}`);
			console.log(`LIVE: ${ytlive.id.channelId}`)
		}
		await sleep(300);
		//console.log(ytlive.getVideoInfo());
		}
		}, 120000); 
		} catch(err) {
			console.log(err);
		}
}
function loadVTObjects(vtuberlist){
    vtuberlist.forEach(element => {
        yTlives.push(new YTLive({channelId: element.channelid}))
        console.log(`LOADED: ${element.nombre} ${element.channelid}`)
    });
}
async function updateStates(live){
    try {
		let estado = (live.isLiveNow() ? 1:live.isWaiting() ? 2:0);//getting status live class
		let exists = await existLivedb(live.liveId);//load validador
		let vTuber = vtuberlist.find(vtuber => vtuber.channelid === live.getChannelId());
		if(exists){//validador if exist or no
			let db = await getLiveState(live.liveId);//getting status of live
			if(db.length!==0){//live finished, officialy finished in db
				if(db[0].estado!==estado){
					if(estado===1){//state 2 is imposible, but i don´t want to lose anything
						sendDMessage(live,estado,vTuber)//message sender
						checkFinisheds(vTuber)
					}
					await updateLiveStatedb(live.liveId,estado)
				}
			}
		}else{
			//let vTuber = vtuberlist.find(vtuber => vtuber.channelid === live.getChannelId());
			await setLivedb(vTuber,live.liveId,estado);
			if(estado!==0||live.isVideo()){
				sendDMessage(live,estado,vTuber);
			}
		checkFinisheds(vTuber);
		}
	} catch (error) {
		console.error(error);
	}
}
async function sleep(ms) {
    return new Promise((resolve) => {
		setTimeout(resolve, ms);
    });
}
async function setLivedb(vTuber,liveId,estado){
    return await pool.query(`INSERT INTO kujiraBot.video(id_videos,id_vtuber,id_video,estado) VALUES(NULL,'${vTuber.id_vtuber}','${liveId}',${estado})`);
}
async function updateLiveStatedb(liveId,estado){
    return await pool.query(`UPDATE kujiraBot.video SET estado = ${estado} WHERE id_video = '${liveId}';`);
}
async function existLivedb(live){
    let list = await pool.query(`SELECT * FROM kujiraBot.video WHERE id_video='${live}'`);
    return (list.length!=0)
}
async function getLiveState(liveId){
    return await pool.query(`select v.id_video as liveId,v.estado as estado
    from kujiraBot.video v
    where v.id_video='${liveId}' AND (estado=1 Or estado=2)`);
}
async function getLastestLives(channelId){
    return await pool.query(`select vi.id_video as liveId,vi.estado as estado
    from vtuberlist v 
    inner join video vi
    on v.id_vtuber = vi.id_vtuber
    where activo=1 AND v.channelid='${channelId}' AND (estado=1 Or estado=2)
    order by v.id_vtuber DESC`);
}
async function sendDMessage(live,estado,vTuber){
    let img = "https://img.youtube.com/vi/"+live.liveId+"/maxresdefault.jpg";
    let view ="???",timestr="",Status ="";
    if(estado===1){
		Status = `En Vivo`;
		view = live.getViewCount();
		let apiurl = "https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet,liveStreamingDetails&fields=items(snippet(title),liveStreamingDetails(actualStartTime),statistics(viewCount))&id="+live.liveId+"&key="+apikey;
		let apirl = await fetch(apiurl);
		let r = await apirl.json();
		let startime = r.items[0].liveStreamingDetails.actualStartTime;
		let date = new Date(startime);
		let starmili = date.getTime();
		timestr = `Empezo <t:${starmili/1000}:R>`;
    }else if(estado===2){
		Status = `En Espera`;
		timestr = `Inicia <t:${live.getScheduledStartTime()}:R>`
    }else if(live.isVideo()){
		Status = `Video`
		timestr = `${convertMS(live.getDuration()*1000)}`;
		view = live.getViewCount();
    }
    let embed = new Discord.MessageEmbed()
        .setTitle(`${live.getTitle()}`)
        .setImage(img)
        .setDescription(live.getProfileInfo().author)
        .setThumbnail(vTuber.logo)
        .setColor(vTuber.value_color)
        .addFields(
        { name: 'Status', value: `${Status}`, inline: true },
        { name: 'Time', value: `${timestr}`, inline: true },
        { name: 'Viewers', value: `${view}`, inline: true },
        )
        .setTimestamp()
        .setURL("https://www.youtube.com/watch?v="+live.liveId)
    clientMessage.channels.cache.get(vTuber.canal_alerta_key).send({ embeds: [embed]});
}
async function checkFinisheds(vTuber){
    try {
    let db = await getLastestLives(vTuber.channelid);
    if(db.length >0){
		for (let dblive of db) {
			let live = new YTLive({liveId: dblive.liveId});
			try {
				await live.getLiveData();
				let estado = (live.isLiveNow() ? 1:live.isWaiting() ? 2:0);
				console.log(`CheckF: ${live.liveId} state: ${estado}`)
				if(dblive.estado!==estado){
					if(estado===0) {
						updateLiveStatedb(live.liveId,estado)
					} 
				}
        } catch (error) {
			updateLiveStatedb(live.liveId,0)
        }
		}
    }
	} catch (error) {
	console.log(error);
	}
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
async function checkVtubers(){
	setInterval(async function(){
		let list = await listVtubers();
		let addList = Array();
		if (vtuberlist.length!==list.length){
			for (let vtuber of list) {
				let index = vtuberlist.indexOf(vtuber);
				addList.push(vtuberlist[index]);
			}
		loadVTObjects(addList);
		updateVTlist(addList);
	}
	}, 300000);
}
function updateVTlist(list){
    list.forEach(element => {
        vtuberlist.push(new YTLive({channelId: element.channelid}))
        console.log(`ADDED: ${element.nombre} ${element.channelid}`)
    });
}
async function checklastVideoRSS(){
	try{
		setInterval(async function(){
		for (let vtuber of vtuberlist) {
			let urs = "https://www.youtube.com/feeds/videos.xml?channel_id="+vtuber.channelid;
			let r = await fetch(urs);
			const body = await r.text();
			let LiveInfo="";
			const info = body.toString().match(/<yt:videoId>(.+?)<\//);
			if (info) {
				LiveInfo = info[1];
			}
			let live = new YTLive({liveId: LiveInfo});
			try {
				await live.getLiveData();
				if (live.liveId!==''){
					updateStates(live)
					console.log(`RSS: ${live.liveId}`)
				}else{
					console.log('RSS :'+live.id+" "+vtuber.channelid);
				}
			} catch (error) {
				console.error(`RSS: ${error}`);
				console.log(`RSS: ${vtuber.channelid}`)
			}
			await sleep(500);
		}
	}, 300000); 
	} catch(err) {
		console.log(err);
	}
  }
