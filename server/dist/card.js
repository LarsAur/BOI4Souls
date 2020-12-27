"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllMonsterCards = exports.getAllLootCards = exports.getAllTreasureCards = exports.getAllBonusCards = exports.cards = exports.Card = exports.getEternalCardIdFromCharacterId = exports.getCard = exports.NUMBER_OF_CARDS = exports.NUMBER_OF_MONSTER_CARDS = exports.NUMBER_OF_LOOT_CARDS = exports.NUMBER_OF_TREASURE_CARDS = exports.NUMBER_OF_BONUS_SOUL_CARDS = exports.NUMBER_OF_STARTING_CARDS = exports.NUMBER_OF_PLAYER_CARDS = void 0;
exports.NUMBER_OF_PLAYER_CARDS = 10;
exports.NUMBER_OF_STARTING_CARDS = 10;
exports.NUMBER_OF_BONUS_SOUL_CARDS = 3;
exports.NUMBER_OF_TREASURE_CARDS = 105;
exports.NUMBER_OF_LOOT_CARDS = 103;
exports.NUMBER_OF_MONSTER_CARDS = 107;
exports.NUMBER_OF_CARDS = exports.NUMBER_OF_PLAYER_CARDS + exports.NUMBER_OF_STARTING_CARDS + exports.NUMBER_OF_BONUS_SOUL_CARDS + exports.NUMBER_OF_TREASURE_CARDS + exports.NUMBER_OF_LOOT_CARDS + exports.NUMBER_OF_MONSTER_CARDS;
const getCard = (id) => {
    if (id < 0 || id >= exports.NUMBER_OF_CARDS)
        return null;
    return exports.cards[id];
};
exports.getCard = getCard;
const getEternalCardIdFromCharacterId = (id) => {
    if (id < 0 || id >= exports.NUMBER_OF_PLAYER_CARDS)
        return;
    return id + exports.NUMBER_OF_PLAYER_CARDS;
};
exports.getEternalCardIdFromCharacterId = getEternalCardIdFromCharacterId;
class Card {
    // Id corresponds to the index in the cards list
    constructor(id) {
        this.cardId = id;
        this.turned = false;
    }
    flip() {
        this.turned = !this.turned;
    }
}
exports.Card = Card;
// 10 Character Cards (this is without eden)
// 10 Starting Cards
// 3 Bonus souls
// 105 Treasure Cards
// 103 Loot Cards 
// 107 Monster Cards
exports.cards = (new Array(exports.NUMBER_OF_CARDS)).fill(0).map((_, index) => new Card(index));
const getAllBonusCards = () => exports.cards.slice(exports.NUMBER_OF_PLAYER_CARDS + exports.NUMBER_OF_STARTING_CARDS, exports.NUMBER_OF_PLAYER_CARDS + exports.NUMBER_OF_STARTING_CARDS + exports.NUMBER_OF_BONUS_SOUL_CARDS).map((card) => card.cardId);
exports.getAllBonusCards = getAllBonusCards;
const getAllTreasureCards = () => exports.cards.slice(exports.NUMBER_OF_PLAYER_CARDS + exports.NUMBER_OF_STARTING_CARDS + exports.NUMBER_OF_BONUS_SOUL_CARDS, exports.NUMBER_OF_PLAYER_CARDS + exports.NUMBER_OF_STARTING_CARDS + exports.NUMBER_OF_BONUS_SOUL_CARDS + exports.NUMBER_OF_TREASURE_CARDS).map((card) => card.cardId);
exports.getAllTreasureCards = getAllTreasureCards;
const getAllLootCards = () => exports.cards.slice(exports.NUMBER_OF_PLAYER_CARDS + exports.NUMBER_OF_STARTING_CARDS + exports.NUMBER_OF_BONUS_SOUL_CARDS + exports.NUMBER_OF_TREASURE_CARDS, exports.NUMBER_OF_PLAYER_CARDS + exports.NUMBER_OF_STARTING_CARDS + exports.NUMBER_OF_BONUS_SOUL_CARDS + exports.NUMBER_OF_TREASURE_CARDS + exports.NUMBER_OF_LOOT_CARDS).map((card) => card.cardId);
exports.getAllLootCards = getAllLootCards;
const getAllMonsterCards = () => exports.cards.slice(exports.NUMBER_OF_PLAYER_CARDS + exports.NUMBER_OF_STARTING_CARDS + exports.NUMBER_OF_BONUS_SOUL_CARDS + exports.NUMBER_OF_TREASURE_CARDS + exports.NUMBER_OF_LOOT_CARDS, exports.NUMBER_OF_PLAYER_CARDS + exports.NUMBER_OF_STARTING_CARDS + exports.NUMBER_OF_BONUS_SOUL_CARDS + exports.NUMBER_OF_TREASURE_CARDS + exports.NUMBER_OF_LOOT_CARDS + exports.NUMBER_OF_MONSTER_CARDS).map((card) => card.cardId);
exports.getAllMonsterCards = getAllMonsterCards;
//# sourceMappingURL=card.js.map