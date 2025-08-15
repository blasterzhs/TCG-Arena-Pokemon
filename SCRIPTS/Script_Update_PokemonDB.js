//const fetch = require('node-fetch'); 

let currentPage = 1;
const delay = 2200; // 2 secondes
const allCards = [];

const fetchPage = async (page) => {
    try {
        const response = await fetch(`https://api.pokemontcg.io/v2/cards?page=${page}`);
        let data = await response.json();

        data.data.forEach(cData => {
            delete cData.tcgplayer
            delete cData.cardmarket
            delete cData.flavorText
            delete cData.attacks
            delete cData.abilities
            if (cData.set) {
                delete cData.set.images
            }
        }); 

        allCards.push(...data.data); // ajoute les cartes à notre tableau
        console.log("Page " + page + " récupérée")
        if (data.data.length > 0) {
            setTimeout(() => fetchPage(page + 1), delay);
        } else {
            console.log("✅ Toutes les pages ont été récupérées.");
            console.log(`Total de cartes récupérées : ${allCards.length}`);

            // Tu peux ici sauvegarder dans un fichier si tu veux
            require('fs').writeFileSync('db.json', JSON.stringify(allCards, null, 2));
        }

    } catch (error) {
        console.error(`❌ Erreur à la page ${page} :`, error);
    }
};

fetchPage(currentPage);