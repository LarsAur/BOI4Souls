"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const card_1 = require("./card");
class BOIGame {
    constructor(players) {
        this.players = players;
        this.monsterDeck = BOIGame.inplaceShuffle(card_1.getAllMonsterCards());
        this.lootDeck = BOIGame.inplaceShuffle(card_1.getAllLootCards());
        this.treasureDeck = BOIGame.inplaceShuffle(card_1.getAllTreasureCards());
        this.bonusSoulsDeck = card_1.getAllBonusCards();
        this.players.forEach((player) => {
            player.coins = 3;
            player.hand.push(...this.lootDeck.splice(0, 3));
            player.field.push(player.characterIndex);
            player.field.push(card_1.getEternalCardIdFromCharacterId(player.characterIndex));
        });
    }
    getGameData() {
        return {
            players: this.players,
            monsterDeck: this.monsterDeck,
            lootDeck: this.lootDeck,
            treasureDeck: this.treasureDeck,
            bonusSoulsDeck: this.bonusSoulsDeck,
        };
    }
    static inplaceShuffle(deck) {
        let m = deck.length;
        let t;
        let i;
        while (m !== 0) {
            // Select a random element in the first part of the array
            i = Math.floor(Math.random() * m--);
            // Swap the current index and the end of the first part
            t = deck[m];
            deck[m] = deck[i];
            deck[i] = t;
        }
        return deck;
    }
}
exports.default = BOIGame;
//# sourceMappingURL=game.js.map