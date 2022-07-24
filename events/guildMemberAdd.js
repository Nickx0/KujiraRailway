const Discord = require('discord.js');
const Canvas = require('canvas')
const path = require('path');

module.exports = {
	name: 'guildMemberAdd',
	async execute(member) {
		const canvas = Canvas.createCanvas(1000, 500)
    const context = canvas.getContext('2d')
    const background = await Canvas.loadImage(
      path.join(__dirname, '../img/Bienvenida_Dark.png')
    )
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    context.strokeStyle = '#B5FE9A';
    context.strokeRect(0, 0, canvas.width, canvas.height);
    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'png' }));
    context.beginPath();
    context.arc(175, 255, 130, 0, Math.PI * 2, true);
    context.closePath();
    context.clip();
    context.drawImage(avatar, 45, 125, 260,260);
    var role= member.guild.roles.cache.find(role => role.name === "Neko");
    member.roles.add(role);
    const attachment = new Discord.MessageAttachment(canvas.toBuffer())
    console.log(member.guild.channels)
    member.guild.channels.cache.get('934895680370135050').send({content:`Welcome To The Server <@${member.user.id}>`, files: [attachment] });
	}
};