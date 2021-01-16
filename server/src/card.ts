export const NUMBER_OF_PLAYER_CARDS = 10;
export const NUMBER_OF_STARTING_CARDS = 10;
export const NUMBER_OF_BONUS_SOUL_CARDS = 3;
export const NUMBER_OF_TREASURE_CARDS = 105;
export const NUMBER_OF_LOOT_CARDS = 103;
export const NUMBER_OF_MONSTER_CARDS = 107;

export const NUMBER_OF_CARDS = NUMBER_OF_PLAYER_CARDS + NUMBER_OF_STARTING_CARDS + NUMBER_OF_BONUS_SOUL_CARDS + NUMBER_OF_TREASURE_CARDS + NUMBER_OF_LOOT_CARDS + NUMBER_OF_MONSTER_CARDS;

export const getCard = (id: number): Card => {
    if (id < 0 || id >= NUMBER_OF_CARDS) return null;
    return cards[id];
}

export const getEternalCardIdFromCharacterId = (id: number): number => {
    if (id < 0 || id >= NUMBER_OF_PLAYER_CARDS) return;
    return id + NUMBER_OF_PLAYER_CARDS
}

export class Card {
    cardId: number

    // Id corresponds to the index in the cards list
    constructor(id: number) {
        this.cardId = id;
    }
}

// 10 Character Cards (this is without eden)
// 10 Starting Cards
// 3 Bonus souls
// 105 Treasure Cards
// 103 Loot Cards 
// 107 Monster Cards

export const cards: Card[] = (new Array(NUMBER_OF_CARDS)).fill(0).map((_:any, index:number) => new Card(index));

export const getAllBonusCards = (): number[] => cards.slice(NUMBER_OF_PLAYER_CARDS + NUMBER_OF_STARTING_CARDS, NUMBER_OF_PLAYER_CARDS + NUMBER_OF_STARTING_CARDS + NUMBER_OF_BONUS_SOUL_CARDS).map((card:Card) => card.cardId);
export const getAllTreasureCards = (): number[] => cards.slice(NUMBER_OF_PLAYER_CARDS + NUMBER_OF_STARTING_CARDS + NUMBER_OF_BONUS_SOUL_CARDS, NUMBER_OF_PLAYER_CARDS + NUMBER_OF_STARTING_CARDS + NUMBER_OF_BONUS_SOUL_CARDS + NUMBER_OF_TREASURE_CARDS).map((card:Card) => card.cardId);
export const getAllLootCards = (): number[] => cards.slice(NUMBER_OF_PLAYER_CARDS + NUMBER_OF_STARTING_CARDS + NUMBER_OF_BONUS_SOUL_CARDS + NUMBER_OF_TREASURE_CARDS, NUMBER_OF_PLAYER_CARDS + NUMBER_OF_STARTING_CARDS + NUMBER_OF_BONUS_SOUL_CARDS + NUMBER_OF_TREASURE_CARDS + NUMBER_OF_LOOT_CARDS).map((card:Card) => card.cardId);
export const getAllMonsterCards = (): number[] => cards.slice(NUMBER_OF_PLAYER_CARDS + NUMBER_OF_STARTING_CARDS + NUMBER_OF_BONUS_SOUL_CARDS + NUMBER_OF_TREASURE_CARDS + NUMBER_OF_LOOT_CARDS, NUMBER_OF_PLAYER_CARDS + NUMBER_OF_STARTING_CARDS + NUMBER_OF_BONUS_SOUL_CARDS + NUMBER_OF_TREASURE_CARDS + NUMBER_OF_LOOT_CARDS + NUMBER_OF_MONSTER_CARDS).map((card:Card) => card.cardId);


