const { MessageEmbed,MessageAttachment } = require('discord.js');

module.exports = {
	name: 'messageDelete',
	async execute(message) {
        try{
            if(message.author.bot) return;
            if(message.channel.type === 'dm') return;
            //if (!message.guild.member(client.user).hasPermission("EMBED_LINKS", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "VIEW_AUDIT_LOG", "SEND_MESSAGES")) return;
            const log = message.guild.channels.cache.find(log => log.name === "log")
            if(!log) return;
            //if(log.type !== "text") return; type new GUILD_TEXT
            //console.log(log.type)
            //if (!log.guild.member(client.user).hasPermission("EMBED_LINKS", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "VIEW_AUDIT_LOG", "SEND_MESSAGES")) return;
            if(log) {
                let final = message.toString().substr(0, 500); // Limit characters
                let messageSended = `${message.createdAt}`
                messageSended = messageSended.substring(messageSended.lastIndexOf('G') - 21, messageSended.lastIndexOf('G'))
                let embeds = [];
                //let tmpUrl = message.attachments.first().url;
                let delEmbed = new MessageEmbed()
                    .setTitle('Deleted message')
                    .setThumbnail(message.author.avatarURL())
                    //.setDescription(`${message.content}`)
                    .addField('Server', `${message.guild.name}`, true)
                    .addField('Time', `${messageSended}`, true)
                    .addField("Channel", `<#${message.channel.id}> (ID: ${message.channel.id})`)
                    .addField("Send By", `<@${message.author.id}> (ID: ${message.author.id})`)
                    .setColor('RANDOM')
                    .setFooter({ text: message.guild.name,iconURL: message.guild.iconURL()})
                    .setTimestamp()
                    .addField("Message", "```" + `${final}` + "```");
                    embeds.push(delEmbed);
                    log.send({ embeds: embeds});
                for (let adjunto of message.attachments.values()) {
                    log.send({files: [new MessageAttachment(adjunto.url)]});
                    /*if(adjunto.contentType.startsWith("image")){
                        log.send({files: [new MessageAttachment(adjunto.url)]});
                    }else if(adjunto.contentType.startsWith("video")){
                        log.send({files: [new MessageAttachment(adjunto.url)]});
                    }else{
                        log.send({files: [new MessageAttachment(adjunto.url)]});
                    }*/
                }
                /*log.send({ embeds: embeds});
                videos.forEach(element => {
                    log.send(element)
                });
                otro.forEach(element => {
                    log.send(element)
                });*/
            }
        }catch(err){
            console.log(err)
        }
    }
};