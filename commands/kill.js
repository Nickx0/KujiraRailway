const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
var list = [
  'https://media2.giphy.com/media/yGZnLLLmHVEB2/giphy.gif',
  'https://cdn.myanimelist.net/s/common/uploaded_files/1459480838-8ea8a9d1f61eda18186bbf659f8e4162.gif',
  'https://pa1.narvii.com/7043/460d664897a25008a29f89b4f850e53324cad089r1-504-284_hq.gif',
  'https://img1.ak.crunchyroll.com/i/spire1/00339eaee2c1f9fe4b503f20240432fa1436108288_full.gif',
  'https://i.imgur.com/m8ZtlNO.gif',
  'https://pa1.narvii.com/5604/c5b85f84bb5c4976b4a76dd9e984e7ef0e9b5179_hq.gif',
  'https://images.squarespace-cdn.com/content/v1/5b23e822f79392038cbd486c/1651581718263-ACPRK3K7SF1B91HI92V7/tumblr_o0lbjtC84K1qimk8ao2_r1_540.gif',
  'https://data.whicdn.com/images/231782998/original.gif'
];
module.exports={
    data: new SlashCommandBuilder() 
        .setName('kill')
        .setDescription('kill someone')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to kill')
                .setRequired(true)),
    async execute(interaction) {
        let kill = list[Math.floor(Math.random() * list.length)];
        let user=interaction.options.getUser('user')
        if(user.id===interaction.applicationId) return interaction.reply("**NO ME MATES ...(*￣０￣)ノ**")
        if(interaction.member.user.id===user.id) return interaction.reply("**NO TE MATES A TI MISMO (っ °Д °;)っ**")
        const embed = new MessageEmbed()
            .setTitle(user.username + " fue atacado por " + interaction.member.user.username, interaction.guild.iconURL({ dynamic: true, format: 'png'}))
            .setImage(kill)
            .setURL(kill)
            .setColor("RANDOM")
            .setDescription((user.toString() + " acaba de morir a manos de " + interaction.member.user.toString()))
            .setTimestamp()
        await interaction.reply({ embeds: [embed],fetchReply: true} );
    }        
}