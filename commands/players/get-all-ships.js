const {SlashCommandBuilder} = require('discord.js');
const axios  = require('axios')
const shipModel = require('../../models/ships')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('get-all-list')
        .setDescription("récupère la liste de TOUT les bateaux disponnible et renvoie leur nom,id, type"),

    async execute(interaction) {
        const {options, member, guild, client} = interaction;

        const appId = process.env.API_WHARSHIPS_ID;
        const apiUrl = 'https://api.worldofwarships.eu/wows/encyclopedia/ships/?application_id=4b3ef3163f5fb5cb7e95bd34080fcdd3&limit=+100&fields=name%2Cship_id%2Ctier%2Ctype%2Cnation';
        await interaction.deferReply()
// Fonction pour récupérer la liste complète des navires avec leur nom et ID
        async function getAllShips() {
            let allShips = [];
            let currentPage = 1;
            let totalPages = 1; // Initialisé à 1 pour entrer dans la boucle

            while (currentPage <= totalPages) {
                try {
                    // Envoi de la requête
                    const response = await axios.get(`${apiUrl}&page_no=${currentPage}`);
                    const shipsData = response.data.data;




                    // Traitement des résultats
                    const currentPageShips = Object.values(shipsData)
                        .map(shipData => {
                            const ship = {
                                name: shipData.name,
                                id: shipData.ship_id,
                                tier: shipData.tier,
                                type: shipData.type,
                                nation: shipData.nation,
                            };

                            return ship;
                        });

                    // Ajout des résultats à la liste complète
                    allShips = allShips.concat(currentPageShips);

                    // Mise à jour des informations de pagination
                    totalPages = response.data.meta.page_total;
                    currentPage++;

                } catch (error) {
                    console.error('Erreur lors de la récupération des navires :', error);
                    throw error;
                }
            }

            return allShips;
        }


// Exemple d'utilisation
// ...

// Exemple d'utilisation
        await getAllShips().then(async allShips => {
            // Créez un tableau de promesses pour l'envoi des messages
            const messagePromises = allShips.map(async ship => {
                const shipDB = await shipModel.findOne({id: ship.id})
                if(!shipDB) await shipModel.create({
                    name: ship.name,
                    id: ship.id,
                    nation: ship.nation,
                    tier: ship.tier,
                    type: ship.type,
                }).then(async () => {
                    await interaction.channel.send({ content: `
            - **Nom: \`\`${ship.name}\`\` - Ship Id: \`\`${ship.id}\`\` - Type: \`\`${ship.type}\`\` - Tiers: \`\`${ship.tier}\`\`**
        `});
                })

            });

            // Attendez que toutes les promesses soient résolues
            await Promise.all(messagePromises);

        }).catch(async (err) => {
            await interaction.channel.send(err);
        }).finally(() => {
            // Une fois que toutes les promesses sont résolues, envoyez le dernier message
            interaction.editReply({ content: "DONE" });
        });



    }
}

