const fs = require('fs');

// Fonction pour lire et modifier le fichier JSON
function modifyJsonFile(inputFilePath, outputFilePath) {
    // Lire le fichier JSON
    fs.readFile(inputFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erreur lors de la lecture du fichier JSON:', err);
            return;
        }

        try {
            // Convertir les données JSON en objet
            const jsonObject = JSON.parse(data);

            let result = {}
            let errorCount = 0

            jsonObject.forEach((c) => {
                let newCard = {}
 
                const cardId = c.id;
                let type = c.supertype
                if (type == "Trainer" && c.subtypes) {
                    if (c.subtypes.includes("Stadium")) {
                        type = "Trainer - Stadium"
                    } else if (c.subtypes.includes("Item")) {
                        type = "Trainer - Item"
                    } else if (c.subtypes.includes("Supporter")) {
                        type = "Trainer - Supporter"
                    } else if (c.subtypes.includes("Pokémon Tool")) {
                        type = "Trainer - Pokemon tool"
                    }
                }
                if (type == "Energy" && c.subtypes) {
                    if (c.subtypes.includes("Special")) {
                        type = "Energy - Special"
                    }
                }
                if (type == "Pokémon") {
                    type = "Pokemon"
                }
                /*if (c.type.toLowerCase().includes("spell")) {
                    type = "Pokemon"
                } else if (c.type.toLowerCase().includes("Stadium")) {
                    type = "Stadium"
                } else if (c.type.toLowerCase().includes("Supporter")) {
                    type = "Supporter"
                }*/
                const cardName = c.name + " " + (c.set.ptcgoCode ? c.set.ptcgoCode + " " : "") + c.number
                newCard = {
                    id: cardId,
                    face: {
                        front: {
                            name: cardName,
                            type: type,
                            cost: 0,
                            image: c.images.large,
                            isHorizontal: false
                        }
                    },
                    name: cardName,
                    type: type,
                    cost: 0,
                    rarity: c.rarity,
                    "Retreat cost": c.convertedRetreatCost,
                    hp: c.hp ? Number(c.hp) : 0,
                }
                if (result[cardId]) {
                    console.log("Error: card " + c.name + " already exist with id " + cardId)
                    errorCount += 1
                } else {
                    result[cardId] = newCard
                    //console.log("Error: card " + c.fullName + " has no color")
                    //errorCount += 1
                }
            })


            // Sauvegarder le nouvel objet JSON dans un nouveau fichier
            fs.writeFile(outputFilePath, JSON.stringify(result, null, 2), 'utf8', (err) => {
                if (err) {
                    console.error('Erreur lors de l\'écriture du fichier JSON:', err);
                } else {
                    console.log('Le fichier JSON a été modifié et sauvegardé sous', outputFilePath);
                    console.log("Saved " + Object.keys(result).length + " cards on the " + jsonObject.length + " expected. Failed for " + errorCount + " cards")
                }
            });
        } catch (e) {
            console.error('Erreur lors du traitement du fichier JSON:', e);
        }
    });
}

// Utilisation de la fonction
const inputFilePath = 'db.json';  // Chemin vers le fichier JSON d'entrée
const outputFilePath = 'PokemonCards.json';  // Chemin vers le fichier JSON de sortie
modifyJsonFile(inputFilePath, outputFilePath);




/*

Pokemon - 15
1 Iono's Bellibolt ex JTG 183
2 Iono's Bellibolt ex JTG 53
2 Iono's Kilowattrel JTG 55
3 Iono's Tadbulb JTG 52
1 Iono's Voltorb JTG 47
2 Iono's Wattrel JTG 54
3 Raging Bolt ex TEF 123
1 Squawkabilly ex PAL 169
Trainer - 34
2 Boss’s Orders (Ghetsis) PAL 172
3 Buddy-Buddy Poffin PRE 101
3 Earthen Vessel PRE 106
3 Energy Switch SVI 173
3 Iono PAF 80
3 Levincia JTG 150
3 Nest Ball PAF 84
2 Night Stretcher SFA 61
1 Prime Catcher PRE 119
2 Professor Sada's Vitality PRE 120
3 Professor's Research PRE 125
2 Superior Energy Retrieval PAL 189
4 Ultra Ball PAF 91
Energy - 11
3 Basic Fighting Energy 14
8 Basic Lightning Energy 12

sv4pt5-54 no set code ?
*/