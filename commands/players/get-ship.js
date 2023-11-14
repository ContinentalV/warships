const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const axios  = require('axios')
const shipModel = require('../../models/ships')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('get-ship')
        .setDescription("récupère le detail d'un ship")
        .addNumberOption(option =>
        option
            .setName("ship-id")
            .setDescription("Indiquez l'id du ship")
            .setRequired(true)),

    async execute(interaction) {
        const {options, member, guild, client, user} = interaction;
        const idShip = options.getNumber("ship-id")
        const appId = process.env.API_WHARSHIPS_ID;
        const apiUrl = `https://api.worldofwarships.eu/wows/encyclopedia/ships/?application_id=${appId}&type=+&limit=+100&fields=+&ship_id=${idShip}&language=fr`;
        await interaction.deferReply()
        const response = await axios.get(apiUrl)
        const jsonObject = Object.values(response.data.data)
        const shipResult = jsonObject.map((el) => el)

        const embedShip = new EmbedBuilder()
            .setColor('Random')
            .setFooter({text: `request by: ${user.username}`, iconURL: client.user.displayAvatarURL({dynamic:true})})
            .setTimestamp()
            .setTitle(`${shipResult[0].name}`)
            .setThumbnail("https://img.freepik.com/photos-premium/drapeau-union-europeenne-ue_469558-1780.jpg")
            .setImage(`${shipResult[0].images.large}`)
            .setDescription(`
            
           - Description: ${shipResult[0].description}
           - Penium Ship: ${shipResult[0].is_premium}
           - Nation: ${shipResult[0].nation}
           
           - Prix en or: ${shipResult[0].price_golf}
           - Prix en credit: ${shipResult[0].price_credit}
           - Tier: ${shipResult[0].tier}
            
            
            `)

        await interaction.editReply({embeds: [embedShip]})






    }
}

