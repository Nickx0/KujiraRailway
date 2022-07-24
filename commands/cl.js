const { SlashCommandBuilder } = require('@discordjs/builders');
async function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
module.exports={
    data: new SlashCommandBuilder()
        .setName('clean')
		.setDescription('Delete Messages - Moderation')
        .addNumberOption(option =>
            option.setName('cl')
                .setDescription('Number of messages to delete, max 100')
                .setRequired(true)),
    async execute(interaction) {
        let nm=(interaction.options.getNumber('cl'))+1
        async function dlt(amount){
            await interaction.reply(`Already deleting ${nm-1} messages...`)
            await sleep(2000)
            interaction.channel.bulkDelete(amount).catch(err => {
                console.error(err);
            })
        }
        if(interaction.member.user.id === "373887814963560448"){
            return dlt(nm)
        }
        if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
            return interaction.reply("**NO TIENES EL PERMISO PARA USAR EL COMANDO**");
        }
        if (nm <= 1 || nm > 100) {
            return interaction.reply('Necesitas poner un numero entre 1 y 99.');
        }
        dlt(nm);
    }
}