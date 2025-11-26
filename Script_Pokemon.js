const fs = require('fs');
const path = require('path');

const allCards = {};

// --- Process Data ---
const processCard = (c) => {
    const cardId = c.id;
    let type = c.supertype;

    if (type === "Trainer" && c.subtypes) {
        if (c.subtypes.includes("Stadium")) type = "Trainer - Stadium";
        else if (c.subtypes.includes("Item")) type = "Trainer - Item";
        else if (c.subtypes.includes("Supporter")) type = "Trainer - Supporter";
        else if (c.subtypes.includes("Pokémon Tool")) type = "Trainer - Pokemon tool";
    }

    if (type === "Energy" && c.subtypes?.includes("Special")) type = "Energy - Special";
    if (type === "Pokémon") type = "Pokemon";

    const cardName = c.name + (c.set?.ptcgoCode ? ` ${c.set.ptcgoCode}` : "") + ` ${c.number}`;

    return {
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
    };
};

// --- Génération à partir des fichiers locaux ---
const generateLocal = () => {
    console.log("📁 Lecture de SetList.json…");

    const setList = JSON.parse(fs.readFileSync("SetList.json", "utf8"));

    console.log(`📦 ${setList.length} sets trouvés.`);

    for (const set of setList) {
        const setFile = path.join("Sets", `${set.id}.json`);

        if (!fs.existsSync(setFile)) {
            console.warn(`⚠️ Fichier manquant : ${setFile}`);
            continue;
        }

        console.log(`   → Lecture du set ${set.id}…`);

        const cards = JSON.parse(fs.readFileSync(setFile, "utf8"));

        for (const c of cards) {

            // Nettoyage
            delete c.tcgplayer;
            delete c.cardmarket;
            delete c.flavorText;
            delete c.attacks;
            delete c.abilities;
            if (c.set) delete c.set.images;

            // Injection du set info
            c.set = set;

            const newCard = processCard(c);

            if (allCards[newCard.id]) {
                console.log(`⚠️ Duplicate card ${newCard.name} (${newCard.id})`);
            } else {
                allCards[newCard.id] = newCard;
            }
        }
    }

    fs.writeFileSync('PokemonCards.json', JSON.stringify(allCards, null, 2));
    console.log(`\n✅ Fini ! Total cartes : ${Object.keys(allCards).length}\n`);
};

generateLocal();
